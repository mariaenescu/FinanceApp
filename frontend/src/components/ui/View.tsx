import React from 'react';

export interface ViewProps extends React.HTMLAttributes<HTMLDivElement> {
  flex?: boolean;
  direction?: 'row' | 'column';
  align?: string;
  justify?: string;
  gap?: string | number;
  padding?: string | number;
  bg?: string;
  borderRadius?: string | number;
  border?: string;
  grid?: boolean;
  gridCols?: string;
}

export function View({
  flex,
  direction,
  align,
  justify,
  gap,
  padding,
  bg,
  borderRadius,
  border,
  grid,
  gridCols,
  style,
  children,
  ...rest
}: ViewProps) {
  const customStyle: React.CSSProperties = {
    display: flex ? 'flex' : grid ? 'grid' : undefined,
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    gap,
    padding,
    backgroundColor: bg,
    borderRadius,
    border,
    gridTemplateColumns: gridCols,
    ...style
  };

  return (
    <div style={customStyle} {...rest}>
      {children}
    </div>
  );
}
