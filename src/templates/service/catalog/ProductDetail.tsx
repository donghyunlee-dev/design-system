import { ReactNode } from 'react'
import { Badge } from '../../../components/foundation/Badge'
import { Breadcrumb } from '../../../components/navigation/Breadcrumb'
import { Divider } from '../../../components/layout/Divider'
import { cn } from '../../../utils/cn'
import { BreadcrumbItem } from '../../types'

export interface ProductDetailProps {
  breadcrumb?: BreadcrumbItem[]
  images?: string[]
  badge?: string
  title: string
  price?: string
  description?: string
  details?: { label: string; value: string }[]
  actions?: ReactNode
  relatedItems?: ReactNode
  className?: string
}

export function ProductDetail({
  breadcrumb, images = [], badge, title, price,
  description, details = [], actions, relatedItems, className,
}: ProductDetailProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="max-w-6xl mx-auto px-[var(--page-padding)] py-[var(--spacing-lg)]">
        {breadcrumb && <Breadcrumb items={breadcrumb} />}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div>
            {images.length > 0 ? (
              <img src={images[0]} alt={title} className="w-full aspect-square object-cover rounded-card border border-border" />
            ) : (
              <div className="w-full aspect-square bg-surface-overlay rounded-card border border-border flex items-center justify-center text-muted text-sm">
                이미지 없음
              </div>
            )}
            {images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {images.slice(1).map((src, i) => (
                  <img key={i} src={src} alt="" className="w-16 h-16 object-cover rounded-input border border-border" />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {badge && <Badge className="mb-3">{badge}</Badge>}
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {price && <p className="text-3xl font-bold text-brand mt-2">{price}</p>}
            {description && <p className="mt-4 text-sm text-muted leading-relaxed">{description}</p>}

            {details.length > 0 && (
              <>
                <Divider className="my-4" />
                <dl className="grid grid-cols-2 gap-2">
                  {details.map(d => (
                    <div key={d.label}>
                      <dt className="text-xs text-muted">{d.label}</dt>
                      <dd className="text-sm font-medium text-foreground">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            {actions && <div className="mt-6 flex gap-3">{actions}</div>}
          </div>
        </div>

        {relatedItems && (
          <>
            <Divider className="my-10" />
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">관련 상품</h2>
              {relatedItems}
            </section>
          </>
        )}
      </div>
    </div>
  )
}
