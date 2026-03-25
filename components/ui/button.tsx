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
      primary: 'bg-black text-white hover:bg-gray-900 shadow-md active:scale-95',
      secondary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-95 shadow-blue-50',
      outline: 'bg-white text-gray-900 border border-gray-100 hover:bg-gray-50 active:scale-95',
      ghost: 'bg-transparent text-gray-600 hover:bg-gray-50 active:scale-95',
      danger: 'bg-red-50 text-red-600 hover:bg-red-100 active:scale-95',
    }

    const sizes = {
      sm: 'px-4 py-2 text-xs font-bold rounded-lg h-9',
      md: 'px-6 py-3 text-sm font-bold rounded-xl h-12',
      lg: 'px-10 py-4 text-base font-bold rounded-2xl h-16',
      icon: 'w-10 h-10 rounded-xl flex items-center justify-center',
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
