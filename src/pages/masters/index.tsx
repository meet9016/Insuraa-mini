import React, { useState } from 'react';
import Head from 'next/head';
import {
  Building2,
  Shield,
  Building,
  UserCheck,
  Users,
  Bike,
  FileText,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Settings,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';

export default function MasterManagement() {
  // State for collapsible sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    general: true,
    life: true,
    other: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const generalMasters = [
    {
      title: 'Company List',
      description: 'Manage general insurance companies',
      icon: <Building2 size={20} strokeWidth={2} />,
      link: '/masters/company',
    },
    {
      title: 'Agency List',
      description: 'Manage general insurance agencies',
      icon: <Users size={20} strokeWidth={2} />,
      link: '/masters/general-agency-code',
    },
  ];

  const lifeMasters = [
    {
      title: 'Company List',
      description: 'Manage life insurance companies',
      icon: <Building2 size={20} strokeWidth={2} />,
      link: '/masters/life-company',
    },
    {
      title: 'Agency List',
      description: 'Manage life insurance agencies',
      icon: <Users size={20} strokeWidth={2} />,
      link: '/masters/life-agency-code',
    },
    {
      title: 'Rider List',
      description: 'Manage riders',
      icon: <Bike size={20} strokeWidth={2} />,
      link: '/masters/rider',
    },
  ];

  const otherMasters = [
    {
      title: 'Source of Lead',
      description: 'Manage lead sources',
      icon: <UserPlus size={20} strokeWidth={2} />,
      link: '/masters/source-of-lead',
    },
    {
      title: 'Insurance Document',
      description: 'Manage insurance documents',
      icon: <FileText size={20} strokeWidth={2} />,
      link: '/masters/document',
    },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px)] py-4">
      <Head>
        <title>Master Management - Insuraa</title>
      </Head>

      <div className="mx-auto space-y-6">

        {/* Page Title & Subtitle */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-[#2B4399] tracking-tight">Master Management</h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">
            Configure and manage all system masters and lists
          </p>
        </div>

        {/* SECTION 1: General Insurance */}
        <div className="bg-white rounded-2xl border-2 border-blue-200/80 hover:border-[#2B4399]/50 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300">

          {/* Section Header */}
          <div
            onClick={() => toggleSection('general')}
            className="bg-[#eff4ff] px-6 py-4 flex items-center justify-between cursor-pointer select-none border-b border-blue-200/60"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#dbe6fe] text-[#2B4399] flex items-center justify-center font-bold">
                <Shield size={20} strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-[#2B4399]">General Insurance</h2>
                <span className="text-xs font-semibold text-gray-500 hidden sm:inline-block">
                  Manage general insurance masters
                </span>
                <span className="bg-[#dbe6fe] text-[#2B4399] px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {generalMasters.length} Masters
                </span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white text-gray-400 flex items-center justify-center shadow-xs">
              {openSections.general ? <ChevronUp size={18} strokeWidth={2.5} /> : <ChevronDown size={18} strokeWidth={2.5} />}
            </div>
          </div>

          {/* Section Content Rows */}
          {openSections.general && (
            <div className="divide-y divide-gray-100">
              {generalMasters.map((item, idx) => (
                <Link key={idx} href={item.link} className="group block">
                  <div className="px-6 py-4 flex items-center justify-between gap-4 transition-colors hover:bg-blue-50/30">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2B4399] flex items-center justify-center shrink-0 group-hover:bg-[#2B4399] group-hover:text-white transition-colors duration-200">
                        {item.icon}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-gray-800 group-hover:text-[#2B4399] transition-colors truncate">
                          {item.title}
                        </h3>
                        <p className="text-xs font-medium text-gray-400 truncate">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-gray-400 group-hover:text-[#2B4399] group-hover:translate-x-1 transition-all">
                      <ChevronRight size={18} strokeWidth={2.5} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>

        {/* SECTION 2: Life Insurance */}
        <div className="bg-white rounded-2xl border-2 border-emerald-200/80 hover:border-emerald-500/50 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300">

          {/* Section Header */}
          <div
            onClick={() => toggleSection('life')}
            className="bg-[#f0fdf4] px-6 py-4 flex items-center justify-between cursor-pointer select-none border-b border-emerald-200/60"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#dcfce7] text-emerald-700 flex items-center justify-center font-bold">
                <Shield size={20} strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-emerald-800">Life Insurance</h2>
                <span className="text-xs font-semibold text-gray-500 hidden sm:inline-block">
                  Manage life insurance masters
                </span>
                <span className="bg-[#dcfce7] text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {lifeMasters.length} Masters
                </span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white text-gray-400 flex items-center justify-center shadow-xs">
              {openSections.life ? <ChevronUp size={18} strokeWidth={2.5} /> : <ChevronDown size={18} strokeWidth={2.5} />}
            </div>
          </div>

          {/* Section Content Rows */}
          {openSections.life && (
            <div className="divide-y divide-gray-100">
              {lifeMasters.map((item, idx) => (
                <Link key={idx} href={item.link} className="group block">
                  <div className="px-6 py-4 flex items-center justify-between gap-4 transition-colors hover:bg-emerald-50/30">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                        {item.icon}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-gray-800 group-hover:text-emerald-700 transition-colors truncate">
                          {item.title}
                        </h3>
                        <p className="text-xs font-medium text-gray-400 truncate">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-gray-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all">
                      <ChevronRight size={18} strokeWidth={2.5} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>

        {/* SECTION 3: Other System Masters */}
        <div className="bg-white rounded-2xl border-2 border-purple-200/80 hover:border-purple-500/50 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300">

          {/* Section Header */}
          <div
            onClick={() => toggleSection('other')}
            className="bg-[#faf5ff] px-6 py-4 flex items-center justify-between cursor-pointer select-none border-b border-purple-200/60"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f3e8ff] text-purple-700 flex items-center justify-center font-bold">
                <Settings size={20} strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-purple-900">Other</h2>
                <span className="text-xs font-semibold text-gray-500 hidden sm:inline-block">
                  Manage other system masters
                </span>
                <span className="bg-[#f3e8ff] text-purple-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {otherMasters.length} Masters
                </span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white text-gray-400 flex items-center justify-center shadow-xs">
              {openSections.other ? <ChevronUp size={18} strokeWidth={2.5} /> : <ChevronDown size={18} strokeWidth={2.5} />}
            </div>
          </div>

          {/* Section Content Rows */}
          {openSections.other && (
            <div className="divide-y divide-gray-100">
              {otherMasters.map((item, idx) => (
                <Link key={idx} href={item.link} className="group block">
                  <div className="px-6 py-4 flex items-center justify-between gap-4 transition-colors hover:bg-purple-50/30">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-200">
                        {item.icon}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-gray-800 group-hover:text-purple-700 transition-colors truncate">
                          {item.title}
                        </h3>
                        <p className="text-xs font-medium text-gray-400 truncate">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-gray-400 group-hover:text-purple-700 group-hover:translate-x-1 transition-all">
                      <ChevronRight size={18} strokeWidth={2.5} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
