import React from 'react';

interface ActionButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitText?: string;
  submittingText?: string;
  cancelText?: string;
}

export default function ActionButtons({
  onCancel,
  onSubmit,
  isSubmitting = false,
  submitText = 'Save',
  submittingText = 'Saving...',
  cancelText = 'Cancel',
}: ActionButtonsProps) {
  return (
    <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex justify-end gap-3">
      <button
        onClick={onCancel}
        type="button"
        className="px-5 py-2 border border-[#2B4399] rounded-md font-semibold text-sm text-[#2B4399] hover:bg-gray-100 transition-colors"
      >
        {cancelText}     
      </button>
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        type="button"
        className="bg-[#2B4399] hover:bg-[#203378] text-white px-6 py-2 rounded-md text-sm transition-colors disabled:opacity-50"
      >
        {isSubmitting ? submittingText : submitText}
      </button>
    </div>
  );
}
