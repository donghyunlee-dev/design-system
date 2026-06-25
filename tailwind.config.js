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
        success:           'var(--color-success)',
        warning:           'var(--color-warning)',
        danger:            'var(--color-danger)',
        info:              'var(--color-info)',
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
    },
  },
  plugins: [],
}
