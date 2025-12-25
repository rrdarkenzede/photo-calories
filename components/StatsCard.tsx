'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import Card from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  goal?: string | number
  icon: LucideIcon
  color: 'blue' | 'green' | 'orange' | 'purple'
  progress?: number
}

export default function StatsCard({
  title,
  value,
  goal,
  icon: Icon,
  color,
  progress,
}: StatsCardProps) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600',
  }

  return (
    <Card hover gradient className="relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-dark-500 dark:text-dark-400 mb-1">{title}</p>
          <p className="text-3xl font-bold">
            {value}
            {goal && <span className="text-lg text-dark-400"> / {goal}</span>}
          </p>
        </div>
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            `bg-gradient-to-br ${colorClasses[color]}`
          )}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {progress !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-dark-500">Progrès</span>
            <span className="font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-dark-100 dark:bg-dark-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={cn('h-full bg-gradient-to-r', colorClasses[color])}
            />
          </div>
        </div>
      )}
    </Card>
  )
}