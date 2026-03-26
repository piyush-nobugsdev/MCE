'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-black text-white hover:bg-gray-800 shadow-sm active:scale-[0.98]',
      secondary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:scale-[0.98]',
      outline: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 active:scale-[0.98]',
      ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 active:scale-[0.98]',
      danger: 'bg-red-50 text-red-600 hover:bg-red-100 active:scale-[0.98]',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-xs font-semibold rounded h-8',
      md: 'px-4 py-2 text-sm font-semibold rounded h-10',
      lg: 'px-6 py-3 text-base font-semibold rounded-md h-12',
      icon: 'w-9 h-9 rounded flex items-center justify-center',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-all disabled:opacity-50 disabled:pointer-events-none outline-none font-bold',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
