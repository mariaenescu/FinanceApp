import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: string | number;
  bg?: string;
  color?: string;
  borderRadius?: string | number;
  border?: string;
  flex?: boolean;
  direction?: 'row' | 'column';
  align?: string;
  justify?: string;
  gap?: string | number;
}

export function Card({
  padding,
  bg,
  color,
  borderRadius,
  border,
  flex,
  direction,
  align,
  justify,
  gap,
  style,
  className,
  children,
  ...rest
}: CardProps) {
  const customStyle: React.CSSProperties = {
    padding,
    backgroundColor: bg,
    color,
    borderRadius,
    border,
    display: flex ? 'flex' : undefined,
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    gap,
    ...style
  };

  const fullClassName = className ? `card ${className}`.trim() : 'card';

  return (
    <div className={fullClassName} style={customStyle} {...rest}>
      {children}
    </div>
  );
}
