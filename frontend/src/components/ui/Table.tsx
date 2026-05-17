import React from 'react';

export function Table({ style, className, children, ...rest }: React.TableHTMLAttributes<HTMLTableElement>) {
  const customStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    ...style
  };
  return <table style={customStyle} className={className} {...rest}>{children}</table>;
}

export function TableHeader({ style, className, children, ...rest }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead style={style} className={className} {...rest}>{children}</thead>;
}

export function TableBody({ style, className, children, ...rest }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody style={style} className={className} {...rest}>{children}</tbody>;
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  header?: boolean;
}

export function TableRow({ header, style, className, children, ...rest }: TableRowProps) {
  const customStyle: React.CSSProperties = header ? {
    background: '#f8fafc',
    color: '#848484',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    ...style
  } : {
    transition: 'background 0.2s',
    ...style
  };
  return <tr style={customStyle} className={className} {...rest}>{children}</tr>;
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right';
}

export function TableHead({ align = 'left', style, className, children, ...rest }: TableHeadProps) {
  const customStyle: React.CSSProperties = {
    padding: '16px 24px',
    textAlign: align,
    ...style
  };
  return <th style={customStyle} className={className} {...rest}>{children}</th>;
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right';
}

export function TableCell({ align = 'left', style, className, children, ...rest }: TableCellProps) {
  const customStyle: React.CSSProperties = {
    padding: '16px 24px',
    textAlign: align,
    ...style
  };
  return <td style={customStyle} className={className} {...rest}>{children}</td>;
}
