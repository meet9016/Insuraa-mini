import React, { useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X, ExternalLink, CheckCircle2 } from 'lucide-react';

interface FileUploadProps {
  label?: string | React.ReactNode;
  name: string;
  accept?: string;
  file?: File | null;
  existingUrl?: string | null;
  onChange: (file: File | null) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function FileUpload({
  label,
  name,
  accept = 'image/*,.pdf,.doc,.docx',
  file,
  existingUrl,
  onChange,
  placeholder = 'Click or drag file to upload',
  error,
  className = '',
  disabled = false,
  required = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    onChange(selected);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const fileName = file ? file.name : existingUrl ? (existingUrl.split('/').pop() || 'Uploaded Document') : null;
  const isImage = file?.type.startsWith('image/') || (existingUrl && /\.(jpg|jpeg|png|webp|gif)$/i.test(existingUrl));

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="text-[13px] font-bold text-gray-700 mb-1.5 block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        onClick={() => !disabled && inputRef.current?.click()}
        className={`group relative border-2 border-dashed rounded-xl p-3 flex items-center justify-between transition-all duration-200 cursor-pointer ${
          error
            ? 'border-red-400 bg-red-50/30 hover:bg-red-50/50'
            : fileName
            ? 'border-emerald-400/80 bg-emerald-50/30 hover:bg-emerald-50/50'
            : 'border-gray-300/80 hover:border-[#2B4399] bg-slate-50/60 hover:bg-indigo-50/30'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          disabled={disabled}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
              fileName
                ? 'bg-emerald-100/80 text-emerald-700'
                : 'bg-indigo-50 text-[#2B4399] group-hover:scale-105 group-hover:bg-[#2B4399] group-hover:text-white'
            }`}
          >
            {fileName ? (
              isImage ? <ImageIcon size={18} /> : <FileText size={18} />
            ) : (
              <UploadCloud size={18} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            {fileName ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-800 truncate max-w-[200px]" title={fileName}>
                  {fileName}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    file ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {file ? 'Selected' : 'Uploaded'}
                </span>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold text-gray-600 truncate">{placeholder}</p>
                <p className="text-[10px] text-gray-400 font-medium">Supports PDF, Images & Docs</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          {existingUrl && !file && (
            <a
              href={existingUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg hover:bg-blue-100 text-[#2B4399] transition-colors flex items-center gap-1 text-xs font-bold"
              title="View File"
            >
              <ExternalLink size={14} />
            </a>
          )}
          {file && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
              title="Remove File"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-red-500 font-semibold mt-1">{error}</p>}
    </div>
  );
}
