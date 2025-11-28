import React, { useMemo } from 'react';
import { formatNumber, parseNumber } from '../../utils/format';

type Props = {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  step?: number;
  tooltip?: string;
  postfix?: string;
};

export default function NumberInput({ label, value, onChange, min = 0, step = 1, tooltip, postfix }: Props) {
  const display = useMemo(() => formatNumber(value), [value]);
  return (
    <div className="field">
      <label>
        {label}
        {tooltip ? <span className="tooltip" aria-label={tooltip} title={tooltip}>ⓘ</span> : null}
      </label>
      <div className="input-wrap">
        <input
          className="input"
          inputMode="decimal"
          value={display}
          onChange={e => onChange(Math.max(min, parseNumber(e.target.value)))}
          onBlur={e => e.currentTarget.value = display}
          step={step}
        />
        {postfix ? <span className="postfix">{postfix}</span> : null}
      </div>
    </div>
  );
}
