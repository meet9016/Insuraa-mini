import React from 'react';
import { Trash2, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemName?: string;
  description?: string;
  isDeleting?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  itemName,
  description,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !isDeleting && onClose()}
      ></div>
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
        {/* Header */}
        <div className="bg-[#2B4399] px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2.5">
            <Trash2 size={20} className="text-white" />
            <h2 className="font-bold text-base">{title}</h2>
          </div>
          <button
            onClick={() => !isDeleting && onClose()}
            disabled={isDeleting}
            className="hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <div className="w-14 h-14 bg-[#2B4399]/10 text-[#2B4399] rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Are you sure?</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {description || (
              <>
                Are you sure you want to delete{' '}
                {itemName ? <span className="font-semibold text-gray-900">{itemName}</span> : 'this item'}?
                This action cannot be undone.
              </>
            )}
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2 border border-gray-300 rounded-md font-semibold text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2 bg-[#2B4399] hover:bg-[#203378] text-white rounded-md font-semibold text-sm transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
