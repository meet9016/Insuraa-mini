import React, { useState, useMemo } from 'react';

export interface Stepped3DPieItem {
  name: string;
  value: number;
  color?: string;
}

interface Stepped3DPieChartProps {
  data: Stepped3DPieItem[];
  total?: number;
  title?: string;
}

// Curated spectrum matching the reference 2D flat pie image
const REFERENCE_SPECTRUM = [
  '#4A90E2', // Blue
  '#48C971', // Green
  '#F58231', // Orange
  '#9B59B6', // Purple
  '#F76C82', // Pink
  '#E74C3C', // Red
  '#00BCD4', // Cyan
  '#F1C40F', // Yellow
  '#00B894', // Mint
  '#A366FF', // Light Purple
  '#FF9F43', // Peach
  '#1DD1A1', // Light Teal
];

export default function Stepped3DPieChart({ data, total }: Stepped3DPieChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Filter out zero or invalid items and sort by value descending
  const { validItems, totalValue } = useMemo(() => {
    const nonZero = (data || []).filter((d) => Number(d.value) > 0);
    // Sort descending so the highest value gets the largest slice at top-right
    const sorted = [...nonZero].sort((a, b) => b.value - a.value);
    const sum = total || sorted.reduce((acc, curr) => acc + curr.value, 0) || 1;
    return { validItems: sorted, totalValue: sum };
  }, [data, total]);

  // Geometry configuration
  const cx = 370;
  const cy = 160;
  const R = 145;

  // Build 2D slice definitions
  const slices = useMemo(() => {
    if (!validItems.length) return [];

    // Start at -90 degrees (top)
    let currentAngle = -Math.PI / 2;
    const n = validItems.length;

    return validItems.map((item, index) => {
      const sliceAngle = (item.value / totalValue) * Math.PI * 2;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;

      const percent = ((item.value / totalValue) * 100).toFixed(1);

      // Color selection
      const baseColor = item.color || REFERENCE_SPECTRUM[index % REFERENCE_SPECTRUM.length];

      const x1 = cx + R * Math.cos(startAngle);
      const y1 = cy + R * Math.sin(startAngle);
      const x2 = cx + R * Math.cos(endAngle);
      const y2 = cy + R * Math.sin(endAngle);

      const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

      let path = '';
      if (n === 1) {
        // Full circle if only one item
        path = `M ${cx} ${cy} m -${R}, 0 a ${R},${R} 0 1,0 ${R * 2},0 a ${R},${R} 0 1,0 -${R * 2},0`;
      } else {
        path = `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${largeArcFlag} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
      }

      return {
        item,
        index,
        startAngle,
        endAngle,
        percent,
        baseColor,
        path,
      };
    });
  }, [validItems, totalValue]);

  if (!validItems.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-1">
        <span className="text-xs font-semibold text-gray-500">No General Insurance Data Available</span>
      </div>
    );
  }

  const activeSlice = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Active Floating Info Card on Hover */}
      {activeSlice && (
        <div
          className="absolute top-2 right-4 z-20 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-xl px-3.5 py-2 shadow-lg transition-all animate-in fade-in zoom-in-95 pointer-events-none"
        >
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: activeSlice.baseColor }}
            />
            <span className="font-bold text-gray-900 text-xs truncate max-w-[170px]">
              {activeSlice.item.name}
            </span>
          </div>
          <div className="text-[11px] text-gray-600 font-semibold pl-4">
            <strong className="text-[#2F439D] font-extrabold">{activeSlice.item.value}</strong> Policies ({activeSlice.percent}%)
          </div>
        </div>
      )}

      {/* SVG 2D Flat Pie Chart Canvas */}
      <style>{`
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .pie-spin {
          animation: slow-spin 30s linear infinite;
          transform-origin: 370px 160px;
        }
        .pie-spin:hover {
          animation-play-state: paused;
        }
      `}</style>
      <svg
        viewBox="0 0 740 320"
        className="w-full h-full max-h-[320px] overflow-visible"
        style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.06))' }}
      >
        <g className="pie-spin">
          {slices.map((s) => {
            const isHovered = hoveredIdx === s.index;
            const scale = isHovered ? 1.04 : 1;

            return (
              <path
                key={`slice-2d-${s.index}`}
                d={s.path}
                fill={s.baseColor}
                stroke="#ffffff"
                strokeWidth={isHovered ? 4 : 2}
                strokeLinejoin="round"
                onMouseEnter={() => setHoveredIdx(s.index)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer transition-all duration-300 ease-out"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: `${cx}px ${cy}px`,
                }}
              />
            );
          })}
        </g>
      </svg>

      {/* Legend below the chart to replace the old scattered callouts */}
      <div className="w-full flex flex-wrap justify-center gap-x-5 gap-y-2.5 mt-2 px-6 pb-4 overflow-y-auto max-h-[80px] custom-scrollbar">
        {slices.map((s) => (
          <div
            key={`legend-${s.index}`}
            className="flex items-center gap-1.5 cursor-pointer transition-opacity duration-200"
            onMouseEnter={() => setHoveredIdx(s.index)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{ opacity: hoveredIdx !== null && hoveredIdx !== s.index ? 0.3 : 1 }}
          >
            <span className="w-3 h-3 rounded-sm shadow-sm" style={{ backgroundColor: s.baseColor }} />
            <span className="text-[11px] font-semibold text-gray-600 truncate max-w-[130px]" title={s.item.name}>
              {s.item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
