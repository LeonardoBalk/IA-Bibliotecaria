import { useState } from 'react';
import { UserRole } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';

interface ConsultationBookingProps {
  userRole: UserRole;
  onBook: (date: string, time: string) => void;
  onUpgrade?: () => void;
}

export default function ConsultationBooking({ userRole, onBook, onUpgrade }: ConsultationBookingProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const isBlocked = userRole === 'free';
  const hasLimit = userRole === 'intermediario';

  const availableSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
  ];

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      onBook(selectedDate, selectedTime);
      setSelectedDate('');
      setSelectedTime('');
    }
  };

  if (isBlocked) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neuro-blue/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-neuro-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
          Consultorias Bloqueadas
        </h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
          Faça upgrade para o plano Intermediário ou Full para agendar consultorias individuais.
        </p>
        <Button variant="primary" onClick={onUpgrade}>
          Fazer Upgrade
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-light-text dark:text-dark-text">
          Agendar Consultoria
        </h3>
        {hasLimit && (
          <Badge variant="primary">Limitado</Badge>
        )}
      </div>

      {hasLimit && (
        <div className="mb-6 p-4 bg-neuro-blue/5 border border-neuro-blue/20 rounded-neuro">
          <p className="text-sm text-light-text dark:text-dark-text">
            Seu plano permite <span className="font-semibold">consultorias limitadas</span>. 
            Faça upgrade para consultorias ilimitadas.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Date Picker */}
        <div>
          <label className="block text-sm font-medium mb-2 text-light-text dark:text-dark-text">
            Selecione a data
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="input w-full"
          />
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div>
            <label className="block text-sm font-medium mb-3 text-light-text dark:text-dark-text">
              Horários disponíveis
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2.5 px-4 rounded-neuro text-sm font-medium transition-all ${
                    selectedTime === time
                      ? 'bg-neuro-blue text-white'
                      : 'bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Confirmation */}
        {selectedDate && selectedTime && (
          <div className="pt-4 border-t border-light-border dark:border-dark-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Data e horário selecionados:
                </p>
                <p className="font-semibold text-light-text dark:text-dark-text">
                  {new Date(selectedDate).toLocaleDateString('pt-BR')} às {selectedTime}
                </p>
              </div>
            </div>
            <Button variant="primary" onClick={handleBooking} className="w-full">
              Confirmar Agendamento
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
