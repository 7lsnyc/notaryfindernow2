'use client';

import React, { useState, useEffect } from 'react';

interface ClientInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className: string;
  disabled?: boolean;
}

export function ClientInput({
  value,
  onChange,
  placeholder,
  className,
  disabled
}: ClientInputProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <input
      type="text"
      id="location-input"
      name="location"
      className={className}
      style={{
        outline: 'none',
        boxShadow: 'none',
        border: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete="off"
      suppressHydrationWarning
      {...(mounted ? { 'data-form-type': 'other' } : {})}
      disabled={disabled}
    />
  );
} 