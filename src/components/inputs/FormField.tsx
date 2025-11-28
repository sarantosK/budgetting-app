import React, { useMemo } from 'react';
import { formatNumber, parseNumber } from '../../utils/helpers';

interface FormFieldProps {
  label: string;
  value: number | string;
  onChange: (value: number | string) => void;
  type?: 'number' | 'text' | 'date';
  min?: number;
  step?: number;
  tooltip?: string;
  postfix?: string;
}

export default function FormField({ 
  label, value, onChange, type = 'number', min = 0, step = 1, tooltip, postfix 
}: FormFieldProps) {
  const display = useMemo(() => 
    type === 'number' ? formatNumber(value as number) : value, 
    [value, type]
  );

  return (
    <div className="field">
      <label>
        {label}
        {tooltip && <span className="tooltip" title={tooltip}>ⓘ</span>}
      </label>
      <div className="input-wrap">
        <input
          className="input"
          type={type === 'number' ? 'text' : type}
          inputMode={type === 'number' ? 'decimal' : undefined}
          value={display}
          onChange={e => onChange(
            type === 'number' 
              ? Math.max(min, parseNumber(e.target.value))
              : e.target.value
          )}
          onBlur={e => type === 'number' && (e.currentTarget.value = formatNumber(value as number))}
          step={step}
        />
        {postfix && <span className="postfix">{postfix}</span>}
      </div>
    </div>
  );
}
