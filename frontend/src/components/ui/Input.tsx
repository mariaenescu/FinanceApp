import React from 'react';

export type InputProps = {
  multiline?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Input({
  multiline,
  style,
  className,
  ...rest
}: InputProps) {
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

  if (multiline) {
    return <textarea style={customStyle} className={className} {...(rest as any)} />;
  }

  return <input style={customStyle} className={className} {...(rest as any)} />;
}
