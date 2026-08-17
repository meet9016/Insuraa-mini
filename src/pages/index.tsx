import React, { useState, useEffect } from 'react';
import Head from 'next/head';
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
  Sector
} from 'recharts';
import { ChevronLeft, ChevronRight, Filter, Calendar, Shield, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';

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

export default function Dashboard() {
  const [activeTaskFilter, setActiveTaskFilter] = useState('Today');
  const [companyChartMode, setCompanyChartMode] = useState('Bar');
  const [typeChartMode, setTypeChartMode] = useState('Bar');
  const [activeCompanyIndex, setActiveCompanyIndex] = useState(0);
  const [activeTypeIndex, setActiveTypeIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = getAuthToken();
      if (!token) {
        window.location.href = "/login";
      }
    }
  }, []);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <Head>
        <title>Dashboard - Insuraa</title>
      </Head>

      <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          <MetricCard title="Total Policy" value="18" percentage="18%" />
          <MetricCard title="Total Quatation" value="₹ 6.5 K" percentage="0.07%" />
          <MetricCard title="Total Renewal" value="4" percentage="0%" />
          <MetricCard title="Total Customer" value="49" percentage="8.83%" />
          <MetricCard title="Total Lead" value="34" percentage="0.01%" />
          <MetricCard title="Total Calim" value="₹ 6.5 K" percentage="0.07%" />
        </div>

        {/* Calendars Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event Details Calendar */}
          <div className="bg-white rounded-2xl border border-[#2B4399]/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 sm:p-6 border-b border-[#2B4399]/20 bg-[#F2F7FF]">
              <h3 className="font-semibold text-gray-900 text-lg">Event Details</h3>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50"></span> Birthday</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-sm shadow-rose-400/50"></span> Anniversary</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span> Lead</div>

                <div className="flex items-center gap-2 sm:ml-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <span className="font-medium text-gray-700 px-2">August 2026</span>
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded-md hover:bg-white hover:shadow-sm text-gray-400 hover:text-gray-800 transition-all"><ChevronLeft size={16} /></button>
                    <button className="px-3 py-1 rounded-md bg-white shadow-sm text-[#2F439D] font-medium">Today</button>
                    <button className="p-1 rounded-md hover:bg-white hover:shadow-sm text-gray-400 hover:text-gray-800 transition-all"><ChevronRight size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 bg-white">
              <CalendarGrid highlights={[{ day: 11, color: 'bg-[#2F439D] text-white shadow-md shadow-[#2F439D]/30' }, { day: 13, dot: 'bg-emerald-500' }, { day: 20, dot: 'bg-amber-400' }]} />
            </div>
          </div>

          {/* Policy Renewal Calendar */}
          <div className="bg-white rounded-2xl border border-[#2B4399]/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 sm:p-6 border-b border-[#2B4399]/20 bg-[#F2F7FF]">
              <h3 className="font-semibold text-gray-900 text-lg">Policy Renewal</h3>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span> Health</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50"></span> Motor</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span> Life</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-400 shadow-sm shadow-gray-400/50"></span> Other</div>

                <div className="flex items-center gap-2 sm:ml-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <span className="font-medium text-gray-700 px-2">August 2026</span>
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded-md hover:bg-white hover:shadow-sm text-gray-400 hover:text-gray-800 transition-all"><ChevronLeft size={16} /></button>
                    <button className="px-3 py-1 rounded-md bg-white shadow-sm text-[#2F439D] font-medium">Today</button>
                    <button className="p-1 rounded-md hover:bg-white hover:shadow-sm text-gray-400 hover:text-gray-800 transition-all"><ChevronRight size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 bg-white">
              <CalendarGrid highlights={[{ day: 11, color: 'bg-[#2F439D] text-white shadow-md shadow-[#2F439D]/30' }]} />
            </div>
          </div>
        </div>

        {/* Life Insurance Payment Pending */}
        <DataTable
          title="Life Insurance Payment Pending"
          columns={LIFE_PAYMENT_COLUMNS}
          data={[]}
        />

        {/* General Insurance Renewal Pending */}
        <DataTable
          title="General Insurance Renewal Pending"
          columns={RENEWAL_COLUMNS}
          data={[]}
        />

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

        {/* Charts Row */}
        <div className="bg-white rounded-2xl border border-[#2B4399]/20 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.02)] p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="font-semibold text-gray-900 text-lg tracking-tight">Policy Overview</h3>
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
              <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                <button className="px-4 py-1.5 hover:bg-white hover:shadow-sm rounded-md flex items-center gap-1 text-gray-500 transition-all"><ChevronLeft size={14} /> 2025</button>
                <button className="px-5 py-1.5 bg-white shadow-sm rounded-md text-[#2F439D]">2026</button>
                <button className="px-4 py-1.5 hover:bg-white hover:shadow-sm rounded-md flex items-center gap-1 text-gray-500 transition-all">2027 <ChevronRight size={14} /></button>
              </div>
              <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                <button className="px-5 py-1.5 bg-white shadow-sm rounded-md text-[#2F439D]">Monthly</button>
                <button className="px-5 py-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-500 transition-all">By Type</button>
              </div>
            </div>
          </div>
          <div className="h-[320px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={POLICY_OVERVIEW_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Company and Type Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company-Wise */}
          <div className="bg-white rounded-2xl border border-[#2B4399]/20 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.02)] p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-[#2F439D] rounded-lg"><Shield size={20} /></div>
                <h3 className="font-semibold text-gray-900 text-lg tracking-tight">Company-Wise Insurance Overview</h3>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <button className="px-5 py-1.5 bg-white shadow-sm rounded-md text-[#2F439D]">All</button>
                  <button className="px-4 py-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-500 transition-all">2026</button>
                  <button className="px-4 py-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-500 transition-all">2025</button>
                </div>
                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <button onClick={() => setCompanyChartMode('Bar')} className={`px-4 py-1.5 shadow-sm rounded-md flex items-center gap-1.5 transition-all ${companyChartMode === 'Bar' ? 'bg-white text-[#2F439D]' : 'text-gray-500 hover:bg-white'}`}><BarChart2 size={14} /> Bar</button>
                  <button onClick={() => setCompanyChartMode('Pie')} className={`px-4 py-1.5 shadow-sm rounded-md flex items-center gap-1.5 transition-all ${companyChartMode === 'Pie' ? 'bg-white text-[#2F439D]' : 'text-gray-500 hover:bg-white'}`}><PieChartIcon size={14} /> Pie</button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-3 mb-8 text-[11px] font-medium text-gray-600 bg-gray-50/50 p-4 rounded-xl border border-gray-50">
              {COMPANY_OVERVIEW_DATA.map((c, i) => (
                <div key={i} className="flex items-center gap-2 hover:text-gray-900 transition-colors cursor-pointer">
                  <span className="w-3 h-3 rounded-md shadow-sm" style={{ backgroundColor: c.color }}></span>
                  {c.name.substring(0, 20)}... <span className="bg-white px-1.5 py-0.5 rounded border border-gray-100">{c.value}</span>
                </div>
              ))}
            </div>

            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                {companyChartMode === 'Bar' ? (
                  <BarChart data={COMPANY_OVERVIEW_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} tickFormatter={(val) => val.substring(0, 15) + '...'} angle={-25} textAnchor="end" dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dx={-10} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={48}>
                      {COMPANY_OVERVIEW_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <Pie
                      activeIndex={activeCompanyIndex}
                      activeShape={renderActiveShape}
                      data={COMPANY_OVERVIEW_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      dataKey="value"
                      onMouseEnter={(_, index) => setActiveCompanyIndex(index)}
                      stroke="none"
                    >
                      {COMPANY_OVERVIEW_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Type-Wise */}
          <div className="bg-white rounded-2xl border border-[#2B4399]/20 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.02)] p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-[#2F439D] rounded-lg"><Shield size={20} /></div>
                <h3 className="font-semibold text-gray-900 text-lg tracking-tight">Insurance Type-Wise Overview</h3>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <button className="px-5 py-1.5 bg-white shadow-sm rounded-md text-[#2F439D]">All</button>
                  <button className="px-4 py-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-500 transition-all">2026</button>
                  <button className="px-4 py-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-500 transition-all">2025</button>
                </div>
                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <button onClick={() => setTypeChartMode('Bar')} className={`px-4 py-1.5 shadow-sm rounded-md flex items-center gap-1.5 transition-all ${typeChartMode === 'Bar' ? 'bg-white text-[#2F439D]' : 'text-gray-500 hover:bg-white'}`}><BarChart2 size={14} /> Bar</button>
                  <button onClick={() => setTypeChartMode('Pie')} className={`px-4 py-1.5 shadow-sm rounded-md flex items-center gap-1.5 transition-all ${typeChartMode === 'Pie' ? 'bg-white text-[#2F439D]' : 'text-gray-500 hover:bg-white'}`}><PieChartIcon size={14} /> Donut</button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-3 mb-8 text-[11px] font-medium text-gray-600 bg-gray-50/50 p-4 rounded-xl border border-gray-50">
              {TYPE_OVERVIEW_DATA.map((c, i) => (
                <div key={i} className="flex items-center gap-2 hover:text-gray-900 transition-colors cursor-pointer">
                  <span className="w-3 h-3 rounded-md shadow-sm" style={{ backgroundColor: c.color }}></span>
                  {c.name} <span className="bg-white px-1.5 py-0.5 rounded border border-gray-100">{c.value}</span>
                </div>
              ))}
            </div>

            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                {typeChartMode === 'Bar' ? (
                  <BarChart data={TYPE_OVERVIEW_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} tickFormatter={(val) => val.substring(0, 15) + '...'} angle={-25} textAnchor="end" dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dx={-10} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={48}>
                      {TYPE_OVERVIEW_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <Pie
                      activeIndex={activeTypeIndex}
                      activeShape={renderActiveShape}
                      data={TYPE_OVERVIEW_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      dataKey="value"
                      onMouseEnter={(_, index) => setActiveTypeIndex(index)}
                      stroke="none"
                    >
                      {TYPE_OVERVIEW_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponents

function MetricCard({ title, value }: any) {
  return (
    <div className="relative bg-white border border-[#2f439d96] rounded-md px-5 py-4 flex flex-col justify-center min-h-[105px] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_30px_-8px_rgba(45,53,145,0.3)] group shadow-[0_4px_15px_-4px_rgba(0,0,0,0.05)]">

      {/* Soft Inner Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D3591]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Decorative Graphic */}
      <div className="absolute right-0 top-0 w-16 h-16 bg-gradient-to-bl from-[#2BBF8C]/10 to-transparent rounded-bl-full pointer-events-none" />
      <div className="absolute -right-2 -bottom-2 w-10 h-10 border-[3px] border-[#2D3591]/10 rounded-full group-hover:scale-[2] transition-transform duration-700 pointer-events-none" />

      <div className="relative z-10 flex flex-col">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2BBF8C] shadow-[0_0_5px_rgba(43,191,140,0.8)]" />
          <h4 className="text-[18px] font-medium text-gray-700">{title}</h4>
        </div>
        <div className="text-[28px] font-medium text-gray-800 tracking-tighter pl-3 drop-shadow-sm">{value}</div>
      </div>

    </div>
  );
}

function CalendarGrid({ highlights }: any) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);
  const paddedDates = [null, null, null, null, null, null, ...dates];

  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="grid grid-cols-7 bg-gray-50/80 border-b border-gray-100">
        {days.map((d, i) => (
          <div key={i} className="py-2.5 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-sm">
        {paddedDates.map((date, idx) => {
          if (!date) return <div key={idx} className="p-2 border-r border-b border-gray-50 bg-gray-50/30 min-h-[44px]"></div>;

          const highlight = highlights.find((h: any) => h.day === date);

          return (
            <div key={idx} className={`relative p-2 border-r border-b border-gray-50 min-h-[44px] flex flex-col items-center justify-center transition-colors hover:bg-gray-50/80 cursor-pointer`}>
              <div className={`w-7 h-7 flex items-center justify-center rounded-lg font-medium text-[13px] z-10 ${highlight?.color ? highlight.color : 'text-gray-700'}`}>
                {date}
              </div>
              {highlight?.dot && (
                <span className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full shadow-sm ${highlight.dot}`}></span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
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
