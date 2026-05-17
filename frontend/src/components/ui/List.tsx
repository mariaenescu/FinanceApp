import React from 'react';

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  gap?: string | number;
}

export function List({
  gap,
  style,
  className,
  children,
  ...rest
}: ListProps) {
  const customStyle: React.CSSProperties = {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: gap !== undefined ? 'grid' : undefined,
    gap,
    ...style
  };

  return (
    <ul style={customStyle} className={className} {...rest}>
      {children}
    </ul>
  );
}

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  flex?: boolean;
  align?: string;
  justify?: string;
  gap?: string | number;
  padding?: string | number;
  bg?: string;
  borderRadius?: string | number;
  border?: string;
}

export function ListItem({
  flex,
  align,
  justify,
  gap,
  padding,
  bg,
  borderRadius,
  border,
  style,
  className,
  children,
  ...rest
}: ListItemProps) {
  return (
    <li className={className} {...rest}>
      {children}
    </li>
  );
}
