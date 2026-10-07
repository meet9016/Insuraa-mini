import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import AgGridTable from '@/components/ui/tableaggrid/AgGridTable';
import TableHeader from '@/components/ui/TableHeader';
import { useFetchAiCreditHistory, useFetchAiCredits, useGetAiCreditQuote, usePurchaseAiCredit } from '@/hooks/useAiCreditApi';
import { Monitor, Sparkles, Calculator, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AiCreditHistoryPage() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const { data: historyRes, isLoading } = useFetchAiCreditHistory(page, limit);
  const historyList = historyRes?.data || [];
  const totalRecords = historyRes?.pagination_arr?.total_records ?? historyList.length ?? 0;

  // Buy Credits functionality state
  const { data: aiCreditsData } = useFetchAiCredits();
  const { mutate: getCreditQuote, isPending: isGettingQuote } = useGetAiCreditQuote();
  const { mutate: purchaseCredit, isPending: isPurchasing } = usePurchaseAiCredit();

  const [isCreditQuoteOpen, setIsCreditQuoteOpen] = useState(false);
  const [creditInput, setCreditInput] = useState<number | ''>('');
  const [quoteResult, setQuoteResult] = useState<any>(null);

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
    if (!totalRecords || totalRecords <= historyList.length) return historyList;
    const padded = new Array(totalRecords).fill(null).map((_, idx) => ({ id: `placeholder-${idx}` }));
    const startIndex = (page - 1) * limit;
    historyList.forEach((item: any, i: number) => {
      if (startIndex + i < totalRecords) {
        padded[startIndex + i] = item;
      }
    });
    return padded;
  }, [historyList, totalRecords, page, limit]);

  const columnDefs = useMemo(() => [
    {
      headerName: 'Date & Time',
      field: 'created_at',
      minWidth: 160,
      cellRenderer: (params: any) => {
        if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
        return <span className="text-gray-700 font-medium">{params.value || '-'}</span>;
      },
    },
    {
      headerName: 'Title / Source',
      field: 'title',
      minWidth: 180,
      cellRenderer: (params: any) => {
        if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
        const title = params.data?.title || '-';
        const source = params.data?.source || '-';
        return (
          <div className="flex flex-col justify-center h-full py-1 leading-snug min-w-0 w-full" title={`${title} (${source})`}>
            <span className="font-semibold text-gray-900 text-sm leading-snug truncate block w-full">{title}</span>
            <span className="text-[11px] text-gray-500 truncate block w-full uppercase">{source}</span>
          </div>
        );
      },
    },
    {
      headerName: 'Credits',
      field: 'credits',
      minWidth: 120,
      cellRenderer: (params: any) => {
        if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
        const credits = params.value || 0;
        const type = params.data?.type; // 1 for credit, 2 for debit
        const isAddition = type === 1;
        return (
          <span className={`font-medium px-2 py-1 rounded-md text-xs ${isAddition ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {isAddition ? '+' : '-'}{credits}
          </span>
        );
      },
    },
    {
      headerName: 'Balance After',
      field: 'balance_after',
      minWidth: 130,
      cellRenderer: (params: any) => {
        if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
        return <span className="font-semibold text-[#2B4399]">{params.value || 0}</span>;
      },
    },
    {
      headerName: 'Amount',
      field: 'amount',
      minWidth: 120,
      cellRenderer: (params: any) => {
        if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
        const amt = params.value || 0;
        return <span className="font-medium text-gray-800">₹{amt}</span>;
      },
    },
    {
      headerName: 'Note',
      field: 'note',
      flex: 1,
      minWidth: 200,
      cellRenderer: (params: any) => {
        if (!params.data || params.data.id?.toString().startsWith('placeholder-')) return null;
        return (
          <div className="flex items-center h-full min-w-0 w-full" title={params.value}>
            <span className="text-gray-600 text-xs truncate block w-full">{params.value || '-'}</span>
          </div>
        );
      },
    },
  ], []);

  const handleGetQuote = () => {
    if (!creditInput) return;
    setQuoteResult(null);
    getCreditQuote({ credits: Number(creditInput) }, {
      onSuccess: (res) => {
        if (res && (res.status === 400 || res.status === 500 || res.status === 'error')) {
          toast.error(res?.message || 'Failed to fetch quote');
          return;
        }
        if (res && res.data && Object.keys(res.data).length > 0) {
          setQuoteResult(res.data);
        } else if (res && res.credits) {
          setQuoteResult(res);
        } else {
          toast.error(res?.message || 'Invalid quote response');
        }
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || err?.message || 'Failed to fetch quote');
      }
    });
  };

  const handlePay = () => {
    if (!quoteResult?.credits) return;
    purchaseCredit({ credits: quoteResult.credits }, {
      onSuccess: (res) => {
        if (res && (res.status === 400 || res.status === 500 || res.status === 'error')) {
          toast.error(res?.message || 'Failed to initiate payment');
          return;
        }
        if (res && res.data && res.data.redirect_url) {
          window.location.href = res.data.redirect_url;
        } else {
          toast.error(res?.message || 'No redirect URL found in response');
        }
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || err?.message || 'Failed to initiate payment');
      }
    });
  };

  return (
    <div className="bg-[#f8fafc] flex flex-col h-full">
      <Head>
        <title>AI Credit History - Insuraa</title>
      </Head>

      <div className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TableHeader
          title="AI Credit History"
          subtitle="View your AI credits usage and purchase history"
          showSearch={false}
          extraActions={
            <div className="relative">
              <div
                onClick={() => setIsCreditQuoteOpen(!isCreditQuoteOpen)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[linear-gradient(110deg,#eff6ff,45%,#ffffff,55%,#eff6ff)] bg-[length:200%_100%] animate-[shimmer_2.5s_infinite_linear] rounded-full border border-indigo-200 shadow-[0_0_15px_rgba(47,67,157,0.15)] relative group hover:shadow-[0_0_20px_rgba(47,67,157,0.25)] transition-all cursor-pointer"
              >
                <Monitor className="h-5 w-5 text-[#2F439D] group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm font-extrabold text-[#2F439D]">
                  {aiCreditsData?.balance ?? '...'} left
                </span>
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-tr from-rose-600 to-rose-400 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-lg animate-bounce border border-white">
                  {aiCreditsData?.total_used ?? '...'}
                </span>
              </div>

              {/* Quote Popover */}
              {isCreditQuoteOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(45,53,145,0.3)] border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#2F439D] to-[#2BBF8C] p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="relative z-10 flex items-center gap-2 text-white">
                      <Sparkles size={18} className="animate-[pulse_2s_infinite]" />
                      <h4 className="font-bold text-lg tracking-tight">Buy AI Credits</h4>
                    </div>
                    <p className="relative z-10 text-white/80 text-xs mt-1 font-medium">Power up your workflow with AI</p>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Input Section */}
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Calculator size={16} className="text-[#2F439D]/50 group-focus-within/input:text-[#2F439D] transition-colors" />
                      </div>
                      <input
                        type="number"
                        value={creditInput}
                        onChange={(e) => {
                          setCreditInput(e.target.value ? Number(e.target.value) : '');
                          setQuoteResult(null); // Reset quote when input changes
                        }}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200/80 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F439D]/20 focus:border-[#2F439D] focus:bg-white transition-all shadow-inner"
                        placeholder="Enter credits (e.g. 500)"
                      />
                    </div>

                    {/* Get Quote Button */}
                    <button
                      onClick={handleGetQuote}
                      disabled={isGettingQuote || !creditInput}
                      className="w-full py-2.5 bg-[#2F439D]/5 text-[#2F439D] font-bold rounded-xl text-sm border border-[#2F439D]/10 hover:bg-[#2F439D]/10 hover:border-[#2F439D]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                      {isGettingQuote ? (
                        <><span className="w-4 h-4 border-2 border-[#2F439D]/30 border-t-[#2F439D] rounded-full animate-spin"></span> Fetching...</>
                      ) : (
                        'Calculate Quote'
                      )}
                    </button>

                    {/* Quote Result Summary */}
                    {quoteResult && quoteResult.final_amount !== undefined && (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="p-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl border border-blue-100/50 relative overflow-hidden">
                          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#2F439D]/5 rounded-full blur-xl pointer-events-none"></div>

                          <div className="space-y-2 relative z-10">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-500 font-medium">Credits Requested</span>
                              <span className="font-bold text-gray-800 bg-white px-2 py-0.5 rounded-md shadow-sm">{quoteResult.credits}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-500 font-medium">Price per credit</span>
                              <span className="font-bold text-gray-700">₹{quoteResult.price_per_credit}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-500 font-medium">Subtotal</span>
                              <span className="font-bold text-gray-700">₹{quoteResult.total_price}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-500 font-medium">GST ({quoteResult.gst_percentage}%)</span>
                              <span className="font-bold text-gray-700">₹{quoteResult.gst_amount}</span>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent my-3"></div>

                            <div className="flex justify-between items-end">
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Final Amount</span>
                              <span className="text-xl font-black text-[#2F439D] leading-none">₹{quoteResult.final_amount}</span>
                            </div>
                          </div>
                        </div>

                        {/* Pay Button */}
                        <button
                          onClick={handlePay}
                          disabled={isPurchasing}
                          className="relative w-full py-3.5 mt-3 group overflow-hidden rounded-xl text-white font-bold text-sm shadow-[0_8px_20px_-6px_rgba(46,49,146,0.4)] hover:shadow-[0_12px_25px_-6px_rgba(46,49,146,0.5)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-[#2F439D] via-[#3B54C4] to-[#2BBF8C] transition-transform duration-500 group-hover:scale-105"></div>
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent transition-opacity duration-300"></div>
                          <span className="relative flex items-center justify-center gap-2">
                            {isPurchasing ? (
                              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Processing...</>
                            ) : (
                              <>Proceed to Pay <ExternalLink size={14} className="opacity-70" /></>
                            )}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          }
        />

        <div className="w-full flex-1 min-h-[500px]">
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
