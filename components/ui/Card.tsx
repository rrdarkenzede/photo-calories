'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  hover?: boolean
  gradient?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, gradient = false, children, ...props }, ref) => {
    const MotionDiv = motion.div

    return (
      <MotionDiv
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={hover ? { y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } : undefined}
        className={cn(
          'rounded-2xl p-6 transition-all duration-300',
          gradient
            ? 'bg-gradient-to-br from-white to-gray-50 dark:from-dark-800 dark:to-dark-900'
            : 'bg-white dark:bg-dark-800',
          'border border-gray-200 dark:border-dark-700',
          'shadow-sm',
          className
        )}
        {...(props as any)}
      >
        {children}
      </MotionDiv>
    )
  }
)

Card.displayName = 'Card'

export default Card