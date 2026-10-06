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

// 12-color curated spectrum matching the reference 3D spiral image
const REFERENCE_SPECTRUM = [
  '#582C83', // 1. Deep Royal Purple (tallest)
  '#8E388B', // 2. Magenta / Violet
  '#D94348', // 3. Coral / Crimson Red
  '#F26427', // 4. Vibrant Sunset Orange
  '#F59032', // 5. Warm Peach / Amber
  '#FBB615', // 6. Golden Yellow
  '#B9CF2A', // 7. Lime / Yellow-Green
  '#7EB835', // 8. Fresh Spring Green
  '#52B2A4', // 9. Seafoam / Teal
  '#1EA4DB', // 10. Cerulean / Sky Blue
  '#206CA7', // 11. Royal Blue
  '#375392', // 12. Deep Cobalt
];

function adjustColorBrightness(hex: string, percent: number): string {
  try {
    let col = hex.replace('#', '');
    if (col.length === 3) {
      col = col.split('').map((c) => c + c).join('');
    }
    const num = parseInt(col, 16);
    let r = Math.max(0, Math.min(255, (num >> 16) + percent));
    let g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + percent));
    let b = Math.max(0, Math.min(255, (num & 0x0000ff) + percent));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  } catch {
    return hex;
  }
}

