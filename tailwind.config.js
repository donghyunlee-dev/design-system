/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}', './.storybook/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand:             'var(--color-brand)',
        'brand-hover':     'var(--color-brand-hover)',
        surface:           'var(--color-surface)',
        'surface-raised':  'var(--color-surface-raised)',
        'surface-overlay': 'var(--color-surface-overlay)',
        foreground:        'var(--color-foreground)',
        secondary:         'var(--color-secondary)',
        muted:             'var(--color-muted)',
        border:            'var(--color-border)',
        // 브랜드 확장
        'brand-light':     'var(--color-brand-light)',
        'brand-subtle':    'var(--color-brand-subtle)',
        'on-brand':        'var(--color-on-brand)',
        // 서피스 확장
        'surface-subtle':  'var(--color-surface-subtle)',
        // 경계선 확장
        'border-subtle':   'var(--color-border-subtle)',
        'border-strong':   'var(--color-border-strong)',
        success:           'var(--color-success)',
        warning:           'var(--color-warning)',
        danger:            'var(--color-danger)',
        info:              'var(--color-info)',
        background:        'var(--color-background)',
        placeholder:       'var(--color-placeholder)',
      },
      borderRadius: {
        btn:   'var(--radius-btn)',
        card:  'var(--radius-card)',
        input: 'var(--radius-input)',
        badge: 'var(--radius-badge)',
      },
      fontFamily: {
        body: ['var(--font-body)'],
        code: ['var(--font-code)'],
      },
      boxShadow: {
        card:    'var(--shadow-card)',
        raised:  'var(--shadow-raised)',
        overlay: 'var(--shadow-overlay)',
        sm:      'var(--shadow-sm)',
        md:      'var(--shadow-md)',
        lg:      'var(--shadow-lg)',
        none:    'var(--shadow-none)',
      },
      spacing: {
        xs:  'var(--spacing-xs)',
        sm:  'var(--spacing-sm)',
        md:  'var(--spacing-md)',
        lg:  'var(--spacing-lg)',
        xl:  'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
      },
      transitionDuration: {
        fast:    '100ms',
        default: '150ms',
        slow:    '300ms',
      },
    },
  },
  plugins: [],
}
