import { ReactNode } from 'react'
import { LoginSimple, LoginSimpleProps } from './LoginSimple'
import { cn } from '../../../utils/cn'

export interface LoginSplitProps extends LoginSimpleProps {
  brandTitle?: string
  brandDescription?: string
  brandImage?: string
  brandClassName?: string
}

export function LoginSplit({
  brandTitle, brandDescription, brandImage, brandClassName,
  className, ...loginProps
}: LoginSplitProps) {
  return (
    <div className={cn('min-h-screen flex', className)}>
      {/* Brand side */}
      <div
        className={cn(
          'hidden md:flex flex-col justify-center px-12 w-1/2 bg-brand text-white',
          brandImage && 'bg-cover bg-center',
          brandClassName
        )}
        style={brandImage ? { backgroundImage: `url(${brandImage})` } : undefined}
      >
        <div className={cn(brandImage && 'bg-black/40 p-8 rounded-card')}>
          {loginProps.logo && (
            <div className="mb-8 text-white">{loginProps.logo}</div>
          )}
          {brandTitle && (
            <h2 className="text-3xl font-bold leading-tight mb-3">{brandTitle}</h2>
          )}
          {brandDescription && (
            <p className="text-base opacity-80 leading-relaxed">{brandDescription}</p>
          )}
        </div>
      </div>

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm">
          <LoginSimple {...loginProps} className="min-h-0 bg-transparent p-0" />
        </div>
      </div>
    </div>
  )
}
