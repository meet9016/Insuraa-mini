import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

interface PageHeaderProps {
  title: string;
  onCancel?: () => void;
  onSubmit?: (e?: any) => void;
  isSubmitting?: boolean;
  submitText?: string;
  submittingText?: string;
  cancelText?: string;
  showBackButton?: boolean;
}

export default function PageHeader({
  title,
  onCancel,
  onSubmit,
  isSubmitting = false,
  submitText = 'Save',
  submittingText = 'Saving...',
  cancelText = 'Cancel',
  showBackButton = true,
}: PageHeaderProps) {
  const router = useRouter();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5 mb-8 pt-6 -mt-6 -mx-6 px-6 rounded-t-xl">
      <div className="flex items-center gap-3 font-bold text-gray-900">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            type="button"
            className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            title="Go Back"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <h1 className="text-xl">{title}</h1>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {cancelText}
        </button>
        {onSubmit && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none bg-[#2B4399] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#203378] transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? submittingText : submitText}
          </button>
        )}
      </div>
    </div>
  );
}
