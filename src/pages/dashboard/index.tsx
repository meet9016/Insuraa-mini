import React, { useState, useEffect, useRef, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Sector,
  AreaChart,
  Area
} from 'recharts';
import { ChevronLeft, ChevronRight, Filter, Calendar, Shield, BarChart2, PieChart as PieChartIcon, X, Phone, Mail, User, Cake, Heart, UserCheck, Car, ChevronDown, Check, TrendingUp, FileText, RefreshCw, Users, Target, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { ColDef } from 'ag-grid-community';
import AgGridTable from '@/components/ui/tableaggrid/AgGridTable';
import DataTable from '@/components/ui/DataTable';
import DatePicker from '@/components/ui/DatePicker';
import TableHeader from '@/components/ui/TableHeader';
import WalkingLottieCharacter from '@/components/dashboard/WalkingLottieCharacter';
import Stepped3DPieChart from '@/components/dashboard/Stepped3DPieChart';

interface CurvePoint {
  x: number;
  y: number;
}

// Exact Fritsch-Carlson Monotone Cubic Spline (identical to Recharts d3-shape curveMonotoneX)
function computeMonotoneCubicSplinePath(points: CurvePoint[]): string {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  if (points.length === 2) {
    return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;
  }

  const n = points.length;
  const dx: number[] = [];
  const dy: number[] = [];
  const m: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    const deltaX = points[i + 1].x - points[i].x;
    const deltaY = points[i + 1].y - points[i].y;
    dx.push(deltaX);
    dy.push(deltaY);
    m.push(deltaX === 0 ? 0 : deltaY / deltaX);
  }

  const d: number[] = new Array(n);
  d[0] = m[0];
  d[n - 1] = m[n - 2];

  for (let i = 1; i < n - 1; i++) {
    if (m[i - 1] * m[i] <= 0) {
      d[i] = 0;
    } else {
      d[i] = (m[i - 1] + m[i]) / 2;
    }
  }

  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      d[i] = 0;
      d[i + 1] = 0;
    } else {
      const alpha = d[i] / m[i];
      const beta = d[i + 1] / m[i];
      const s = alpha * alpha + beta * beta;
      if (s > 9) {
        const tau = 3 / Math.sqrt(s);
        d[i] = tau * alpha * m[i];
        d[i + 1] = tau * beta * m[i];
      }
    }
  }

  let pathStr = `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    const cp1x = points[i].x + dx[i] / 3;
    const cp1y = points[i].y + (d[i] * dx[i]) / 3;
    const cp2x = points[i + 1].x - dx[i] / 3;
    const cp2y = points[i + 1].y - (d[i + 1] * dx[i]) / 3;
    pathStr += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${points[i + 1].x.toFixed(2)},${points[i + 1].y.toFixed(2)}`;
  }

  return pathStr;
}


const WalkingAgentCharacter = () => (
  <>
    <ellipse cx="0" cy="0.5" rx="14" ry="2.2" fill="#1e1b4b" opacity="0.18" />
    <foreignObject
      x="-27"
      y="-77"
      width="54"
      height="82"
      style={{ overflow: 'visible', pointerEvents: 'none' }}
    >
      <WalkingLottieCharacter width={54} height={82} speed={1.15} />
    </foreignObject>
  </>
);

// High-performance, 60fps continuous curve walking controller
function useWalkingCurve(points: CurvePoint[]) {
  const guidePathRef = useRef<SVGPathElement | null>(null);
  const characterRef = useRef<SVGGElement | null>(null);

  const guidePathD = useMemo(() => {
    return computeMonotoneCubicSplinePath(points);
  }, [points]);

  useEffect(() => {
    const pathEl = guidePathRef.current;
    const charEl = characterRef.current;

    if (!pathEl || !charEl || !points || points.length < 2) {
      if (charEl) charEl.style.opacity = '0';
      return;
    }

    let totalLength = 0;
    try {
      totalLength = pathEl.getTotalLength();
    } catch {
      return;
    }

    if (!totalLength || isNaN(totalLength) || totalLength <= 0) {
      charEl.style.opacity = '0';
      return;
    }

    // Smooth traversal duration (8 to 11 seconds depending on length)
    const walkDuration = Math.max(7500, Math.min(11000, totalLength * 14));
    const pauseDuration = 600;
    const cycleDuration = walkDuration + pauseDuration;

    let startTime: number | null = null;
    let animId: number;

    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = (now - startTime) % cycleDuration;

      let distance = 0;
      let opacity = 1;

      if (elapsed < walkDuration) {
        const progress = elapsed / walkDuration;
        distance = progress * totalLength;

        // Smooth fade-in at the first 5% of distance
        if (progress < 0.05) {
          opacity = progress / 0.05;
        }
        // Smooth fade-out at the last 5% of distance
        else if (progress > 0.95) {
          opacity = (1 - progress) / 0.05;
        }
      } else {
        distance = totalLength;
        opacity = 0;
      }

      const clampedDist = Math.max(0, Math.min(totalLength, distance));

      try {
        // Exact position along the monotone graph curve
        const pt = pathEl.getPointAtLength(clampedDist);

        // Exact slope tangent for natural slope posture
        const delta = 3;
        const ptAhead = pathEl.getPointAtLength(Math.min(totalLength, clampedDist + delta));
        const ptBehind = pathEl.getPointAtLength(Math.max(0, clampedDist - delta));
        const angleRad = Math.atan2(ptAhead.y - ptBehind.y, ptAhead.x - ptBehind.x);
        const angleDeg = (angleRad * 180) / Math.PI;

        // Damped natural tilt: character adapts to slope without over-rotating
        const naturalTilt = Math.max(-14, Math.min(14, angleDeg * 0.5));

        charEl.setAttribute(
          'transform',
          `translate(${pt.x.toFixed(2)}, ${pt.y.toFixed(2)}) rotate(${naturalTilt.toFixed(1)})`
        );
        charEl.style.opacity = opacity.toFixed(2);
      } catch {
        // Safe catch for SVG path rendering race
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [guidePathD, points]);

  return { guidePathD, guidePathRef, characterRef };
}

const LIFE_PAYMENT_COLUMNS = [
  { key: 'date', label: 'Date' },
  { key: 'customer', label: 'Customer' },
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
  { key: 'action', label: 'Action' }
];

const RENEWAL_COLUMNS = [
  { key: 'type', label: 'Type' },
  { key: 'customer', label: 'Customer' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'policyNo', label: 'Policy No' },
  { key: 'endDate', label: 'End Date' },
  { key: 'days', label: 'Days' },
  { key: 'action', label: 'Action' }
];

const POLICY_OVERVIEW_DATA = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 1 },
  { name: 'Apr', value: 1 },
  { name: 'May', value: 0 },
  { name: 'Jun', value: 10 },
  { name: 'Jul', value: 6 },
  { name: 'Aug', value: 0 },
  { name: 'Sep', value: 0 },
  { name: 'Oct', value: 0 },
  { name: 'Nov', value: 0 },
  { name: 'Dec', value: 0 },
];

const COMPANY_OVERVIEW_DATA = [
  { name: 'Bajaj Life Insurance Limited', value: 13, color: '#4F46E5' }, // Indigo
  { name: 'Star Health And Allied Insurance Company Limited', value: 2, color: '#10B981' }, // Emerald
  { name: 'Niva Bupa Health Insurance Company Limited', value: 2, color: '#F59E0B' }, // Amber
  { name: 'Care Health Insurance Company Limited', value: 2, color: '#8B5CF6' }, // Violet
  { name: 'Bajaj General Insurance Limited', value: 2, color: '#EC4899' }, // Pink
  { name: 'HDFC ERGO General Insurance Company Limited', value: 1, color: '#EF4444' }, // Red
  { name: 'The Oriental Insurance Company Limited', value: 1, color: '#06B6D4' }, // Cyan
  { name: 'Royal Sundaram General Insurance Company Limited', value: 1, color: '#F97316' }, // Orange
  { name: 'ICICI Lombard General Insurance Company Limited', value: 1, color: '#14B8A6' }, // Teal
];

