import React, { useState, useMemo } from 'react';
import { Shield } from 'lucide-react';

export interface RampBarItem {
  name: string;
  value: number;
  color?: string;
}

interface AscendingRampBarChartProps {
  data: RampBarItem[];
  total?: number;
  title?: string;
}

// Curated 10-color palette matching the reference infographic image
// 1. Cyan, 2. Lime, 3. Slate/Charcoal, 4. Teal/Ocean Blue, 5. Bright Lime/Chartreuse, etc.
export const RAMP_PALETTE = [
  '#00A7B5', // 1. Bright Cyan / Turquoise
  '#9BC53D', // 2. Fresh Lime Green
  '#4B5563', // 3. Slate / Charcoal
  '#0284C7', // 4. Ocean / Cerulean Blue
  '#A6CE39', // 5. Bright Lime
  '#6366F1', // 6. Indigo Accent
  '#EC4899', // 7. Vibrant Pink
  '#10B981', // 8. Emerald Green
  '#F59E0B', // 9. Warm Amber
  '#8B5CF6', // 10. Violet
];

export default function AscendingRampBarChart({ data, total }: AscendingRampBarChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Filter valid non-zero items and sort in ascending order so the ramp ascends left-to-right
  const { sortedItems, totalValue } = useMemo(() => {
    const valid = (data || []).filter((d) => Number(d.value) > 0);

    // If more than 7 items, show top 6 + "Others" so columns remain spacious and readable
    let itemsToUse: RampBarItem[] = [];
    if (valid.length > 7) {
      const desc = [...valid].sort((a, b) => b.value - a.value);
      const top6 = desc.slice(0, 6);
      const rest = desc.slice(6);
      const othersVal = rest.reduce((acc, c) => acc + c.value, 0);
      itemsToUse = [...top6, { name: 'Others', value: othersVal }];
    } else {
      itemsToUse = [...valid];
    }

    // Sort ascending so smallest is on the left and largest is on the right (ramp effect)
    const sorted = [...itemsToUse].sort((a, b) => a.value - b.value);
    const sum = total || sorted.reduce((acc, curr) => acc + curr.value, 0) || 1;
    return { sortedItems: sorted, totalValue: sum };
  }, [data, total]);

  // SVG dimensions & layout geometry
  const width = 640;
  const height = 340;
  const paddingLeft = 40;
  const paddingRight = 40;
  const baseY = 245;  // Ground baseline
  const topY = 40;    // Top boundary for pins and percentages

  const chartWidth = width - paddingLeft - paddingRight;
  const count = sortedItems.length;

  const segments = useMemo(() => {
    if (!count) return [];

    const colWidth = chartWidth / count;
    const gap = Math.min(8, Math.max(3, colWidth * 0.08));

    // Ramp heights: start at ~16% of available height and ascend to ~85%
    const availableH = baseY - topY - 20;
    const minRampH = availableH * 0.16;
    const maxRampH = availableH * 0.85;

    return sortedItems.map((item, i) => {
      const xStart = paddingLeft + i * colWidth + gap / 2;
      const xEnd = paddingLeft + (i + 1) * colWidth - gap / 2;
      const xMid = (xStart + xEnd) / 2;

      // Smooth linear ascending slope for the ramp polygon
      const startFrac = i / count;
      const endFrac = (i + 1) / count;

      const hStart = minRampH + startFrac * (maxRampH - minRampH);
      const hEnd = minRampH + endFrac * (maxRampH - minRampH);

      const yStartTop = baseY - hStart;
      const yEndTop = baseY - hEnd;

      // Color from palette
      const color = RAMP_PALETTE[i % RAMP_PALETTE.length];

      // Trapezoid polygon path for the ramp wedge
      const trapezoidPath = `M ${xStart.toFixed(1)} ${baseY} L ${xStart.toFixed(1)} ${yStartTop.toFixed(1)} L ${xEnd.toFixed(1)} ${yEndTop.toFixed(1)} L ${xEnd.toFixed(1)} ${baseY} Z`;

      // Percentage calculation
      const percentVal = (item.value / totalValue) * 100;
      const percentStr = `${Math.round(percentVal)}%`;

      // Top pin position
      const pinY = topY + 12;

      return {
        item,
        index: i,
        xStart,
        xEnd,
        xMid,
        yStartTop,
        yEndTop,
        pinY,
        trapezoidPath,
        color,
        percentStr,
        percentVal,
      };
    });
  }, [sortedItems, count, chartWidth, totalValue]);

  if (!sortedItems.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-1">
        <Shield size={32} className="opacity-20 mb-1" />
        <span className="text-xs font-semibold text-gray-500">No Life Insurance Data Available</span>
      </div>
    );
  }

  const activeSegment = hoveredIdx !== null ? segments[hoveredIdx] : null;

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-visible">
      {/* Floating Info Tooltip on Hover */}
      {activeSegment && (
        <div
          className="absolute top-1 right-3 z-20 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-xl px-3.5 py-2 shadow-lg transition-all animate-in fade-in zoom-in-95 pointer-events-none"
        >
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: activeSegment.color }}
            />
            <span className="font-bold text-gray-900 text-xs truncate max-w-[170px]">
              {activeSegment.item.name}
            </span>
          </div>
          <div className="text-[11px] text-gray-600 font-semibold pl-4">
            <strong className="text-[#2F439D] font-extrabold">{activeSegment.item.value}</strong> Policies ({activeSegment.percentVal.toFixed(1)}%)
          </div>
        </div>
      )}

      {/* SVG Ascending Ramp Infographic Canvas */}
      <svg
        viewBox={`0 0 ${width} 300`}
        className="w-full h-full max-h-[300px] overflow-visible"
      >
        <defs>
          {segments.map((seg) => (
            <linearGradient
              key={`ramp-grad-${seg.index}`}
              id={`ramp-grad-${seg.index}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={seg.color} stopOpacity={0.92} />
              <stop offset="100%" stopColor={seg.color} stopOpacity={0.78} />
            </linearGradient>
          ))}

          {/* Soft Ground Shadow Gradient */}
          <linearGradient id="groundRampShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" stopOpacity={0.10} />
            <stop offset="100%" stopColor="#0f172a" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* 1. Horizontal Ground Baseline (like the reference image) */}
        <line
          x1={paddingLeft - 18}
          y1={baseY}
          x2={width - paddingRight + 18}
          y2={baseY}
          stroke="#cbd5e1"
          strokeWidth={1.8}
          strokeLinecap="round"
        />

        {/* Soft shadow under ground */}
        <rect
          x={paddingLeft - 10}
          y={baseY}
          width={chartWidth + 20}
          height={6}
          fill="url(#groundRampShadow)"
        />

        {/* 2. Ascending Ramp Trapezoid Blocks & Needle Pins */}
        <g>
          {segments.map((seg) => {
            const isHovered = hoveredIdx === seg.index;

            return (
              <g
                key={`segment-${seg.index}`}
                onMouseEnter={() => setHoveredIdx(seg.index)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer transition-all duration-200"
              >
                {/* (a) Solid Ramp Trapezoid Polygon Wedge */}
                <path
                  d={seg.trapezoidPath}
                  fill={`url(#ramp-grad-${seg.index})`}
                  className="transition-all duration-200"
                  style={{
                    filter: isHovered
                      ? `drop-shadow(0 -4px 12px ${seg.color}60) brightness(1.08)`
                      : 'none',
                    opacity: hoveredIdx !== null && !isHovered ? 0.45 : 1,
                  }}
                />

                {/* (b) Vertical Pin Stem Line (extends from base through ramp to top pinhead) */}
                <line
                  x1={seg.xMid}
                  y1={baseY}
                  x2={seg.xMid}
                  y2={seg.pinY}
                  stroke={seg.color}
                  strokeWidth={isHovered ? 2.8 : 2}
                  strokeLinecap="round"
                  className="transition-all duration-200"
                  style={{
                    opacity: hoveredIdx !== null && !isHovered ? 0.4 : 1,
                  }}
                />

                {/* (c) Top Pinhead / Bullet Marker (at the top of the stem) */}
                <circle
                  cx={seg.xMid}
                  cy={seg.pinY}
                  r={isHovered ? 5.5 : 4.2}
                  fill={seg.color}
                  stroke="#ffffff"
                  strokeWidth={2}
                  className="transition-all duration-200"
                  style={{
                    filter: isHovered
                      ? `drop-shadow(0 2px 6px ${seg.color})`
                      : 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
                    opacity: hoveredIdx !== null && !isHovered ? 0.4 : 1,
                  }}
                />

                {/* (d) Percentage Value Label above the Pinhead */}
                <text
                  x={seg.xMid}
                  y={seg.pinY - 10}
                  textAnchor="middle"
                  className={`text-[12px] transition-all duration-200 ${isHovered
                    ? 'font-black fill-gray-950 scale-105'
                    : 'font-bold fill-gray-700'
                    }`}
                  style={{
                    opacity: hoveredIdx !== null && !isHovered ? 0.4 : 1,
                  }}
                >
                  {seg.percentStr}
                </text>

                {/* (e) Bottom Tick Accent on Baseline */}
                <line
                  x1={seg.xMid - 6}
                  y1={baseY}
                  x2={seg.xMid + 6}
                  y2={baseY}
                  stroke={seg.color}
                  strokeWidth={3}
                  strokeLinecap="round"
                />

                {/* (f) Company Label below Baseline */}
                <text
                  x={seg.xMid}
                  y={baseY + (count > 5 ? 18 : 20)}
                  textAnchor={count > 5 ? 'end' : 'middle'}
                  transform={
                    count > 5
                      ? `rotate(-28, ${seg.xMid}, ${baseY + 18})`
                      : undefined
                  }
                  className={`text-[10px] transition-all duration-200 ${isHovered
                    ? 'font-extrabold fill-[#2F439D]'
                    : 'font-semibold fill-gray-700'
                    }`}
                >
                  {seg.item.name.length > 13
                    ? `${seg.item.name.substring(0, 12)}..`
                    : seg.item.name}
                </text>

                {/* (g) Policy Count Badge below Company Name (when count <= 5) */}
                {count <= 5 && (
                  <text
                    x={seg.xMid}
                    y={baseY + 34}
                    textAnchor="middle"
                    className="text-[9.5px] font-bold fill-gray-400"
                  >
                    {seg.item.value} Pol
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
