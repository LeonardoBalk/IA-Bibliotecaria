import { Document, UserRole } from '../types';
import Card from './ui/Card';
import Badge from './ui/Badge';

interface ContentCardProps {
  document: Document;
  userRole: UserRole;
  onClick?: () => void;
}

export default function ContentCard({ document, userRole, onClick }: ContentCardProps) {
  const roleHierarchy: Record<UserRole, number> = { free: 0, intermediario: 1, full: 2 };
  const isLocked = roleHierarchy[userRole] < roleHierarchy[document.role_min];

  const typeIcons = {
    video: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    article: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    exercise: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  };

  return (
    <Card hover={!isLocked} onClick={!isLocked ? onClick : undefined}>
      <div className="relative">
        {/* Thumbnail */}
        <div className="aspect-video w-full bg-light-bg dark:bg-dark-bg rounded-t-neuro overflow-hidden">
          {document.thumbnail ? (
            <img 
              src={document.thumbnail} 
              alt={document.title}
              className={`w-full h-full object-cover ${isLocked ? 'blur-sm opacity-50' : ''}`}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${isLocked ? 'opacity-30' : 'opacity-50'}`}>
              {typeIcons[document.type]}
            </div>
          )}
        </div>

        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-t-neuro">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-xs text-white font-medium">Requer plano superior</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-light-text-secondary dark:text-dark-text-secondary">
              {typeIcons[document.type]}
            </div>
            <Badge variant="primary">{document.level}</Badge>
            {isLocked && <Badge variant="neutral">Bloqueado</Badge>}
          </div>
          
          <h3 className={`font-semibold text-light-text dark:text-dark-text mb-2 line-clamp-2 ${isLocked ? 'opacity-60' : ''}`}>
            {document.title}
          </h3>
          
          <p className={`text-sm text-light-text-secondary dark:text-dark-text-secondary line-clamp-2 ${isLocked ? 'opacity-50' : ''}`}>
            {document.description}
          </p>
        </div>
      </div>
    </Card>
  );
}
