import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
}

export function Button({
  variant = 'primary',
  disabled,
  style,
  className,
  children,
  ...rest
}: ButtonProps) {
  let baseClass = '';
  if (variant === 'primary') {
    baseClass = 'login-button';
  } else if (variant === 'secondary') {
    baseClass = 'btn-secondary';
  }

  const defaultStyles: Record<string, React.CSSProperties> = {
    primary: { margin: 0, width: 'auto', padding: '10px 20px', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
    secondary: { padding: '10px 20px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#e3eaf6', color: '#333333', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
    ghost: { padding: '8px 16px', borderRadius: 10, background: 'transparent', color: '#4285F4', fontWeight: 600, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
    icon: { padding: 6, borderRadius: 10, background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }
  };

  const customStyle: React.CSSProperties = {
    ...defaultStyles[variant],
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...style
  };

  return (
    <button
      className={className ? `${baseClass} ${className}`.trim() : baseClass || undefined}
      style={customStyle}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
