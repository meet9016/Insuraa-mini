import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FileEdit, Trash2, Eye, Plus, User, Search } from 'lucide-react';
import AgGridTable from '@/components/ui/AgGridTable';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';

export default function CustomerList() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      let resData;
      try {
        const response = await api.get(endPointApi.CUSTOMER.CUSTOMER_LIST, {
          params: { page, limit, search }
        });
        resData = response.data;
      } catch (err) {
        const formData = new FormData();
        formData.append('page', String(page));
        formData.append('limit', String(limit));
        formData.append('search', search);
        const response = await api.post(endPointApi.CUSTOMER.CUSTOMER_LIST, formData);
        resData = response.data;
      }
      const list = resData?.data?.customer_list || resData?.data?.list || resData?.data || resData?.customer_list || [];
      setCustomers(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Failed to fetch customer list:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, limit, search]);

  const columnDefs = useMemo(() => [
    {
      headerName: "Customer Name",
      field: "name",
      minWidth: 200,
      cellRenderer: (params: any) => {
        const name = params.data?.name || params.data?.full_name || `${params.data?.first_name || ''} ${params.data?.last_name || ''}`.trim() || params.value || '-';
        return (
          <div className="font-bold text-gray-900 flex items-center gap-2">
            <span>{name}</span>
          </div>
        );
      },
    },
    {
      headerName: "Group Code",
      field: "group_code",
      minWidth: 140,
      cellRenderer: (params: any) => (
        <span className="text-gray-700 font-medium">
          {params.data?.group_code || params.data?.groupCode || params.value || '-'}
        </span>
      ),
    },
    {
      headerName: "Mobile Number",
      field: "customer_number",
      minWidth: 150,
      cellRenderer: (params: any) => (
        <span className="text-gray-700 font-medium">
          {params.data?.customer_number || params.data?.number || params.data?.phone || params.value || '-'}
        </span>
      ),
    },
    {
      headerName: "Email",
      field: "email",
      minWidth: 180,
      cellRenderer: (params: any) => (
        <span className="text-gray-700 font-medium">{params.value || '-'}</span>
      ),
    },
    {
      headerName: "Type",
      field: "customer_type",
      minWidth: 130,
      cellRenderer: (params: any) => {
        const typeVal = params.data?.customer_type_name || params.data?.type || params.value || 'Individual';
        return (
          <span className="bg-[#e7f0fa] text-[#2F439D] font-medium text-xs px-2.5 py-1 rounded-full">
            {typeVal}
          </span>
        );
      },
    },
    {
      headerName: "Action",
      field: "id",
      minWidth: 140,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-1.5 h-full py-1">
          <button
            onClick={() => router.push(`/customers/${params.data?.id}`)}
            className="p-1.5 bg-[#0ea5e9] text-white rounded hover:bg-[#0284c7] transition-colors"
            title="View"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => router.push(`/customers/add?id=${params.data?.id || params.data?.customer_id}`)}
            className="p-1.5 bg-[#10b981] text-white rounded hover:bg-[#059669] transition-colors"
            title="Edit"
          >
            <FileEdit size={14} />
          </button>
          <button
            className="p-1.5 bg-[#f43f5e] text-white rounded hover:bg-[#e11d48] transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ], [router]);

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-72px-56px)]">
      <Head>
        <title>Customer Management - Insuraa</title>
      </Head>

      <div className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 sm:p-6 border-b border-gray-200 bg-[#F2F7FF]">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Customer Management</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage and view your customer records
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-[240px] pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D3591]/20 focus:border-[#2D3591] transition-all"
              />
            </div>
            <button
              type="button"
              onClick={() => router.push('/customers/add')}
              className="px-5 py-2.5 bg-[#2B4399] text-white text-sm font-bold rounded-xl shadow-md transition-all hover:bg-[#203378] flex items-center gap-1.5 whitespace-nowrap"
            >
              <Plus size={16} />
              <span>Add Customer</span>
            </button>
          </div>
        </div>

        <div className="w-full">
          <AgGridTable rowData={customers} columnDefs={columnDefs as any} loading={loading} />
        </div>
      </div>
    </div>
  );
}
