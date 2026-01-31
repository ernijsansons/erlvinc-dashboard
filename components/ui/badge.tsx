import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline'
}

function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        {
          'bg-[#111827] text-white border border-[#1e293b]': variant === 'default',
          'bg-[#1e293b] text-[#64748b]': variant === 'secondary',
          'border border-[#1e293b] text-[#64748b]': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