const TYPE_OVERVIEW_DATA = [
  { name: 'Life Insurance', value: 4, color: '#4F46E5' },
  { name: 'Health Insurance', value: 7, color: '#10B981' },
  { name: 'Motor Insurance', value: 9, color: '#F59E0B' },
  { name: 'Fire Insurance', value: 2, color: '#8B5CF6' },
  { name: 'Travel Insurance', value: 1, color: '#EC4899' },
  { name: 'Home Insurance', value: 1, color: '#EF4444' },
  { name: 'Marine Insurance', value: 1, color: '#06B6D4' },
];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} className="text-2xl font-black drop-shadow-sm">
        {value}
      </text>
      <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="#999" className="text-xs font-bold uppercase tracking-widest">
        Policies
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 18}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={2} />
      <circle cx={ex} cy={ey} r={4} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="font-extrabold text-sm">
        {payload.name.length > 20 ? payload.name.substring(0, 20) + '...' : payload.name}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#666" className="text-xs font-bold">
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

import { getAuthToken } from '@/config';
import {
  useDashboardSummary,
  useCalendarEvents,
  useDashboardDayDetails,
  useDashboardPaymentPending,
  useDashboardRenewalTypeList,
  useDashboardRenewalPending,
  useDashboardChartCompany,
  useDashboardChartType,
  useDashboardChartPolicy,
  PolicyRenewalItem,
  PaymentPendingItem,
  RenewalPendingItem
} from '@/hooks/useDashboardApi';

