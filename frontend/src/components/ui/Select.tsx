import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: { label: string; value: string | number }[] | string[];
  placeholder?: string;
}

export function Select({
  options = [],
  placeholder,
  style,
  className,
  children,
  ...rest
}: SelectProps) {
  const customStyle: React.CSSProperties = {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    fontSize: 15,
    backgroundColor: '#ffffff',
    fontFamily: 'inherit',
    ...style
  };

  return (
    <select style={customStyle} className={className} {...rest}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt, i) => {
        if (typeof opt === 'string') {
          return <option key={i} value={opt}>{opt}</option>;
        }
        return <option key={i} value={opt.value}>{opt.label}</option>;
      })}
      {children}
    </select>
  );
}
