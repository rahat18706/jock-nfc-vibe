import { Loader2, AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { Button } from './Button';

// Loading State
export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
      <p className="text-muted text-sm">{message}</p>
    </div>
  );
}

// Full Page Loading
export function FullPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center animate-fade-in">
        <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
        <p className="text-muted">Loading...</p>
      </div>
    </div>
  );
}

// Error State
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = 'Something went wrong', 
  message = 'We couldn\'t load your data. Please try again.',
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-error" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted text-sm text-center max-w-md mb-6">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} icon={<RefreshCw className="w-4 h-4" />}>
          Try again
        </Button>
      )}
    </div>
  );
}

// Empty State
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      {icon ? (
        <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mb-4">
          {icon}
        </div>
      ) : (
        <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mb-4">
          <Inbox className="w-6 h-6 text-muted" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-muted text-sm text-center max-w-md mb-6">{description}</p>
      )}
      {action && (
        <Button variant="secondary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Skeleton Loading
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-lg animate-pulse ${className}`} />
  );
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