const PERIOD_FILTERS = [
  { label: 'Today', value: 'today' },
  { label: '7 Days', value: '7days' },
  { label: '15 Days', value: '15days' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Lapsed 7', value: 'lapsed_7' },
  { label: 'Lapsed 15', value: 'lapsed_15' },
  { label: 'Lapsed Month', value: 'lapsed_month' },
  { label: 'Previous Month', value: 'prev_month' },
  { label: 'Next Month', value: 'next_month' },
  { label: 'Date Range', value: 'range' },
];

const EVENT_COLOR_MAP: Record<string, string> = {
  birthday: 'bg-amber-400',
  anniversary: 'bg-rose-400',
  lead: 'bg-emerald-500',
};

const RENEWAL_COLOR_MAP: Record<string, string> = {
  health: 'bg-rose-500',
  motor: 'bg-blue-400',
  life: 'bg-emerald-500',
  other: 'bg-gray-400',
};

const getDynamicLegends = (
  eventsData: any,
  colorMap: Record<string, string>
) => {
  const typeMap = new Map<string, string>();

  const apiList = eventsData?.event_types || eventsData?.legends || eventsData?.categories || eventsData?.types;

  if (Array.isArray(apiList) && apiList.length > 0) {
    apiList.forEach((item: any) => {
      const name = typeof item === 'string' ? item : item?.name || item?.label || item?.title;
      if (name) {
        const str = String(name).trim();
        typeMap.set(str.toLowerCase(), str);
      }
    });
  } else if (apiList && typeof apiList === 'object') {
    Object.keys(apiList).forEach((key) => {
      typeMap.set(key.trim().toLowerCase(), key.trim());
    });
  }

  const eventsObj = eventsData?.events || {};
  if (eventsObj && typeof eventsObj === 'object') {
    Object.values(eventsObj).forEach((evtList: any) => {
      if (Array.isArray(evtList)) {
        evtList.forEach((e: any) => {
          if (e && typeof e === 'string') {
            const str = e.trim();
            if (str && !typeMap.has(str.toLowerCase())) {
              typeMap.set(str.toLowerCase(), str);
            }
          }
        });
      }
    });
  }

  const fallbackColors = [
    'bg-amber-400',
    'bg-rose-400',
    'bg-emerald-500',
    'bg-blue-400',
    'bg-purple-500',
    'bg-pink-400',
    'bg-indigo-500',
    'bg-gray-400'
  ];

  return Array.from(typeMap.entries()).map(([rawKey, displayName], idx) => {
    const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    const color = colorMap[rawKey] || fallbackColors[idx % fallbackColors.length];
    return { name: formattedName, raw: rawKey, color };
  });
};

export default function Dashboard() {
  const [activeTaskFilter, setActiveTaskFilter] = useState('Today');

  // General, Life, Type & Policy Chart States
  const [generalYearFilter, setGeneralYearFilter] = useState('all');
  const [lifeYearFilter, setLifeYearFilter] = useState('all');
  const [typeYearFilter, setTypeYearFilter] = useState('all');
  const [policyMode, setPolicyMode] = useState('general');
  const [policyYear, setPolicyYear] = useState('2026');
  const [generalChartMode, setGeneralChartMode] = useState<'Bar' | 'Pie'>('Pie');
  const [lifeChartMode, setLifeChartMode] = useState<'Bar' | 'Pie'>('Bar');
  const [typeChartMode, setTypeChartMode] = useState<'Trend' | 'Bar'>('Trend');
  const [activeGeneralIndex, setActiveGeneralIndex] = useState(0);
  const [activeLifeIndex, setActiveLifeIndex] = useState(0);
  const [activeTypeIndex, setActiveTypeIndex] = useState(0);
  const [dotCoords, setDotCoords] = useState<CurvePoint[]>([]);
  const coordsRef = useRef<CurvePoint[]>([]);

  // Continuous 60fps graph curve runner controllers (Feet locked to line, zero jumping)
  const {
    guidePathD: trendGuidePathD,
    guidePathRef: trendPathRef,
    characterRef: trendCharRef,
  } = useWalkingCurve(typeChartMode === 'Trend' ? dotCoords : []);

  const {
    guidePathD: barGuidePathD,
    guidePathRef: barPathRef,
    characterRef: barCharRef,
  } = useWalkingCurve(typeChartMode === 'Bar' ? dotCoords : []);

  const [eventDate, setEventDate] = useState(() => new Date());
  const [renewalDate, setRenewalDate] = useState(() => new Date());

  const [selectedDayModal, setSelectedDayModal] = useState<{
    isOpen: boolean;
    side: 'left' | 'right';
    date: string;
  } | null>(null);

  // Payment Pending Filter & Modal States (Default: today)
  const [activePaymentPeriod, setActivePaymentPeriod] = useState('today');
  const [paymentDateRange, setPaymentDateRange] = useState({ from: '', to: '' });
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);
  const [tempFromDate, setTempFromDate] = useState('');
  const [tempToDate, setTempToDate] = useState('');

  // Renewal Pending States (Default: today, type: all)
  const [activeRenewalType, setActiveRenewalType] = useState('all');
  const [activeRenewalPeriod, setActiveRenewalPeriod] = useState('today');
  const [renewalDateRange, setRenewalDateRange] = useState({ from: '', to: '' });
  const [isRenewalTypeDropdownOpen, setIsRenewalTypeDropdownOpen] = useState(false);
  const [isRenewalPeriodDropdownOpen, setIsRenewalPeriodDropdownOpen] = useState(false);
  const [isRenewalDateRangeModalOpen, setIsRenewalDateRangeModalOpen] = useState(false);
  const [tempRenewalFromDate, setTempRenewalFromDate] = useState('');
  const [tempRenewalToDate, setTempRenewalToDate] = useState('');

  const { data: renewalTypeList } = useDashboardRenewalTypeList();

  const { data: renewalPendingData, isLoading: loadingRenewalPending } = useDashboardRenewalPending({
    period: activeRenewalPeriod,
    type: activeRenewalType,
    from: activeRenewalPeriod === 'range' ? renewalDateRange.from : '',
    to: activeRenewalPeriod === 'range' ? renewalDateRange.to : '',
  });

  const { data: paymentPendingData, isLoading: loadingPaymentPending } = useDashboardPaymentPending({
    period: activePaymentPeriod,
    from: activePaymentPeriod === 'range' ? paymentDateRange.from : '',
    to: activePaymentPeriod === 'range' ? paymentDateRange.to : '',
  });

  const { data: generalCompanyData, isFetching: loadingGeneralCompany } = useDashboardChartCompany({
    yearFilter: generalYearFilter,
    companyType: 'general',
  });

  const { data: lifeCompanyData, isFetching: loadingLifeCompany } = useDashboardChartCompany({
    yearFilter: lifeYearFilter,
    companyType: 'life',
  });

  const { data: typeChartData, isFetching: loadingTypeChart } = useDashboardChartType({
    yearFilter: typeYearFilter,
  });

  // Reset and synchronize curve dots whenever year filter, chart mode, or data items change
  useEffect(() => {
    coordsRef.current = [];
    setDotCoords([]);
  }, [typeYearFilter, typeChartMode, typeChartData?.items]);

  const { data: policyChartData, isFetching: loadingPolicyChart } = useDashboardChartPolicy({
    mode: policyMode,
    year: policyYear,
  });

  const handlePeriodFilterClick = (periodVal: string) => {
    if (periodVal === 'range') {
      setIsDateRangeModalOpen(true);
    } else {
      setActivePaymentPeriod(periodVal);
      setPaymentDateRange({ from: '', to: '' });
    }
  };

  const handleApplyDateRange = () => {
    if (!tempFromDate || !tempToDate) {
      toast.error('Please select both From Date and To Date');
      return;
    }
    setPaymentDateRange({ from: tempFromDate, to: tempToDate });
    setActivePaymentPeriod('range');
    setIsDateRangeModalOpen(false);
  };

  const paymentPendingColumnDefs = React.useMemo<ColDef<PaymentPendingItem>[]>(() => [
    {
      headerName: 'Type',
      field: 'ins_type',
      width: 110,
      cellRenderer: (params: any) => (
        <span className="bg-[#2F439D]/10 text-[#2F439D] font-bold text-xs px-2 py-0.5 rounded border border-[#2F439D]/20">
          {params.value || 'Life'}
        </span>
      ),
    },
    {
      headerName: 'Policy No',
      field: 'policy_number',
      minWidth: 140,
      cellRenderer: (params: any) => (
        <span className="font-mono font-semibold text-gray-800 text-xs bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
          {params.value || 'N/A'}
        </span>
      ),
    },
    {
      headerName: 'Customer Name',
      field: 'customer_name',
      minWidth: 180,
      cellRenderer: (params: any) => (
        <span className="font-semibold text-gray-900 text-xs">
          {params.value || 'N/A'}
        </span>
      ),
    },
    {
      headerName: 'Mobile',
      field: 'phone',
      minWidth: 140,
      cellRenderer: (params: any) => (
        params.value ? (
          <a href={`tel:${params.value}`} className="text-[#2F439D] font-medium hover:underline text-xs flex items-center gap-1">
            <Phone size={12} /> {params.value}
          </a>
        ) : <span className="text-gray-400 text-xs">N/A</span>
      ),
    },
    {
      headerName: 'Due Date',
      field: 'due_date',
      minWidth: 130,
      cellRenderer: (params: any) => (
        <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
          {params.value || 'N/A'}
        </span>
      ),
    },
    {
      headerName: 'Amount',
      field: 'amount',
      minWidth: 110,
      cellRenderer: (params: any) => (
        <span className="font-semibold text-gray-700 text-xs">
          ₹{params.value ?? 0}
        </span>
      ),
    },
    {
      headerName: 'GST Amount',
      field: 'gst_amount',
      minWidth: 110,
      cellRenderer: (params: any) => (
        <span className="text-gray-500 text-xs font-medium">
          ₹{params.value ?? 0}
        </span>
      ),
    },
    {
      headerName: 'Final Amount',
      field: 'final_amount',
      minWidth: 130,
      cellRenderer: (params: any) => (
        <span className="font-bold text-emerald-700 text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
          ₹{params.value ?? 0}
        </span>
      ),
    },
    {
      headerName: 'Status',
      field: 'payment_status',
      minWidth: 120,
      cellRenderer: (params: any) => {
        const val = params.value;
        const isPending = val === 1 || val === '1' || !val || String(val).toLowerCase() === 'pending';
        return (
          <div className="flex items-center h-full">
            <span className={`font-bold text-[11px] px-2.5 py-0.5 rounded-md border uppercase tracking-wider ${isPending
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
              {isPending ? 'Pending' : String(val)}
            </span>
          </div>
        );
      },
    },
  ], []);

  const renewalPendingColumnDefs = React.useMemo<ColDef<RenewalPendingItem>[]>(() => [
    {
      headerName: 'Type',
      field: 'ins_type',
      minWidth: 140,
      cellRenderer: (params: any) => (
        <span className="bg-[#2F439D]/10 text-[#2F439D] font-bold text-xs px-2.5 py-0.5 rounded border border-[#2F439D]/20">
          {params.value || 'Insurance'}
        </span>
      ),
    },
    {
      headerName: 'Customer',
      field: 'customer_name',
      minWidth: 180,
      cellRenderer: (params: any) => (
        <span className="font-semibold text-gray-900 text-xs">
          {params.value || 'N/A'}
        </span>
      ),
    },
    {
      headerName: 'Mobile',
      field: 'phone',
      minWidth: 140,
      cellRenderer: (params: any) => (
        params.value ? (
          <a href={`tel:${params.value}`} className="text-[#2F439D] font-medium hover:underline text-xs flex items-center gap-1">
            <Phone size={12} /> {params.value}
          </a>
        ) : <span className="text-gray-400 text-xs">N/A</span>
      ),
    },
    {
      headerName: 'Policy No',
      field: 'policy_number',
      minWidth: 150,
      cellRenderer: (params: any) => (
        <span className="font-mono font-semibold text-gray-800 text-xs bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
          {params.value?.trim() || 'N/A'}
        </span>
      ),
    },
    {
      headerName: 'End Date',
      field: 'policy_end_date',
      minWidth: 130,
      cellRenderer: (params: any) => (
        <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
          {params.value || 'N/A'}
        </span>
      ),
    },
    {
      headerName: 'Days',
      field: 'days_left',
      minWidth: 100,
      cellRenderer: (params: any) => {
        const days = params.value;
        const isExpired = params.data?.is_expired === 1 || Number(days) <= 0;
        return (
          <span className={`font-bold text-[11px] px-2.5 py-0.5 rounded-full border ${isExpired
            ? 'bg-rose-100 text-rose-700 border-rose-200'
            : 'bg-amber-100 text-amber-800 border-amber-200'
            }`}>
            {isExpired ? 'Expired' : `${days} days`}
          </span>
        );
      },
    },
    {
      headerName: 'Premium Amount',
      field: 'premium_amount',
      minWidth: 140,
      cellRenderer: (params: any) => (
        <span className="font-bold text-emerald-700 text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
          ₹{params.value ?? 0}
        </span>
      ),
    },
  ], []);

  const { data: summaryData, isLoading: loadingSummary } = useDashboardSummary();

  const { data: eventCalendarData } = useCalendarEvents({
    side: 'left',
    year: eventDate.getFullYear(),
    month: eventDate.getMonth() + 1,
  });

  const { data: renewalCalendarData } = useCalendarEvents({
    side: 'right',
    year: renewalDate.getFullYear(),
    month: renewalDate.getMonth() + 1,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = getAuthToken();
      if (!token) {
        window.location.href = "/auth/login";
      }
    }
  }, []);

  const metricsList = [
    { title: "Total Policy", value: summaryData?.total_policy ?? 0 },
    { title: "Total Quotation", value: summaryData?.total_quotation ?? 0 },
    { title: "Total Renewal", value: summaryData?.total_renewal ?? 0 },
    { title: "Total Customer", value: summaryData?.total_customer ?? 0, path: "/customers" },
    { title: "Total Lead", value: summaryData?.total_lead ?? 0, path: "/manage-leads" },
    { title: "Total Claim", value: summaryData?.total_claim ?? 0, path: "/claim" },
  ];

  const leftLegends = getDynamicLegends(
    eventCalendarData,
    EVENT_COLOR_MAP
  );

  const rightLegends = getDynamicLegends(
    renewalCalendarData,
    RENEWAL_COLOR_MAP
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <Head>
        <title>Dashboard - Insuraa</title>
      </Head>

      <style jsx global>{`
        @keyframes agentWalkGait {
          0% { transform: translateY(0px) rotate(-1.5deg) scaleY(1); }
          25% { transform: translateY(-4px) rotate(1.5deg) scaleY(1.02); }
          50% { transform: translateY(0px) rotate(-1.5deg) scaleY(1); }
          75% { transform: translateY(-4px) rotate(1.5deg) scaleY(1.02); }
          100% { transform: translateY(0px) rotate(-1.5deg) scaleY(1); }
        }
        .animate-agent-walk {
          animation: agentWalkGait 1.3s infinite ease-in-out;
        }
        @keyframes floatIconAnim {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-float-icon {
          animation: floatIconAnim 2.5s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {metricsList.map((metric, idx) => (
            <MetricCard
              key={idx}
              title={metric.title}
              value={loadingSummary ? "..." : metric.value}
              path={metric.path}
            />
          ))}
        </div>

        {/* Calendars Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event Details Calendar */}
          <div className="bg-white rounded-2xl border border-[#2B4399]/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 sm:p-6 border-b border-[#2B4399]/20 bg-[#F2F7FF]">
              <h3 className="font-semibold text-gray-900 text-lg">Event Details</h3>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500">
                {leftLegends.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-sm`} />
                    <span>{item.name}</span>
                  </div>
                ))}

                <div className="flex items-center gap-2 sm:ml-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <span className="font-medium text-gray-700 px-2 min-w-[110px] text-center select-none">
                    {eventDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEventDate(new Date(eventDate.getFullYear(), eventDate.getMonth() - 1, 1))} className="p-1 rounded-md hover:bg-white hover:shadow-sm text-gray-400 hover:text-gray-800 transition-all"><ChevronLeft size={16} /></button>
                    <button onClick={() => setEventDate(new Date())} className="px-3 py-1 rounded-md bg-white shadow-sm text-[#2F439D] font-medium">Today</button>
                    <button onClick={() => setEventDate(new Date(eventDate.getFullYear(), eventDate.getMonth() + 1, 1))} className="p-1 rounded-md hover:bg-white hover:shadow-sm text-gray-400 hover:text-gray-800 transition-all"><ChevronRight size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 bg-white">
              <CalendarGrid
                year={eventDate.getFullYear()}
                month={eventDate.getMonth() + 1}
                events={eventCalendarData?.events}
                colorMap={EVENT_COLOR_MAP}
                onDateClick={(dateStr) => setSelectedDayModal({ isOpen: true, side: 'left', date: dateStr })}
              />
            </div>
          </div>

          {/* Policy Renewal Calendar */}
          <div className="bg-white rounded-2xl border border-[#2B4399]/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 sm:p-6 border-b border-[#2B4399]/20 bg-[#F2F7FF]">
              <h3 className="font-semibold text-gray-900 text-lg">Policy Renewal</h3>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500">
                {rightLegends.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-sm`} />
                    <span>{item.name}</span>
                  </div>
                ))}

                <div className="flex items-center gap-2 sm:ml-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <span className="font-medium text-gray-700 px-2 min-w-[110px] text-center select-none">
                    {renewalDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setRenewalDate(new Date(renewalDate.getFullYear(), renewalDate.getMonth() - 1, 1))} className="p-1 rounded-md hover:bg-white hover:shadow-sm text-gray-400 hover:text-gray-800 transition-all"><ChevronLeft size={16} /></button>
                    <button onClick={() => setRenewalDate(new Date())} className="px-3 py-1 rounded-md bg-white shadow-sm text-[#2F439D] font-medium">Today</button>
                    <button onClick={() => setRenewalDate(new Date(renewalDate.getFullYear(), renewalDate.getMonth() + 1, 1))} className="p-1 rounded-md hover:bg-white hover:shadow-sm text-gray-400 hover:text-gray-800 transition-all"><ChevronRight size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 bg-white">
              <CalendarGrid
                year={renewalDate.getFullYear()}
                month={renewalDate.getMonth() + 1}
                events={renewalCalendarData?.events}
                colorMap={RENEWAL_COLOR_MAP}
                onDateClick={(dateStr) => setSelectedDayModal({ isOpen: true, side: 'right', date: dateStr })}
              />
            </div>
          </div>
        </div>

        {/* Life Insurance Payment Pending */}
        <div className="bg-white rounded-2xl border border-[#2B4399]/20 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
          <TableHeader
            title="Life Insurance Payment Pending"
            showSearch={false}
            extraActions={
              <div className="relative">
                <button
                  onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2.5 transition-all"
                >
                  <Filter size={14} className="text-[#2F439D]" />
                  <span>
                    Filter: <strong className="text-[#2F439D]">{PERIOD_FILTERS.find((f) => f.value === activePaymentPeriod)?.label || 'Today'}</strong>
                  </span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFilterDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setIsFilterDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3.5 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
                        Select Filter Period
                      </div>
                      {PERIOD_FILTERS.map((f) => {
                        const isActive = activePaymentPeriod === f.value;
                        return (
                          <button
                            key={f.value}
                            onClick={() => {
                              setIsFilterDropdownOpen(false);
                              handlePeriodFilterClick(f.value);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between transition-colors ${isActive
                              ? 'bg-indigo-50 text-[#2F439D] font-bold'
                              : 'text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            <span>{f.label}</span>
                            {isActive && <Check size={14} className="text-[#2F439D]" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            }
          />

          <div className="p-4">
            <AgGridTable
              rowData={paymentPendingData?.list || []}
              columnDefs={paymentPendingColumnDefs}
              loading={loadingPaymentPending}
              height="380px"
            />
          </div>
        </div>

        {/* Insurance Renewal Pending */}
        <div className="bg-white rounded-2xl border border-[#2B4399]/20 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
          <TableHeader
            title="Insurance Renewal Pending"
            showSearch={false}
            extraActions={
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Type Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsRenewalTypeDropdownOpen((prev) => !prev);
                      setIsRenewalPeriodDropdownOpen(false);
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-all"
                  >
                    <Shield size={14} className="text-[#2F439D]" />
                    <span>
                      Type: <strong className="text-[#2F439D]">
                        {renewalTypeList?.find((t) => String(t.id) === String(activeRenewalType))?.name || 'All'}
                      </strong>
                    </span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isRenewalTypeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isRenewalTypeDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setIsRenewalTypeDropdownOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-30 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-3.5 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
                          Select Insurance Type
                        </div>
                        {(renewalTypeList && renewalTypeList.length > 0
                          ? renewalTypeList
                          : [{ id: 'all', name: 'All' }, { id: 'health', name: 'Health' }, { id: 'motor', name: 'Motor' }]
                        ).map((t) => {
                          const isActive = String(activeRenewalType) === String(t.id);
                          return (
                            <button
                              key={t.id}
                              onClick={() => {
                                setActiveRenewalType(String(t.id));
                                setIsRenewalTypeDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between transition-colors ${isActive
                                ? 'bg-indigo-50 text-[#2F439D] font-bold'
                                : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                              <span>{t.name}</span>
                              {isActive && <Check size={14} className="text-[#2F439D]" />}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Period Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsRenewalPeriodDropdownOpen((prev) => !prev);
                      setIsRenewalTypeDropdownOpen(false);
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2.5 transition-all"
                  >
                    <Filter size={14} className="text-[#2F439D]" />
                    <span>
                      Filter: <strong className="text-[#2F439D]">
                        {PERIOD_FILTERS.find((f) => f.value === activeRenewalPeriod)?.label || 'Today'}
                      </strong>
                    </span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isRenewalPeriodDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isRenewalPeriodDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setIsRenewalPeriodDropdownOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-3.5 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
                          Select Filter Period
                        </div>
                        {PERIOD_FILTERS.map((f) => {
                          const isActive = activeRenewalPeriod === f.value;
                          return (
                            <button
                              key={f.value}
                              onClick={() => {
                                setIsRenewalPeriodDropdownOpen(false);
                                if (f.value === 'range') {
                                  setIsRenewalDateRangeModalOpen(true);
                                } else {
                                  setActiveRenewalPeriod(f.value);
                                  setRenewalDateRange({ from: '', to: '' });
                                }
                              }}
                              className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between transition-colors ${isActive
                                ? 'bg-indigo-50 text-[#2F439D] font-bold'
                                : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                              <span>{f.label}</span>
                              {isActive && <Check size={14} className="text-[#2F439D]" />}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            }
          />

          <div className="p-4">
            <AgGridTable
              rowData={renewalPendingData?.list || []}
              columnDefs={renewalPendingColumnDefs}
              loading={loadingRenewalPending}
              height="380px"
            />
          </div>
        </div>

        {/* Task Section */}
        {/* <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900 text-lg tracking-tight">Task</h3>
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              {['Today', 'Tomorrow', 'Yesterday', 'This Month', 'Previous Month', 'Next Month'].map((label, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveTaskFilter(label)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg flex-shrink-0 transition-all hover:-translate-y-0.5 ${activeTaskFilter === label ? 'bg-[#2F439D] text-white shadow-lg shadow-[#2F439D]/20' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                  {label}
                </button>
              ))}
              <button className="px-4 py-2 text-xs font-medium rounded-lg border border-gray-200 flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-50 flex-shrink-0 transition-all">
                <Calendar size={14} className="text-[#2F439D]" /> Date Range
              </button>
            </div>
          </div>
          
          <div className="p-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-3 border-b border-gray-50 bg-[#f8fafc]/50">
            <TaskStat label="TODAY" value="0" color="text-[#2F439D]" />
            <TaskStat label="TOMORROW" value="0" color="text-emerald-500" />
            <TaskStat label="YESTERDAY" value="0" color="text-amber-500" />
            <TaskStat label="THIS MONTH" value="0" color="text-[#2F439D]" />
            <TaskStat label="PENDING" value="2" color="text-rose-500" bg="bg-rose-50" />
            <TaskStat label="START" value="0" color="text-sky-500" />
            <TaskStat label="HOLD" value="0" color="text-orange-500" />
            <TaskStat label="COMPLETE" value="0" color="text-emerald-600" />
            <TaskStat label="FOLLOW-UP" value="0" color="text-indigo-500" />
          </div>
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className="bg-[#2F439D] text-white/90 text-xs uppercase font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Staff Name</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Task</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Calendar size={32} className="mb-2 opacity-20" />
                      <span className="font-semibold text-gray-500">No Tasks Found</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> */}

        {/* Company Overview Charts Row: General & Life Insurance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Insurance Company Chart */}
          <div className="bg-white rounded-2xl border border-[#2B4399]/20 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.02)] p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-[#2F439D] rounded-lg"><Shield size={20} /></div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg tracking-tight">
                    {generalCompanyData?.title || 'General Insurance Company Overview'}
                  </h3>
                  {generalCompanyData?.total !== undefined && (
                    <span className="text-xs text-gray-500 font-medium">Total: <strong className="text-[#2F439D]">{generalCompanyData.total}</strong></span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                {/* Year Filter Options: All, Current Year, Previous Year */}
                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                  {[
                    { label: 'All', value: 'all' },
                    { label: 'Current Year', value: 'curr' },
                    { label: 'Previous Year', value: 'prev' },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setGeneralYearFilter(filter.value)}
                      className={`px-3 py-1.5 rounded-md transition-all ${generalYearFilter === filter.value
                        ? 'bg-white shadow-sm text-[#2F439D] font-bold'
                        : 'text-gray-500 hover:bg-white'
                        }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                {/* Bar / Pie Chart Toggle */}
                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <button
                    onClick={() => setGeneralChartMode('Bar')}
                    className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${generalChartMode === 'Bar' ? 'bg-white shadow-sm text-[#2F439D] font-bold' : 'text-gray-500 hover:bg-white'
                      }`}
                  >
                    <BarChart2 size={14} /> Bar
                  </button>
                  <button
                    onClick={() => setGeneralChartMode('Pie')}
                    className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${generalChartMode === 'Pie' ? 'bg-white shadow-sm text-[#2F439D] font-bold' : 'text-gray-500 hover:bg-white'
                      }`}
                  >
                    <PieChartIcon size={14} /> 3D Pie
                  </button>
                </div>
              </div>
            </div>

            {/* Color Legend Tags */}
            {generalCompanyData?.items && generalCompanyData.items.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-[11px] font-medium text-gray-600 bg-gray-50/50 p-4 rounded-xl border border-gray-50 max-h-24 overflow-y-auto">
                {generalCompanyData.items.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                    <span className="w-3 h-3 rounded-md shadow-sm flex-shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="truncate max-w-[150px]" title={c.name}>{c.name}</span>
                    <span className="bg-white px-1.5 py-0.5 rounded border border-gray-100 font-bold text-[#2F439D]">{c.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Chart Area */}
            <div className={`${generalChartMode === 'Pie' ? 'h-[400px]' : 'h-[340px]'} flex items-center justify-center transition-all duration-300 relative`}>
              {loadingGeneralCompany ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-7 h-7 border-3 border-[#2F439D] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-400 font-medium">Loading chart data...</span>
                </div>
              ) : !generalCompanyData?.items || generalCompanyData.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-gray-400 space-y-1">
                  <Shield size={32} className="opacity-20 mb-1" />
                  <span className="text-xs font-semibold text-gray-500">No General Insurance Data Available</span>
                </div>
              ) : generalChartMode === 'Bar' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generalCompanyData.items} margin={{ top: 10, right: 10, left: -20, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                      tickFormatter={(val) => (val.length > 15 ? val.substring(0, 15) + '...' : val)}
                      angle={-25}
                      textAnchor="end"
                      dy={15}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dx={-10} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={44}>
                      {generalCompanyData.items.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Stepped3DPieChart
                  data={generalCompanyData.items}
                  total={generalCompanyData.total}
                  title={generalCompanyData.title}
                />
              )}
            </div>
          </div>

          {/* Life Insurance Company Chart */}
          <div className="bg-white rounded-2xl border border-[#2B4399]/20 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.02)] p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Shield size={20} /></div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg tracking-tight">
                    {lifeCompanyData?.title || 'Life Insurance Company Overview'}
                  </h3>
                  {lifeCompanyData?.total !== undefined && (
                    <span className="text-xs text-gray-500 font-medium">Total: <strong className="text-emerald-600">{lifeCompanyData.total}</strong></span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                {/* Year Filter Options: All, Current Year, Previous Year */}
                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                  {[
                    { label: 'All', value: 'all' },
                    { label: 'Current Year', value: 'curr' },
                    { label: 'Previous Year', value: 'prev' },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setLifeYearFilter(filter.value)}
                      className={`px-3 py-1.5 rounded-md transition-all ${lifeYearFilter === filter.value
                        ? 'bg-white shadow-sm text-[#2F439D] font-bold'
                        : 'text-gray-500 hover:bg-white'
                        }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                {/* Bar / Pie Chart Toggle */}
                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <button
                    onClick={() => setLifeChartMode('Bar')}
                    className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${lifeChartMode === 'Bar' ? 'bg-white shadow-sm text-[#2F439D] font-bold' : 'text-gray-500 hover:bg-white'
                      }`}
                  >
                    <BarChart2 size={14} /> Bar
                  </button>
                  <button
                    onClick={() => setLifeChartMode('Pie')}
                    className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${lifeChartMode === 'Pie' ? 'bg-white shadow-sm text-[#2F439D] font-bold' : 'text-gray-500 hover:bg-white'
                      }`}
                  >
                    <PieChartIcon size={14} /> Pie
                  </button>
                </div>
              </div>
            </div>

            {/* Color Legend Tags */}
            {lifeCompanyData?.items && lifeCompanyData.items.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-[11px] font-medium text-gray-600 bg-gray-50/50 p-4 rounded-xl border border-gray-50 max-h-24 overflow-y-auto">
                {lifeCompanyData.items.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                    <span className="w-3 h-3 rounded-md shadow-sm flex-shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="truncate max-w-[150px]" title={c.name}>{c.name}</span>
                    <span className="bg-white px-1.5 py-0.5 rounded border border-gray-100 font-bold text-[#2F439D]">{c.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Chart Area */}
            <div className="h-[340px] flex items-center justify-center">
              {loadingLifeCompany ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-7 h-7 border-3 border-[#2F439D] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-400 font-medium">Loading chart data...</span>
                </div>
              ) : !lifeCompanyData?.items || lifeCompanyData.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-gray-400 space-y-1">
                  <Shield size={32} className="opacity-20 mb-1" />
                  <span className="text-xs font-semibold text-gray-500">No Life Insurance Data Available</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {lifeChartMode === 'Bar' ? (
                    <BarChart data={lifeCompanyData.items} margin={{ top: 10, right: 10, left: -20, bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                        tickFormatter={(val) => (val.length > 15 ? val.substring(0, 15) + '...' : val)}
                        angle={-25}
                        textAnchor="end"
                        dy={15}
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dx={-10} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={44}>
                        {lifeCompanyData.items.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <Pie
                        {...({ activeIndex: activeLifeIndex, activeShape: renderActiveShape } as any)}
                        data={lifeCompanyData.items}
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={105}
                        dataKey="value"
                        onMouseEnter={(_, index) => setActiveLifeIndex(index)}
                        stroke="none"
                      >
                        {lifeCompanyData.items.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  )}
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Policy Overview & Insurance Type-Wise Overview Row (Side-by-Side) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Policy Overview (Left Side) */}
          <div className="bg-white rounded-2xl border border-[#2B4399]/20 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.02)] p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg tracking-tight">Policy Overview</h3>
                <span className="text-xs text-gray-500 font-medium">
                  Mode: <strong className="text-[#2F439D] capitalize">{policyMode}</strong> | Year: <strong className="text-[#2F439D]">{policyYear}</strong>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                {/* Year Selection */}
                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <button
                    onClick={() => setPolicyYear(String(Number(policyYear) - 1))}
                    className="px-3 py-1.5 hover:bg-white hover:shadow-sm rounded-md flex items-center gap-1 text-gray-500 transition-all"
                  >
                    <ChevronLeft size={14} /> {Number(policyYear) - 1}
                  </button>
                  <button className="px-4 py-1.5 bg-white shadow-sm rounded-md text-[#2F439D] font-bold">
                    {policyYear}
                  </button>
                  <button
                    onClick={() => setPolicyYear(String(Number(policyYear) + 1))}
                    className="px-3 py-1.5 hover:bg-white hover:shadow-sm rounded-md flex items-center gap-1 text-gray-500 transition-all"
                  >
                    {Number(policyYear) + 1} <ChevronRight size={14} />
                  </button>
                </div>
                {/* Mode Selection: General vs Life */}
                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <button
                    onClick={() => setPolicyMode('general')}
                    className={`px-4 py-1.5 rounded-md transition-all ${policyMode === 'general'
                      ? 'bg-white shadow-sm text-[#2F439D] font-bold'
                      : 'text-gray-500 hover:bg-white'
                      }`}
                  >
                    General
                  </button>
                  <button
                    onClick={() => setPolicyMode('life')}
                    className={`px-4 py-1.5 rounded-md transition-all ${policyMode === 'life'
                      ? 'bg-white shadow-sm text-[#2F439D] font-bold'
                      : 'text-gray-500 hover:bg-white'
                      }`}
                  >
                    Life
                  </button>
                </div>
              </div>
            </div>
            <div className="h-[340px] flex items-center justify-center">
              {loadingPolicyChart ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-7 h-7 border-3 border-[#2F439D] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-400 font-medium">Loading policy chart data...</span>
                </div>
              ) : !policyChartData?.items || policyChartData.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-gray-400 space-y-1">
                  <Shield size={32} className="opacity-20 mb-1" />
                  <span className="text-xs font-semibold text-gray-500">No Policy Chart Data Available</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={policyChartData.items} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dx={-10} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={44} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Insurance Type-Wise Overview (Right Side) */}
          <div className="bg-white rounded-2xl border border-[#2B4399]/20 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.02)] p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-[#2F439D] rounded-lg"><Shield size={20} /></div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg tracking-tight">Insurance Type-Wise Overview</h3>
                  {typeChartData?.year && (
                    <span className="text-xs text-gray-500 font-medium">Year: <strong className="text-[#2F439D]">{typeChartData.year}</strong></span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 text-xs font-medium">
                {/* Year Filter Options: All, Current Year, Previous Year */}
                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                  {[
                    { label: 'All', value: 'all' },
                    { label: 'Current Year', value: 'curr' },
                    { label: 'Previous Year', value: 'prev' },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setTypeYearFilter(filter.value)}
                      className={`px-3 py-1.5 rounded-md transition-all ${typeYearFilter === filter.value
                        ? 'bg-white shadow-sm text-[#2F439D] font-bold'
                        : 'text-gray-500 hover:bg-white'
                        }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                {/* Trend / Bar Chart Toggle */}
                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <button
                    onClick={() => setTypeChartMode('Trend')}
                    className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${typeChartMode === 'Trend' ? 'bg-white shadow-sm text-[#2F439D] font-bold' : 'text-gray-500 hover:bg-white'
                      }`}
                  >
                    <TrendingUp size={14} /> Market Trend
                  </button>
                  <button
                    onClick={() => setTypeChartMode('Bar')}
                    className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${typeChartMode === 'Bar' ? 'bg-white shadow-sm text-[#2F439D] font-bold' : 'text-gray-500 hover:bg-white'
                      }`}
                  >
                    <BarChart2 size={14} /> Bar
                  </button>
                </div>
              </div>
            </div>

            {/* Color Legend Tags */}
            {typeChartData?.items && typeChartData.items.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-[11px] font-medium text-gray-600 bg-gray-50/50 p-4 rounded-xl border border-gray-50 max-h-24 overflow-y-auto">
                {typeChartData.items.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                    <span className="w-3 h-3 rounded-md shadow-sm flex-shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="truncate max-w-[150px]" title={c.name}>{c.name}</span>
                    <span className="bg-white px-1.5 py-0.5 rounded border border-gray-100 font-bold text-[#2F439D]">{c.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Chart Area */}
            <div className="h-[340px] flex items-center justify-center">
              {loadingTypeChart ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-7 h-7 border-3 border-[#2F439D] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-400 font-medium">Loading type chart data...</span>
                </div>
              ) : !typeChartData?.items || typeChartData.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-gray-400 space-y-1">
                  <Shield size={32} className="opacity-20 mb-1" />
                  <span className="text-xs font-semibold text-gray-500">No Type Chart Data Available</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {typeChartMode === 'Trend' ? (
                    <AreaChart data={typeChartData.items} margin={{ top: 40, right: 20, left: 20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="typeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2F439D" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#2F439D" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="typeLineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#2F439D" />
                          <stop offset="50%" stopColor="#10B981" />
                          <stop offset="100%" stopColor="#4F46E5" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                        tickFormatter={(val) => (val.length > 14 ? val.substring(0, 14) + '...' : val)}
                        angle={-20}
                        textAnchor="end"
                        dy={12}
                        height={60}
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dx={-5} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2F439D', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="url(#typeLineGradient)"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#typeGradient)"
                        dot={(props: any) => {
                          const { cx, cy, index, payload } = props;
                          if (cx === undefined || cy === undefined) return null;

                          if (coordsRef.current[index]?.x !== cx || coordsRef.current[index]?.y !== cy) {
                            coordsRef.current[index] = { x: cx, y: cy };
                            const itemsCount = typeChartData?.items?.length || 0;
                            if (itemsCount > 0 && coordsRef.current.filter(Boolean).length === itemsCount) {
                              setDotCoords([...coordsRef.current]);
                            }
                          }

                          return (
                            <circle key={`dot-${index}`} cx={cx} cy={cy} r={5} fill={payload?.color || '#2F439D'} stroke="#ffffff" strokeWidth={2.5} />
                          );
                        }}
                        activeDot={{ r: 7, stroke: '#2F439D', strokeWidth: 3, fill: '#FFFFFF' }}
                      />

                      {/* Dynamic Continuous Monotone Curve Runner (Feet Locked to Line, Natural Slanted Tilt) */}
                      {typeChartData?.items && typeChartData.items.length >= 2 && (
                        <>
                          <path
                            ref={trendPathRef}
                            d={trendGuidePathD}
                            fill="none"
                            stroke="transparent"
                            strokeWidth={0}
                            pointerEvents="none"
                            aria-hidden="true"
                          />
                          <g
                            ref={trendCharRef}
                            style={{
                              opacity: 0,
                              pointerEvents: 'none',
                              willChange: 'transform, opacity',
                            }}
                          >
                            <WalkingAgentCharacter />
                          </g>
                        </>
                      )}
                    </AreaChart>
                  ) : (
                    <BarChart data={typeChartData.items} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                        tickFormatter={(val) => (val.length > 15 ? val.substring(0, 15) + '...' : val)}
                        angle={-25}
                        textAnchor="end"
                        dy={15}
                        height={65}
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dx={-10} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                      <Bar
                        dataKey="value"
                        radius={[6, 6, 0, 0]}
                        barSize={44}
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationEasing="ease-out"
                      >
                        {typeChartData.items.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Day Details Popup Modal */}
      {selectedDayModal?.isOpen && (
        <DayDetailsModal
          side={selectedDayModal.side}
          date={selectedDayModal.date}
          onClose={() => setSelectedDayModal(null)}
        />
      )}

      {/* Select Date Range Modal for Renewal Pending */}
      {isRenewalDateRangeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full overflow-visible animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#2F439D] text-white p-4 sm:p-5 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-3">
                <Calendar size={22} className="text-white" />
                <h3 className="font-bold text-lg text-white tracking-wide">Select Renewal Date Range</h3>
              </div>
              <button
                onClick={() => setIsRenewalDateRangeModalOpen(false)}
                className="p-1 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">From Date</label>
                <DatePicker
                  value={tempRenewalFromDate}
                  onChange={(dateStr) => setTempRenewalFromDate(dateStr)}
                  placeholder="dd-mm-yyyy"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">To Date</label>
                <DatePicker
                  value={tempRenewalToDate}
                  onChange={(dateStr) => setTempRenewalToDate(dateStr)}
                  placeholder="dd-mm-yyyy"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => setIsRenewalDateRangeModalOpen(false)}
                className="px-5 py-2 text-sm font-semibold rounded-lg text-gray-600 border border-gray-200 hover:bg-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!tempRenewalFromDate || !tempRenewalToDate) {
                    toast.error('Please select both From Date and To Date');
                    return;
                  }
                  setRenewalDateRange({ from: tempRenewalFromDate, to: tempRenewalToDate });
                  setActiveRenewalPeriod('range');
                  setIsRenewalDateRangeModalOpen(false);
                }}
                className="px-6 py-2 text-sm font-semibold rounded-lg bg-[#2F439D] hover:bg-[#253682] text-white shadow-md transition-all"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
      {isDateRangeModalOpen && (
        <div className="fixed inset-0 z-50 flex  items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full overflow-visible animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#2F439D] text-white p-4 sm:p-5 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-3">
                <Calendar size={22} className="text-white" />
                <h3 className="font-bold text-lg text-white tracking-wide">Select Date Range</h3>
              </div>
              <button
                onClick={() => setIsDateRangeModalOpen(false)}
                className="p-1 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">From Date</label>
                <DatePicker
                  value={tempFromDate}
                  onChange={(dateStr) => setTempFromDate(dateStr)}
                  placeholder="dd-mm-yyyy"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">To Date</label>
                <DatePicker
                  value={tempToDate}
                  onChange={(dateStr) => setTempToDate(dateStr)}
                  placeholder="dd-mm-yyyy"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => setIsDateRangeModalOpen(false)}
                className="px-5 py-2 text-sm font-semibold rounded-lg text-gray-600 border border-gray-200 hover:bg-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyDateRange}
                className="px-6 py-2 text-sm font-semibold rounded-lg bg-[#2F439D] hover:bg-[#253682] text-white shadow-md transition-all"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponents

function MetricCard({ title, value, path }: any) {
  const getIcon = () => {
    switch (title) {
      case 'Total Policy': return (
        <div
          className="w-[42px] h-[42px] bg-[#737FBA]"
          style={{
            maskImage: 'url(/images/insurance-policy.png)',
            WebkitMaskImage: 'url(/images/insurance-policy.png)',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center'
          }}
        />
      );
      case 'Total Quotation': return (
        <div
          className="w-[42px] h-[42px] bg-[#737FBA]"
          style={{
            maskImage: 'url(/images/Quotation.png)',
            WebkitMaskImage: 'url(/images/Quotation.png)',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center'
          }}
        />
      );
      case 'Total Renewal': return (
        <div
          className="w-[42px] h-[42px] bg-[#737FBA]"
          style={{
            maskImage: 'url(/images/Renewal.png)',
            WebkitMaskImage: 'url(/images/Renewal.png)',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center'
          }}
        />
      );
      case 'Total Customer': return (
        <div
          className="w-[42px] h-[42px] bg-[#737FBA]"
          style={{
            maskImage: 'url(/images/customer.png)',
            WebkitMaskImage: 'url(/images/customer.png)',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center'
          }}
        />
      );
      case 'Total Lead': return (
        <div
          className="w-[42px] h-[42px] bg-[#737FBA]"
          style={{
            maskImage: 'url(/images/lead.png)',
            WebkitMaskImage: 'url(/images/lead.png)',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center'
          }}
        />
      );
      case 'Total Claim': return (
        <div
          className="w-[42px] h-[42px] bg-[#737FBA]"
          style={{
            maskImage: 'url(/images/claim.png)',
            WebkitMaskImage: 'url(/images/claim.png)',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center'
          }}
        />
      );
      default: return null;
    }
  };

  const content = (
    <div className={`relative bg-white rounded-xl overflow-hidden border border-[#737fba] shadow-sm transition-all duration-300 hover:shadow-[0_12px_24px_-8px_rgba(115,127,186,0.3)] hover:border-[#737FBA] hover:-translate-y-1 group ${path ? 'cursor-pointer' : ''}`}>

      <div className="flex h-[100px]">
        {/* Left Side: Icon Container */}
        <div className="w-[90px] h-full bg-gradient-to-br from-[#737FBA]/5 to-[#737FBA]/10 flex items-center justify-center border-r border-[#737FBA]/20 group-hover:bg-[#737FBA]/10 transition-colors duration-300">
          <div className="group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ease-out drop-shadow-sm">
            {getIcon()}
          </div>
        </div>

        {/* Right Side: Text Container */}
        <div className="flex-1 flex flex-col justify-center px-6">
          <h4 className="text-[13px] font-medium text-gray-500 uppercase tracking-widest mb-1 group-hover:text-[#737FBA] transition-colors">{title}</h4>
          <div className="text-[32px] font-semibold text-gray-800 leading-none tracking-tight">{value}</div>
        </div>
      </div>

    </div>
  );

  if (path) {
    return (
      <Link href={path} className="block focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}

interface CalendarGridProps {
  year: number;
  month: number;
  events?: Record<string, string[]>;
  colorMap: Record<string, string>;
  onDateClick?: (dateStr: string) => void;
}

function CalendarGrid({ year, month, events = {}, colorMap, onDateClick }: CalendarGridProps) {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayIndex = new Date(year, month - 1, 1).getDay();

  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddedDates = [...Array(firstDayIndex).fill(null), ...dates];

  const today = new Date();
  const isCurrentMonthAndYear = today.getFullYear() === year && (today.getMonth() + 1) === month;
  const todayDate = today.getDate();

  return (
    <div className="w-full select-none pb-2">
      {/* Sleek Header Row */}
      <div className="grid grid-cols-7 mb-4">
        {days.map((d, i) => (
          <div
            key={i}
            className={`text-center text-[11px] font-bold uppercase tracking-wider ${i === 0 || i === 6 ? 'text-gray-400' : 'text-[#2F439D]/70'}`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Floating Circular Grid */}
      <div className="grid grid-cols-7 gap-y-3 sm:gap-y-4">
        {paddedDates.map((date, idx) => {
          if (!date) return <div key={idx} className="h-10 sm:h-12" />;

          const isToday = isCurrentMonthAndYear && date === todayDate;
          const formattedMonth = String(month).padStart(2, '0');
          const formattedDay = String(date).padStart(2, '0');
          const dateKey = `${year}-${formattedMonth}-${formattedDay}`;

          const dayEvents = events[dateKey] || events[`${year}-${month}-${date}`] || [];
          const hasEvents = dayEvents.length > 0;
          const isWeekend = idx % 7 === 0 || idx % 7 === 6;

          return (
            <div
              key={idx}
              onClick={() => onDateClick?.(dateKey)}
              className="flex justify-center items-center cursor-pointer group"
            >
              <div
                className={`relative w-9 h-9 sm:w-11 sm:h-11 flex flex-col items-center justify-center rounded-full transition-all duration-300 ease-out ${isToday
                  ? 'bg-gradient-to-br from-[#2F439D] to-[#4A90D9] shadow-[0_4px_16px_rgba(47,67,157,0.4)] scale-110 z-10 ring-4 ring-[#2F439D]/10'
                  : hasEvents
                    ? 'bg-white shadow-[0_2px_12px_-3px_rgba(0,0,0,0.1)] group-hover:scale-110 border border-gray-100/50'
                    : 'bg-transparent group-hover:bg-gray-100/80 group-hover:scale-105'
                  }`}
              >
                <span
                  className={`text-[14px] sm:text-[15px] tracking-tight transition-colors duration-300 ${isToday
                    ? 'text-white font-bold'
                    : hasEvents
                      ? 'text-[#2F439D] font-bold'
                      : isWeekend
                        ? 'text-gray-400 font-medium'
                        : 'text-gray-700 font-medium'
                    }`}
                >
                  {date}
                </span>

                {/* Micro Event Indicators */}
                {hasEvents && (
                  <div className="absolute bottom-1.5 flex gap-[3px] items-center justify-center">
                    {dayEvents.map((evt: string, eIdx: number) => {
                      const dotColor = colorMap[evt.toLowerCase()] || 'bg-gray-400';
                      return (
                        <span
                          key={eIdx}
                          className={`w-1 h-1 rounded-full ${dotColor} ${isToday ? 'border-[0.5px] border-white/50 bg-white' : ''}`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskStat({ label, value, color, bg = "bg-white" }: any) {
  return (
    <div className={`flex flex-col items-center justify-center py-4 px-2 ${bg} border ${bg === 'bg-white' ? 'border-gray-100' : 'border-rose-100'} rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all cursor-pointer hover:shadow-md`}>
      <div className={`text-xl font-medium ${color}`}>{value}</div>
      <div className="text-[9px] font-semibold text-gray-500 mt-1 uppercase tracking-widest">{label}</div>
    </div>
  );
}

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl p-3 text-sm flex flex-col gap-1.5 min-w-[140px] z-50">
        <p className="font-medium text-gray-900 border-b border-gray-100 pb-1 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm shadow-sm" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-600 font-semibold text-xs">{entry.name}</span>
            </div>
            <span className="font-medium text-gray-900">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Day Details Popup Modal Component
interface DayDetailsModalProps {
  side: 'left' | 'right';
  date: string;
  onClose: () => void;
}

function DayDetailsModal({ side, date, onClose }: DayDetailsModalProps) {
  const { data, isLoading } = useDashboardDayDetails({ side, date });

  const events = data?.events || {};
  const totalEvents = data?.total_events ?? 0;
  const displayDate = data?.date || date;

  const isLeft = side === 'left';

  const birthdayList = events.birthday || [];
  const anniversaryList = events.anniversary || [];
  const leadList = events.lead || [];

  const healthList = events.health || [];
  const motorList = events.motor || [];
  const lifeList = events.life || [];
  const otherList = events.other || [];

  const hasEvents = isLeft
    ? birthdayList.length > 0 || anniversaryList.length > 0 || leadList.length > 0
    : healthList.length > 0 || motorList.length > 0 || lifeList.length > 0 || otherList.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2B4399]/20 bg-[#F2F7FF]">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isLeft ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {isLeft ? 'Event Details' : 'Policy Renewal Details'}
              </h3>
              <p className="text-xs text-gray-500 font-medium">{displayDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-[#2F439D] text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
              {totalEvents} {totalEvents === 1 ? 'Event' : 'Events'}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <div className="w-8 h-8 border-3 border-[#2F439D] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-semibold text-gray-400">Loading details...</p>
            </div>
          ) : !hasEvents ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="p-4 bg-gray-100 rounded-full text-gray-400">
                <Calendar size={32} />
              </div>
              <h4 className="font-semibold text-gray-700 text-base">No Events Found</h4>
              <p className="text-xs text-gray-400 max-w-xs">
                There are no {isLeft ? 'birthday, anniversary, or lead events' : 'policy renewals'} recorded for {displayDate}.
              </p>
            </div>
          ) : (
            <>
              {/* Left Side View */}
              {isLeft && (
                <>
                  {/* Birthdays */}
                  {birthdayList.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 w-fit">
                        <Cake size={14} /> Birthday ({birthdayList.length})
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {birthdayList.map((item, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="p-2.5 bg-amber-100/70 text-amber-700 rounded-xl mt-0.5">
                                <User size={18} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm capitalize">{item.name || 'N/A'}</h4>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                                  {item.phone && (
                                    <a href={`tel:${item.phone}`} className="flex items-center gap-1 hover:text-[#2F439D]">
                                      <Phone size={12} /> {item.phone}
                                    </a>
                                  )}
                                  {item.email && (
                                    <a href={`mailto:${item.email}`} className="flex items-center gap-1 hover:text-[#2F439D]">
                                      <Mail size={12} /> {item.email}
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 self-start sm:self-center">
                              {item.age !== undefined && item.age !== null && (
                                <span className="bg-amber-100 text-amber-800 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-amber-200">
                                  Age: {item.age}
                                </span>
                              )}
                              {item.dob && (
                                <span className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2.5 py-1 rounded-md">
                                  DOB: {item.dob}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Anniversaries */}
                  {anniversaryList.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 w-fit">
                        <Heart size={14} /> Anniversary ({anniversaryList.length})
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {anniversaryList.map((item, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="p-2.5 bg-rose-100/70 text-rose-700 rounded-xl mt-0.5">
                                <Heart size={18} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm capitalize">{item.name || 'N/A'}</h4>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                                  {item.phone && (
                                    <a href={`tel:${item.phone}`} className="flex items-center gap-1 hover:text-[#2F439D]">
                                      <Phone size={12} /> {item.phone}
                                    </a>
                                  )}
                                  {item.email && (
                                    <a href={`mailto:${item.email}`} className="flex items-center gap-1 hover:text-[#2F439D]">
                                      <Mail size={12} /> {item.email}
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                            {item.anniversary_date && (
                              <span className="bg-rose-100 text-rose-800 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-rose-200 self-start sm:self-center">
                                Date: {item.anniversary_date}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Leads */}
                  {leadList.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 w-fit">
                        <UserCheck size={14} /> Lead ({leadList.length})
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {leadList.map((item, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="p-2.5 bg-emerald-100/70 text-emerald-700 rounded-xl mt-0.5">
                                <UserCheck size={18} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm capitalize">{item.name || 'N/A'}</h4>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                                  {item.phone && (
                                    <a href={`tel:${item.phone}`} className="flex items-center gap-1 hover:text-[#2F439D]">
                                      <Phone size={12} /> {item.phone}
                                    </a>
                                  )}
                                  {item.email && (
                                    <a href={`mailto:${item.email}`} className="flex items-center gap-1 hover:text-[#2F439D]">
                                      <Mail size={12} /> {item.email}
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Right Side View */}
              {!isLeft && (
                <>
                  {renderPolicyCategory('Health Insurance', healthList, 'bg-rose-50 border-rose-100 text-rose-700', 'bg-rose-500')}
                  {renderPolicyCategory('Motor Insurance', motorList, 'bg-blue-50 border-blue-100 text-blue-700', 'bg-blue-500')}
                  {renderPolicyCategory('Life Insurance', lifeList, 'bg-emerald-50 border-emerald-100 text-emerald-700', 'bg-emerald-500')}
                  {renderPolicyCategory('Other Insurance', otherList, 'bg-gray-50 border-gray-200 text-gray-700', 'bg-gray-500')}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function renderPolicyCategory(categoryTitle: string, items: PolicyRenewalItem[], headerStyle: string, badgeBg: string) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg border w-fit ${headerStyle}`}>
        <Shield size={14} /> {categoryTitle} ({items.length})
      </div>
      <div className="grid grid-cols-1 gap-3">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className={`text-white text-[10px] font-bold px-2 py-0.5 rounded-md ${badgeBg}`}>
                  {item.insurance_type_name || 'Policy'}
                </span>
                <span className="font-mono text-xs font-semibold text-gray-800 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                  {item.policy_number?.trim() || 'N/A'}
                </span>
              </div>
              {item.expiry && (
                <div className="text-xs text-rose-600 font-medium flex items-center gap-1">
                  <Calendar size={12} /> Expiry: <span className="font-semibold">{item.expiry}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm capitalize">{item.name || 'N/A'}</h4>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                  {item.phone && (
                    <a href={`tel:${item.phone}`} className="flex items-center gap-1 hover:text-[#2F439D]">
                      <Phone size={12} /> {item.phone}
                    </a>
                  )}
                  {item.email && (
                    <a href={`mailto:${item.email}`} className="flex items-center gap-1 hover:text-[#2F439D]">
                      <Mail size={12} /> {item.email}
                    </a>
                  )}
                </div>
              </div>

              {item.premium_amount !== undefined && item.premium_amount !== null && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5 flex flex-col items-end self-start sm:self-center">
                  <span className="text-[10px] uppercase font-semibold text-emerald-600">Premium</span>
                  <span className="text-sm font-extrabold text-emerald-700">₹{item.premium_amount}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
