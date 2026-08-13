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
      icon: <Building2 size={24} strokeWidth={2.5} />,
      link: '/add-companies',
    },
    {
      title: 'Branch List',
      description: 'Manage Branch',
      icon: <MapPin size={24} strokeWidth={2.5} />,
      link: '/branch-list',
    },
    {
      title: 'Source Of Lead',
      description: 'Manage Lead Sources',
      icon: <Users size={24} strokeWidth={2.5} />,
      link: '#',
    },
    {
      title: 'Rider List',
      description: 'Manage Riders',
      icon: <Bike size={24} strokeWidth={2.5} />,
      link: '/rider-list',
    },
    {
      title: 'Document List',
      description: 'Manage Documents',
      icon: <FileText size={24} strokeWidth={2.5} />,
      link: '/document-list',
    },
    {
      title: 'Education List',
      description: 'Manage Education Levels',
      icon: <GraduationCap size={24} strokeWidth={2.5} />,
      link: '/education-list',
    },
    {
      title: 'Target List',
      description: 'Manage Targets',
      icon: <Target size={24} strokeWidth={2.5} />,
      link: '/target-list',
    }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px)] ">
      <Head>
        <title>Master Management - Insuraa</title>
      </Head>

      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-[#2B4399] tracking-tight">Master Management</h1>
          <p className="text-gray-500 font-medium mt-1">Configure and manage all system masters and lists</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {masterCards.map((card, index) => (
            <Link href={card.link} key={index} className="group block">
              <div className="bg-white border-1 border-[#2B4399] hover:border-[#2B4399] rounded-2xl p-5 flex items-center gap-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(43,67,153,0.12)] hover:-translate-y-1 relative overflow-hidden">

                {/* Accent shape */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#2B4399]/5 rounded-bl-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-150"></div>

                <div className="relative w-16 h-16 rounded-2xl bg-[#2B4399]/5 flex items-center justify-center text-[#2B4399] group-hover:bg-[#2B4399] group-hover:text-white transition-colors duration-300">
                  {card.icon}
                </div>

                <div className="flex-1 relative z-10">
                  <h3 className="text-[18px] font-bold text-gray-900 group-hover:text-[#2B4399] transition-colors tracking-tight">{card.title}</h3>
                  <p className="text-sm font-semibold text-gray-500 mt-0.5">{card.description}</p>
                </div>

                <div className="relative z-10 w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 group-hover:border-[#2B4399] group-hover:bg-[#2B4399] group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1">
                  <ChevronRight size={20} strokeWidth={3} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