export default function Stepped3DPieChart({ data, total }: Stepped3DPieChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Filter out zero or invalid items and sort by value descending
  const { validItems, totalValue } = useMemo(() => {
    const nonZero = (data || []).filter((d) => Number(d.value) > 0);
    // Sort descending so the highest value gets the tallest step at back-left
    const sorted = [...nonZero].sort((a, b) => b.value - a.value);
    const sum = total || sorted.reduce((acc, curr) => acc + curr.value, 0) || 1;
    return { validItems: sorted, totalValue: sum };
  }, [data, total]);

  // Geometry configuration
  const cx = 370;
  const cy = 250;
  const Rx = 145; // Horizontal radius
  const Ry = 76;  // Vertical radius (isometric perspective tilt ~ 0.524)
  const tiltFactor = Ry / Rx;

  const maxH = 88; // Height of the tallest step (back-left)
  const minH = 24; // Height of the lowest step (front)
  const sliceGap = 4; // Radial separation distance between slices

  // Start angle at top-left (~ -110 degrees) where the tallest purple slice sits
  const baseStartAngle = -Math.PI * 0.61;

  // Build 3D slice definitions
  const slices = useMemo(() => {
    if (!validItems.length) return [];

    let currentAngle = baseStartAngle;
    const n = validItems.length;

    return validItems.map((item, index) => {
      const sliceAngle = (item.value / totalValue) * Math.PI * 2;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;

      const midAngle = (startAngle + endAngle) / 2;
      const percent = (item.value / totalValue) * 100;

      // Stepped height from maxH down to minH
      const height = n === 1 ? 55 : maxH - (index / (n - 1)) * (maxH - minH);

      // Color selection (use reference palette spectrum if not custom)
      const baseColor = item.color || REFERENCE_SPECTRUM[index % REFERENCE_SPECTRUM.length];
      const darkWallColor = adjustColorBrightness(baseColor, -42);
      const midWallColor = adjustColorBrightness(baseColor, -24);
      const lightHighlight = adjustColorBrightness(baseColor, 22);

      // Radial displacement for separated pie slices
      const dx = Math.cos(midAngle) * sliceGap;
      const dy = Math.sin(midAngle) * sliceGap * tiltFactor;

      // Slice base center & top center
      const baseCenterX = cx + dx;
      const baseCenterY = cy + dy;
      const topCenterX = baseCenterX;
      const topCenterY = baseCenterY - height;

      // Ellipse point calculators
      const getTopPt = (angle: number) => ({
        x: baseCenterX + Rx * Math.cos(angle),
        y: topCenterY + Ry * Math.sin(angle),
      });

      const getBasePt = (angle: number) => ({
        x: baseCenterX + Rx * Math.cos(angle),
        y: baseCenterY + Ry * Math.sin(angle),
      });

      const ptTopStart = getTopPt(startAngle);
      const ptTopEnd = getTopPt(endAngle);
      const ptBaseStart = getBasePt(startAngle);
      const ptBaseEnd = getBasePt(endAngle);

      // 1. Top Face Path (Elliptical sector)
      const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
      const topFacePath = `M ${topCenterX.toFixed(1)} ${topCenterY.toFixed(1)} L ${ptTopStart.x.toFixed(1)} ${ptTopStart.y.toFixed(1)} A ${Rx} ${Ry} 0 ${largeArcFlag} 1 ${ptTopEnd.x.toFixed(1)} ${ptTopEnd.y.toFixed(1)} Z`;

      // 2. Start Radial Cut Wall (connecting center to perimeter at startAngle)
      // Normal points counter-clockwise: visible when cos(startAngle) < 0 (left half)
      const isStartWallVisible = Math.cos(startAngle) < 0.05;
      const startWallPath = `M ${topCenterX.toFixed(1)} ${topCenterY.toFixed(1)} L ${ptTopStart.x.toFixed(1)} ${ptTopStart.y.toFixed(1)} L ${ptBaseStart.x.toFixed(1)} ${ptBaseStart.y.toFixed(1)} L ${baseCenterX.toFixed(1)} ${baseCenterY.toFixed(1)} Z`;

      // 3. End Radial Cut Wall (connecting center to perimeter at endAngle)
      // Normal points clockwise: visible when cos(endAngle) > -0.05 (right half)
      const isEndWallVisible = Math.cos(endAngle) > -0.05;
      const endWallPath = `M ${topCenterX.toFixed(1)} ${topCenterY.toFixed(1)} L ${ptTopEnd.x.toFixed(1)} ${ptTopEnd.y.toFixed(1)} L ${ptBaseEnd.x.toFixed(1)} ${ptBaseEnd.y.toFixed(1)} L ${baseCenterX.toFixed(1)} ${baseCenterY.toFixed(1)} Z`;

      // 4. Outer Curved Cylinder Wall
      // In isometric projection, the outer curved wall is facing camera when sin(angle) > 0 (front half: [0, PI])
      // Find overlap of [startAngle, endAngle] with front half [0, PI]
      const TWO_PI = Math.PI * 2;
      let normStart = ((startAngle % TWO_PI) + TWO_PI) % TWO_PI;
      let normEnd = ((endAngle % TWO_PI) + TWO_PI) % TWO_PI;
      if (normEnd <= normStart) normEnd += TWO_PI;

      const outerWallIntervals: { start: number; end: number }[] = [];
      for (let k = 0; k <= 2; k++) {
        const fStart = k * TWO_PI;
        const fEnd = k * TWO_PI + Math.PI;
        const oS = Math.max(normStart, fStart);
        const oE = Math.min(normEnd, fEnd);
        if (oE - oS > 0.005) {
          outerWallIntervals.push({ start: oS, end: oE });
        }
      }

      const outerWallPaths = outerWallIntervals.map((interval) => {
        const topS = {
          x: baseCenterX + Rx * Math.cos(interval.start),
          y: topCenterY + Ry * Math.sin(interval.start),
        };
        const topE = {
          x: baseCenterX + Rx * Math.cos(interval.end),
          y: topCenterY + Ry * Math.sin(interval.end),
        };
        const baseS = {
          x: baseCenterX + Rx * Math.cos(interval.start),
          y: baseCenterY + Ry * Math.sin(interval.start),
        };
        const baseE = {
          x: baseCenterX + Rx * Math.cos(interval.end),
          y: baseCenterY + Ry * Math.sin(interval.end),
        };
        const span = interval.end - interval.start;
        const arcFlag = span > Math.PI ? 1 : 0;

        return `M ${topS.x.toFixed(1)} ${topS.y.toFixed(1)} A ${Rx} ${Ry} 0 ${arcFlag} 1 ${topE.x.toFixed(1)} ${topE.y.toFixed(1)} L ${baseE.x.toFixed(1)} ${baseE.y.toFixed(1)} A ${Rx} ${Ry} 0 ${arcFlag} 0 ${baseS.x.toFixed(1)} ${baseS.y.toFixed(1)} Z`;
      });

      // Pin location for callout (outer edge of top face at midAngle)
      const pinPt = {
        x: baseCenterX + Rx * Math.cos(midAngle),
        y: topCenterY + Ry * Math.sin(midAngle),
      };

      // Depth sorting key: slices in the back (sin(midAngle) < 0) draw first;
      // slices in the front (sin(midAngle) > 0) draw last.
      const depthKey = Math.sin(midAngle);

      return {
        item,
        index,
        startAngle,
        endAngle,
        midAngle,
        percent,
        height,
        baseColor,
        darkWallColor,
        midWallColor,
        lightHighlight,
        topFacePath,
        isStartWallVisible,
        startWallPath,
        isEndWallVisible,
        endWallPath,
        outerWallPaths,
        pinPt,
        depthKey,
      };
    });
  }, [validItems, totalValue]);

  // Compute callout lines & labels around the 3D pie
  const callouts = useMemo(() => {
    if (!slices.length) return [];

    // Separate slices into right side (cos >= 0) and left side (cos < 0)
    const rightSide = slices.filter((s) => Math.cos(s.midAngle) >= 0);
    const leftSide = slices.filter((s) => Math.cos(s.midAngle) < 0);

    const minGap = 32;

    const arrangeCallouts = (group: typeof slices, isRight: boolean) => {
      // Sort by vertical position
      const sorted = [...group].sort((a, b) => a.pinPt.y - b.pinPt.y);

      // Stagger Y positions to prevent text collision
      const staggeredY = sorted.map((s) => s.pinPt.y);
      for (let i = 1; i < staggeredY.length; i++) {
        if (staggeredY[i] - staggeredY[i - 1] < minGap) {
          staggeredY[i] = staggeredY[i - 1] + minGap;
        }
      }

      return sorted.map((s, idx) => {
        const pin = s.pinPt;
        const targetY = staggeredY[idx];
        const elbowX = isRight ? pin.x + 22 : pin.x - 22;
        const textX = isRight ? Math.max(540, pin.x + 65) : Math.min(200, pin.x - 65);

        return {
          sliceIndex: s.index,
          item: s.item,
          color: s.baseColor,
          percent: s.percent.toFixed(1),
          pinX: pin.x,
          pinY: pin.y,
          elbowX,
          targetY,
          textX,
          isRight,
        };
      });
    };

    return [
      ...arrangeCallouts(rightSide, true),
      ...arrangeCallouts(leftSide, false),
    ];
  }, [slices]);

  // Sort slices from back to front for correct 3D Painter's rendering
  const sortedSlices = useMemo(() => {
    return [...slices].sort((a, b) => a.depthKey - b.depthKey);
  }, [slices]);

  if (!validItems.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-1">
        <span className="text-xs font-semibold text-gray-500">No General Insurance Data Available</span>
      </div>
    );
  }

  const activeSlice = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-visible">
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
            <strong className="text-[#2F439D] font-extrabold">{activeSlice.item.value}</strong> Policies ({activeSlice.percent.toFixed(1)}%)
          </div>
        </div>
      )}

      {/* SVG 3D Isometric Stepped Chart Canvas */}
      <svg
        viewBox="0 0 740 370"
        className="w-full h-full max-h-[400px] overflow-visible"
        style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.04))' }}
      >
        <defs>
          {/* Ground Contact Shadow */}
          <radialGradient id="groundShadow3D" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.28" />
            <stop offset="60%" stopColor="#1e293b" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#334155" stopOpacity="0" />
          </radialGradient>

          {/* Gradients for each slice */}
          {slices.map((s) => (
            <React.Fragment key={`defs-slice-${s.index}`}>
              {/* Top face specular highlight gradient */}
              <linearGradient
                id={`pie-top-grad-${s.index}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={s.lightHighlight} />
                <stop offset="100%" stopColor={s.baseColor} />
              </linearGradient>

              {/* Outer cylinder curved wall vertical 3D gradient */}
              <linearGradient
                id={`pie-wall-grad-${s.index}`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor={s.midWallColor} />
                <stop offset="100%" stopColor={s.darkWallColor} />
              </linearGradient>
            </React.Fragment>
          ))}
        </defs>

        {/* 1. Ground Shadow underneath 3D Cylinder */}
        <ellipse
          cx={cx}
          cy={cy + 12}
          rx={Rx + 28}
          ry={Ry + 15}
          fill="url(#groundShadow3D)"
        />

        {/* 2. 3D Stepped Slices Rendered in Depth Order (Back to Front) */}
        <g>
          {sortedSlices.map((s) => {
            const isHovered = hoveredIdx === s.index;

            return (
              <g
                key={`slice-3d-${s.index}`}
                onMouseEnter={() => setHoveredIdx(s.index)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer transition-transform duration-300 ease-out"
                style={{
                  transform: isHovered ? 'translateY(-7px)' : 'translateY(0px)',
                  transformOrigin: `${cx}px ${cy}px`,
                }}
              >
                {/* (a) Outer Curved Cylinder Wall (visible in front half) */}
                {s.outerWallPaths.map((wallPath, pIdx) => (
                  <path
                    key={`outer-wall-${s.index}-${pIdx}`}
                    d={wallPath}
                    fill={`url(#pie-wall-grad-${s.index})`}
                    stroke={s.darkWallColor}
                    strokeWidth={0.5}
                    className="transition-colors duration-200"
                  />
                ))}

                {/* (b) Start Radial Cut Wall (visible on left side) */}
                {s.isStartWallVisible && (
                  <path
                    d={s.startWallPath}
                    fill={s.midWallColor}
                    stroke={s.darkWallColor}
                    strokeWidth={0.5}
                    className="transition-colors duration-200"
                  />
                )}

                {/* (c) End Radial Cut Wall (visible on right side) */}
                {s.isEndWallVisible && (
                  <path
                    d={s.endWallPath}
                    fill={s.darkWallColor}
                    stroke={adjustColorBrightness(s.darkWallColor, -15)}
                    strokeWidth={0.5}
                    className="transition-colors duration-200"
                  />
                )}

                {/* (d) Top Flat Sector Face */}
                <path
                  d={s.topFacePath}
                  fill={`url(#pie-top-grad-${s.index})`}
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 2.5 : 1.2}
                  strokeLinejoin="round"
                  className="transition-all duration-200"
                  style={{
                    filter: isHovered
                      ? `drop-shadow(0 4px 8px ${s.baseColor}60)`
                      : 'none',
                  }}
                />
              </g>
            );
          })}
        </g>

        {/* 3. Callout Pointer Pins and Leader Lines (Matching Reference Image) */}
        <g>
          {callouts.map((c) => {
            const isHovered = hoveredIdx === c.sliceIndex;

            return (
              <g
                key={`callout-${c.sliceIndex}`}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(c.sliceIndex)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  opacity: hoveredIdx !== null && !isHovered ? 0.35 : 1,
                }}
              >
                {/* Pointer Dot on Slice Rim */}
                <circle
                  cx={c.pinX}
                  cy={c.pinY}
                  r={isHovered ? 5 : 3.5}
                  fill={c.color}
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  className="transition-all duration-200"
                />

                {/* Angled Elbow Leader Line */}
                <path
                  d={`M ${c.pinX.toFixed(1)} ${c.pinY.toFixed(1)} L ${c.elbowX.toFixed(1)} ${c.targetY.toFixed(1)} L ${c.textX.toFixed(1)} ${c.targetY.toFixed(1)}`}
                  fill="none"
                  stroke={isHovered ? c.color : '#94a3b8'}
                  strokeWidth={isHovered ? 2 : 1}
                  strokeDasharray={isHovered ? 'none' : '2 1'}
                  className="transition-all duration-200"
                />

                {/* Callout Text: Company Name */}
                <text
                  x={c.textX + (c.isRight ? 6 : -6)}
                  y={c.targetY - 5}
                  textAnchor={c.isRight ? 'start' : 'end'}
                  className={`text-[11px] font-bold transition-all duration-200 ${isHovered ? 'fill-gray-950 font-black' : 'fill-gray-700'
                    }`}
                >
                  {c.item.name.length > 20
                    ? `${c.item.name.substring(0, 19)}...`
                    : c.item.name}
                </text>

                {/* Callout Text: Value & Share */}
                <text
                  x={c.textX + (c.isRight ? 6 : -6)}
                  y={c.targetY + 9}
                  textAnchor={c.isRight ? 'start' : 'end'}
                  className={`text-[10px] font-semibold transition-all duration-200 ${isHovered ? 'fill-[#2F439D] font-extrabold' : 'fill-gray-500'
                    }`}
                >
                  {c.item.value} ({c.percent}%)
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
