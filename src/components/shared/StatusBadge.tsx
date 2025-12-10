import { cn } from '@/lib/utils';
import { WorkflowStatus } from '@/types/content';
import {
  FileEdit,
  Send,
  Eye,
  CheckCircle,
  Globe,
  XCircle,
} from 'lucide-react';

interface StatusBadgeProps {
  status: WorkflowStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const statusConfig: Record<WorkflowStatus, {
  label: string;
  icon: React.ElementType;
  className: string;
}> = {
  draft: {
    label: 'Draft',
    icon: FileEdit,
    className: 'bg-muted text-muted-foreground',
  },
  submitted: {
    label: 'Submitted',
    icon: Send,
    className: 'bg-info/10 text-info',
  },
  in_review: {
    label: 'In Review',
    icon: Eye,
    className: 'bg-warning/10 text-warning',
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle,
    className: 'bg-success/10 text-success',
  },
  published: {
    label: 'Published',
    icon: Globe,
    className: 'bg-primary/10 text-primary',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    className: 'bg-destructive/10 text-destructive',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function StatusBadge({
  status,
  size = 'md',
  showIcon = true,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        config.className,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </span>
  );
}
