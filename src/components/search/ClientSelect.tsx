'use client';

import React, { useState, useEffect } from 'react';

interface ClientSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className: string;
  disabled?: boolean;
}

export function ClientSelect({
  value,
  onChange,
  className,
  disabled
}: ClientSelectProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <select
      id="service-type"
      name="service-type"
      className={className}
      style={{ outline: '0', boxShadow: 'none', border: '0' } as React.CSSProperties}
      value={value}
      onChange={onChange}
      suppressHydrationWarning
      {...(mounted ? { 'data-form-type': 'other' } : {})}
      disabled={disabled}
    >
      <option value="">Any Service</option>
      <option value="24-hour">24-Hour Service</option>
      <option value="mobile">Mobile Service</option>
      <option value="remote">Remote/Online Service</option>
      <option value="free">Free Service</option>
      <option value="loan-signing">Loan Signing</option>
      <option value="real-estate">Real Estate</option>
      <option value="general">General Notary</option>
      <option value="apostille">Apostille Service</option>
      <option value="wedding">Wedding Officiant</option>
      <option value="business">Business Documents</option>
      <option value="immigration">Immigration Documents</option>
      <option value="medical">Medical Documents</option>
    </select>
  );
} 