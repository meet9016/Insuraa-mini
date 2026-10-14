import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Info } from 'lucide-react';

export interface SkippedRecordItem {
  id?: string | number;
  name?: string;
  reason?: string;
}

export interface SkippedModalData {
  title?: string;
  message?: string;
  skipped: SkippedRecordItem[];
}

const EVENT_NAME = 'SHOW_SKIPPED_RECORDS_MODAL';

let lastShownTime = 0;
let lastShownJson = '';

export const showSkippedRecordsModal = (data: SkippedModalData) => {
  if (typeof window !== 'undefined') {
    if (!data || !Array.isArray(data.skipped) || data.skipped.length === 0) return;
    const json = JSON.stringify(data.skipped || []);
    const now = Date.now();
    // Prevent duplicate triggers within 500ms
    if (now - lastShownTime < 500 && lastShownJson === json) {
      return;
    }
    lastShownTime = now;
    lastShownJson = json;
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: data }));
  }
};

export default function SkippedRecordsModal({
  isOpen: propIsOpen,
  onClose: propOnClose,
  data: propData,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  data?: SkippedModalData | null;
} = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [modalData, setModalData] = useState<SkippedModalData | null>(null);

  useEffect(() => {
    const handleEvent = (e: any) => {
      const detail = e.detail as SkippedModalData;
      if (detail && Array.isArray(detail.skipped) && detail.skipped.length > 0) {
        setModalData(detail);
        setInternalIsOpen(true);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(EVENT_NAME, handleEvent);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(EVENT_NAME, handleEvent);
      }
    };
  }, []);

  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;
  const currentData = propData || modalData;

  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  if (!isOpen || !currentData || !currentData.skipped || currentData.skipped.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#2B4399] px-6 py-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} className="text-amber-300" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">
                {currentData.title || 'Records Cannot Be Deleted'}
              </h2>
              <p className="text-xs text-white/80 mt-0.5">
                {currentData.skipped.length} record{currentData.skipped.length > 1 ? 's' : ''} could not be deleted
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Message banner */}
        {currentData.message && (
          <div className="px-6 pt-4 pb-1 shrink-0">
            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2.5">
              <Info size={17} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed font-medium">
                {currentData.message}
              </div>
            </div>
          </div>
        )}

        {/* Body content with table of skipped items */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Skipped Details
          </div>
          <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 bg-white shadow-sm">
            <div className="bg-gray-50 px-4 py-2.5 grid grid-cols-12 text-xs font-bold text-gray-600">
              <div className="col-span-5">Name</div>
              <div className="col-span-7">Reason</div>
            </div>
            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
              {currentData.skipped.map((item, idx) => (
                <div
                  key={item?.id ?? idx}
                  className="px-4 py-3 grid grid-cols-12 items-start gap-2 text-xs hover:bg-gray-50/70 transition-colors"
                >
                  <div className="col-span-5 font-semibold text-gray-900 break-words flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    <span className="leading-tight">{item?.name || `ID: ${item?.id}`}</span>

                  </div>
                  <div className="col-span-7 text-rose-600 font-medium break-words bg-rose-50/70 px-2.5 py-1.5 rounded-lg border border-rose-100/80 leading-normal">
                    {item?.reason || 'Record is in use and cannot be deleted'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with ONLY Cancel button as requested */}
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex justify-end shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 border border-[#2B4399] rounded-md font-semibold text-sm text-[#2B4399] hover:bg-gray-100 transition-colors shadow-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
