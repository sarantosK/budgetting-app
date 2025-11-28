import React, { useMemo } from 'react';

interface ChartProps {
  data: Array<{ label: string; value: number }>;
  height?: number;
  color?: string;
}

export default function Chart({ data, height = 240, color = '#60A5FA' }: ChartProps) {
  const { points, max } = useMemo(() => {
    const max = Math.max(1, ...data.map(d => d.value));
    const points = data.map((d, i) => ({ x: i, y: d.value, label: d.label }));
    return { points, max };
  }, [data]);

  const width = 720;
  const pad = 24;
  const xScale = (i: number) => pad + (i / Math.max(1, points.length - 1)) * (width - pad * 2);
  const yScale = (v: number) => height - pad - (v / max) * (height - pad * 2);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.y)}`).join(' ');

  return (
    <div className="chart-wrap">
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Chart">
        <defs>
          <linearGradient id={`area-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={path} fill="none" stroke={color} strokeWidth="2.5" />
        <path
          d={`${path} L ${xScale(points[points.length - 1]?.x || 0)} ${height - pad} L ${xScale(0)} ${height - pad} Z`}
          fill={`url(#area-${color})`}
          opacity="0.6"
        />
        {points.map((p, i) => (
          i % Math.ceil(points.length / 6 || 1) === 0 ? (
            <g key={i}>
              <line x1={xScale(p.x)} y1={height - pad} x2={xScale(p.x)} y2={height - pad + 6} stroke="#4B5563" />
              <text x={xScale(p.x)} y={height - pad + 18} fontSize="10" textAnchor="middle" fill="#9CA3AF">
                {p.label}
              </text>
            </g>
          ) : null
        ))}
      </svg>
    </div>
  );
}
