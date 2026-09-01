import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AgGridTable from '@/components/ui/tableaggrid/AgGridTable';
import TableHeader from '@/components/ui/TableHeader';
import { useCustomerList } from '@/hooks/useCustomerApi';
import { getCustomerColumns } from '@/utils/tableColumns';

export default function CustomersPage() {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // Debounce search input (500ms delay) to prevent API calls on every character keypress
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch customer list using common custom hook with debounced search
  const { data: customerRes, isLoading } = useCustomerList({ page, limit, search: debouncedSearch });
  const customers = customerRes?.customerList || [];
  const totalRecords = customerRes?.totalRecords ?? customers.length ?? 0;

  const handleSearchChange = (val: string) => {
    setSearch(val);
  };

  const handlePaginationChanged = (params: any) => {
    if (!params || !params.api) return;
    const newPage = params.api.paginationGetCurrentPage() + 1;
    const newLimit = params.api.paginationGetPageSize();

    if (newLimit !== limit) {
      setLimit(newLimit);
      setPage(1);
    } else if (newPage !== page) {
      setPage(newPage);
    }
  };

  const fullRowData = useMemo(() => {
    if (!totalRecords || totalRecords <= customers.length) return customers;
    const padded = new Array(totalRecords).fill(null).map((_, idx) => ({ id: `placeholder-${idx}` }));
    const startIndex = (page - 1) * limit;
    customers.forEach((cust: any, i: number) => {
      if (startIndex + i < totalRecords) {
        padded[startIndex + i] = cust;
      }
    });
    return padded;
  }, [customers, totalRecords, page, limit]);

  const columnDefs = useMemo(
    () =>
      getCustomerColumns({
        onView: (data: any) => router.push(`/customers/${data?.id}`),
        onEdit: (data: any) => router.push(`/customers/add?id=${data?.id || data?.customer_id}`),
        onDelete: (data: any) => {
          // Handle delete action if needed
        },
      }),
    [router]
  );

  return (
    <div className="bg-[#f8fafc] flex flex-col">
      <Head>
        <title>Customer Management - Insuraa</title>
      </Head>

      <div className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TableHeader
          title="Customer Management"
          subtitle="Manage and view your customer records"
          searchPlaceholder="Search customers..."
          searchValue={search}
          onSearchChange={handleSearchChange}
          buttonText="Add Customer"
          onButtonClick={() => router.push('/customers/add')}
        />

        <div className="w-full">
          <AgGridTable
            rowData={fullRowData}
            columnDefs={columnDefs as any}
            loading={isLoading}
            pagination={true}
            paginationPageSize={limit}
            onPaginationChanged={handlePaginationChanged}
          />
        </div>
      </div>
    </div>
  );
}
