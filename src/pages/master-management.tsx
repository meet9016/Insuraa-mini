import React from 'react';
import Head from 'next/head';
import { 
  Building2, 
  MapPin, 
  Users, 
  Bike, 
  FileText, 
  GraduationCap, 
  Target,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function MasterManagement() {
  const masterCards = [
    {
      title: 'Companies List',
      description: 'Manage Companies',
      icon: <Building2 size={28} strokeWidth={2} />,
      link: '#',
      color: 'bg-blue-50 text-blue-600',
      hoverColor: 'group-hover:bg-blue-600 group-hover:text-white',
    },
    {
      title: 'Branch List',
      description: 'Manage Branch',
      icon: <MapPin size={28} strokeWidth={2} />,
      link: '#',
      color: 'bg-indigo-50 text-indigo-600',
      hoverColor: 'group-hover:bg-indigo-600 group-hover:text-white',
    },
    {
      title: 'Source Of Lead',
      description: 'Manage Lead Sources',
      icon: <Users size={28} strokeWidth={2} />,
      link: '#',
      color: 'bg-purple-50 text-purple-600',
      hoverColor: 'group-hover:bg-purple-600 group-hover:text-white',
    },
    {
      title: 'Rider List',
      description: 'Manage Riders',
      icon: <Bike size={28} strokeWidth={2} />,
      link: '#',
      color: 'bg-emerald-50 text-emerald-600',
      hoverColor: 'group-hover:bg-emerald-600 group-hover:text-white',
    },
    {
      title: 'Document List',
      description: 'Manage Documents',
      icon: <FileText size={28} strokeWidth={2} />,
      link: '#',
      color: 'bg-rose-50 text-rose-600',
      hoverColor: 'group-hover:bg-rose-600 group-hover:text-white',
    },
    {
      title: 'Education List',
      description: 'Manage Education Levels',
      icon: <GraduationCap size={28} strokeWidth={2} />,
      link: '#',
      color: 'bg-cyan-50 text-cyan-600',
      hoverColor: 'group-hover:bg-cyan-600 group-hover:text-white',
    },
    {
      title: 'Target List',
      description: 'Manage Targets',
      icon: <Target size={28} strokeWidth={2} />,
      link: '#',
      color: 'bg-amber-50 text-amber-600',
      hoverColor: 'group-hover:bg-amber-600 group-hover:text-white',
    }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px)] p-4 md:p-8">
      <Head>
        <title>Master Management - Insuraa</title>
      </Head>

      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-[#2B4399] tracking-tight">Master Management</h1>
          <p className="text-gray-500 font-medium mt-1">Configure and manage all system masters and lists</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {masterCards.map((card, index) => (
            <Link href={card.link} key={index} className="group block">
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50 hover:shadow-xl hover:shadow-[#2B4399]/5 hover:border-[#2B4399]/20 transition-all duration-300 relative overflow-hidden flex flex-col h-full hover:-translate-y-1">
                
                {/* Accent line on top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#2B4399]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.color} ${card.hoverColor} transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:rotate-3`}>
                    {card.icon}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#2B4399]/5 group-hover:text-[#2B4399] transition-colors">
                    <ChevronRight size={18} strokeWidth={3} />
                  </div>
                </div>

                <div>
                  <h3 className="text-[17px] font-bold text-gray-900 group-hover:text-[#2B4399] transition-colors mb-1.5">{card.title}</h3>
                  <p className="text-sm font-semibold text-gray-400 group-hover:text-gray-500 transition-colors">{card.description}</p>
                </div>

                {/* Subtle background pattern/gradient on hover */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#2B4399]/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
