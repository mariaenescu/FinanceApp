import React from 'react';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'code' | 'label';
  weight?: number | string;
  color?: string;
  size?: string | number;
}

export function Text({
  variant = 'body',
  weight,
  color,
  size,
  style,
  children,
  ...rest
}: TextProps) {
  const Component = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    body: 'p',
    caption: 'span',
    code: 'code',
    label: 'label'
  }[variant] as any;

  const defaultStyles: Record<string, React.CSSProperties> = {
    h1: { fontSize: 32, fontWeight: 800, margin: 0, color: '#333333' },
    h2: { fontSize: 24, fontWeight: 700, margin: 0, color: '#333333' },
    h3: { fontSize: 20, fontWeight: 700, margin: 0, color: '#333333' },
    h4: { fontSize: 18, fontWeight: 600, margin: 0, color: '#333333' },
    h5: { fontSize: 16, fontWeight: 600, margin: 0, color: '#333333' },
    h6: { fontSize: 14, fontWeight: 600, margin: 0, color: '#333333' },
    body: { fontSize: 16, margin: 0, color: '#333333' },
    caption: { fontSize: 14, color: '#848484' },
    code: { fontFamily: 'monospace', fontSize: 14 },
    label: { fontSize: 14, fontWeight: 600, color: '#333333', display: 'block' }
  };

  const customStyle: React.CSSProperties = {
    ...defaultStyles[variant],
    fontWeight: weight ?? defaultStyles[variant]?.fontWeight,
    color: color ?? defaultStyles[variant]?.color,
    fontSize: size !== undefined ? size : defaultStyles[variant]?.fontSize,
    ...style
  };

  return (
    <Component style={customStyle} {...rest}>
      {children}
    </Component>
  );
}
