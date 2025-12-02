-- migration_bibliotecaria.sql
-- Versão única agregando extensões, alterações e novas tabelas para IA bibliotecária / planos / mensagens / agendamentos.
-- Execute em Supabase (Postgres). Idempotente na medida do possível.

BEGIN;

/* ========================= EXTENSIONS ========================= */
CREATE EXTENSION IF NOT EXISTS vector; -- para índices vetoriais
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- gen_random_uuid()

/* ========================= ALTER usuarios ========================= */
ALTER TABLE public.usuarios
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_status text,
  ADD COLUMN IF NOT EXISTS mensagens_enviadas_mes int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS consultorias_agendadas_mes int DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'usuarios_role_check'
  ) THEN
    ALTER TABLE public.usuarios
      ADD CONSTRAINT usuarios_role_check CHECK (role IN ('free','intermediate','full'));
  END IF;
END$$;

-- Backfill role para nulls (caso execute em base existente)
UPDATE public.usuarios SET role='free' WHERE role IS NULL;

/* ========================= ALTER documents ========================= */
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS summary text,
  ADD COLUMN IF NOT EXISTS topic text,
  ADD COLUMN IF NOT EXISTS format text,
  ADD COLUMN IF NOT EXISTS level text DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS role_min text DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS popularity_score real DEFAULT 0,
  ADD COLUMN IF NOT EXISTS extra jsonb DEFAULT '{}'::jsonb;

-- Converter embedding para vector(768) se ainda não for (assumindo armazenável)
DO $$
DECLARE
  coltype text;
BEGIN
  SELECT atttypid::regtype::text INTO coltype
  FROM pg_attribute
  WHERE attrelid = 'public.documents'::regclass
    AND attname = 'embedding'
    AND attnum > 0
    AND NOT attisdropped;
  IF coltype IS NOT NULL AND coltype <> 'vector' THEN
    BEGIN
      ALTER TABLE public.documents ALTER COLUMN embedding TYPE vector(768) USING embedding;  -- poderá falhar se formato incompatível
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Não foi possível converter embedding automaticamente: %', SQLERRM;
    END;
  END IF;
END$$;

/* ========================= plans ========================= */
CREATE TABLE IF NOT EXISTS public.plans (
  key text PRIMARY KEY,
  name text NOT NULL,
  description text,
  stripe_price_id text,
  allows_consultorias int,
  allows_mensagens int,
  features text[] DEFAULT '{}'::text[],
  created_at timestamptz DEFAULT now()
);

/* ========================= user_subscriptions ========================= */
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id int REFERENCES public.usuarios(id) ON DELETE CASCADE,
  plan_key text REFERENCES public.plans(key),
  stripe_subscription_id text,
  status text,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS user_subscriptions_usuario_idx ON public.user_subscriptions(usuario_id);

/* ========================= messages ========================= */
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id int REFERENCES public.usuarios(id) ON DELETE CASCADE,
  text text NOT NULL,
  file_url text,
  status text DEFAULT 'pending', -- pending|handled|error
  created_at timestamptz DEFAULT now(),
  handled_at timestamptz,
  meta jsonb DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS messages_usuario_status_idx ON public.messages(usuario_id, status);

/* ========================= schedule_events ========================= */
CREATE TABLE IF NOT EXISTS public.schedule_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id int REFERENCES public.usuarios(id) ON DELETE CASCADE,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  status text DEFAULT 'booked', -- booked|canceled|completed
  google_event_id text,
  created_at timestamptz DEFAULT now(),
  canceled_at timestamptz,
  notes text
);
CREATE INDEX IF NOT EXISTS schedule_events_usuario_idx ON public.schedule_events(usuario_id);
CREATE INDEX IF NOT EXISTS schedule_events_time_range_idx ON public.schedule_events(starts_at, ends_at);

/* ========================= document_interactions ========================= */
CREATE TABLE IF NOT EXISTS public.document_interactions (
  id bigserial PRIMARY KEY,
  usuario_id int REFERENCES public.usuarios(id) ON DELETE CASCADE,
  document_id bigint REFERENCES public.documents(id) ON DELETE CASCADE,
  tipo text NOT NULL, -- view|click|like|completion
  peso int DEFAULT 1,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS document_interactions_user_doc_idx ON public.document_interactions(usuario_id, document_id);
CREATE INDEX IF NOT EXISTS document_interactions_doc_idx ON public.document_interactions(document_id);

/* ========================= ia_logs ========================= */
CREATE TABLE IF NOT EXISTS public.ia_logs (
  id bigserial PRIMARY KEY,
  usuario_id int REFERENCES public.usuarios(id) ON DELETE SET NULL,
  sessao_id uuid REFERENCES public.sessoes(id) ON DELETE SET NULL,
  evento text, -- chat|recommendation|classification
  prompt_tokens int,
  completion_tokens int,
  modelo text,
  created_at timestamptz DEFAULT now(),
  meta jsonb DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS ia_logs_usuario_idx ON public.ia_logs(usuario_id);
CREATE INDEX IF NOT EXISTS ia_logs_sessao_idx ON public.ia_logs(sessao_id);

/* ========================= INDEXES documents ========================= */
CREATE INDEX IF NOT EXISTS documents_topic_idx ON public.documents(topic);
CREATE INDEX IF NOT EXISTS documents_tags_gin ON public.documents USING GIN(tags);
CREATE INDEX IF NOT EXISTS documents_level_idx ON public.documents(level);
-- Vetorial (requer embedding vector e dados suficientes para ivfflat):
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE c.relname='documents_embedding_idx' AND n.nspname='public'
  ) THEN
    BEGIN
      CREATE INDEX documents_embedding_idx ON public.documents USING ivfflat (embedding vector_cosine_ops) WITH (lists=100);
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Índice vetorial não criado: %', SQLERRM;
    END;
  END IF;
END$$;

/* ========================= VIEW uso mensal ========================= */
CREATE OR REPLACE VIEW public.user_document_usage_month AS
SELECT usuario_id,
       date_trunc('month', created_at) AS mes,
       count(*) FILTER (WHERE tipo='view')   AS views,
       count(*) FILTER (WHERE tipo='click')  AS clicks,
       count(*) FILTER (WHERE tipo='like')   AS likes
FROM public.document_interactions
GROUP BY usuario_id, date_trunc('month', created_at);

/* ========================= TRIGGER updated_at (documents) ========================= */
CREATE OR REPLACE FUNCTION public.touch_documents_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS documents_updated_at_trg ON public.documents;
CREATE TRIGGER documents_updated_at_trg
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.touch_documents_updated_at();

/* ========================= SEED plans ========================= */
INSERT INTO public.plans (key,name,description,stripe_price_id,allows_consultorias,allows_mensagens,features)
VALUES
('free','Free','Plano gratuito','price_free',0,0,'{}'),
('intermediate','Intermediário','Plano médio','price_intermediate',2,5,'{chat-limit,consultorias-limit}'),
('full','Full','Plano completo','price_full',NULL,NULL,'{consultorias-ilimitadas,mensagens-ilimitadas}')
ON CONFLICT (key) DO NOTHING;

COMMIT;

-- FIM da migração bibliotecária
