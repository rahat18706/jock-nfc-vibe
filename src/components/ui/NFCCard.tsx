import { Wifi, Edit3, Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Card } from './Card';
import { Badge, StatusDot } from './Badge';

interface NFCCardProps {
  cardId: string;
  label: string;
  status: 'active' | 'suspended' | 'unassigned' | 'retired';
  destinationUrl: string;
  totalScans?: number;
  todayScans?: number;
  onEdit?: () => void;
  className?: string;
}

export function NFCCard({ 
  cardId, 
  label, 
  status, 
  destinationUrl, 
  totalScans,
  todayScans,
  onEdit,
  className = '' 
}: NFCCardProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(cardId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const statusLabels = {
    active: 'Active',
    suspended: 'Suspended',
    unassigned: 'Unassigned',
    retired: 'Retired',
  };
  
  const statusVariants = {
    active: 'success' as const,
    suspended: 'error' as const,
    unassigned: 'default' as const,
    retired: 'default' as const,
  };
  
  return (
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Wifi className="w-4 h-4 text-accent flex-shrink-0" />
            <h3 className="font-semibold text-foreground truncate">{label}</h3>
          </div>
          <div className="flex items-center gap-2">
            <code className="text-xs text-muted font-mono bg-card px-2 py-0.5 rounded border border-border">
              {cardId}
            </code>
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-card-hover transition-colors"
              aria-label="Copy card ID"
            >
              {copied ? (
                <Check className="w-3 h-3 text-success" />
              ) : (
                <Copy className="w-3 h-3 text-muted hover:text-foreground" />
              )}
            </button>
          </div>
        </div>
        
        <Badge variant={statusVariants[status]}>
          <StatusDot status={status} />
          {statusLabels[status]}
        </Badge>
      </div>
      
      {/* Destination */}
      <div className="mb-4">
        <p className="text-xs text-muted mb-1">Destination</p>
        <div className="flex items-center gap-2 text-sm">
          <ExternalLink className="w-3.5 h-3.5 text-muted flex-shrink-0" />
          <a 
            href={destinationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-accent transition-colors truncate"
          >
            {destinationUrl}
          </a>
        </div>
      </div>
      
      {/* Stats */}
      {(totalScans !== undefined || todayScans !== undefined) && (
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          {totalScans !== undefined && (
            <div>
              <p className="text-xs text-muted">Total Scans</p>
              <p className="text-lg font-semibold text-foreground">{totalScans.toLocaleString()}</p>
            </div>
          )}
          {todayScans !== undefined && (
            <div>
              <p className="text-xs text-muted">Today</p>
              <p className="text-lg font-semibold text-foreground">{todayScans}</p>
            </div>
          )}
        </div>
      )}
      
      {/* Edit Button */}
      {onEdit && status === 'active' && (
        <button
          onClick={onEdit}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border hover:bg-card-hover hover:border-accent/30 transition-all text-sm font-medium text-foreground"
        >
          <Edit3 className="w-4 h-4" />
          Change Destination
        </button>
      )}
    </Card>
  );
}
