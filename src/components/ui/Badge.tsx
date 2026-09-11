import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  icon?: ReactNode;
  className?: string;
}

export function Badge({ children, variant = 'default', icon, className = '' }: BadgeProps) {
  const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    default: 'bg-card border border-border text-foreground',
  };
  
  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

// Status indicator dot
interface StatusDotProps {
  status: 'active' | 'suspended' | 'unassigned' | 'retired';
  className?: string;
}

export function StatusDot({ status, className = '' }: StatusDotProps) {
  const statusClasses = {
    active: 'status-dot-active',
    suspended: 'status-dot-suspended',
    unassigned: 'status-dot-unassigned',
    retired: 'status-dot-unassigned',
  };
  
  return (
    <span className={`status-dot ${statusClasses[status]} ${className}`} />
  );
}
