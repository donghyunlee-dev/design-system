import { cn } from '../../utils/cn'

export interface StepperProps {
  steps: string[]
  current: number
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex items-center">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors',
              i < current  && 'bg-brand border-brand text-white',
              i === current && 'border-brand text-brand bg-surface',
              i > current  && 'border-border text-muted bg-surface',
            )}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={cn('text-xs whitespace-nowrap', i === current ? 'text-foreground font-medium' : 'text-muted')}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn('h-0.5 w-12 -mt-4 mx-1', i < current ? 'bg-brand' : 'bg-border')} />
          )}
        </div>
      ))}
    </div>
  )
}
