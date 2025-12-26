'use client'

import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
}

export default function Badge({ 
  className, 
  variant = 'default', 
  size = 'md',
  children, 
  ...props 
}: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-dark-200',
    success: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  }

  const sizes: Record<string, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}