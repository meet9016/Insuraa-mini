import React, { useRef, useState, useEffect, useMemo } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X, Eye, ExternalLink, FileUp } from 'lucide-react';

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

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

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
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      onChange(droppedFile);
    }
  };

  const fileName = file ? file.name : existingUrl ? (existingUrl.split('/').pop() || 'Uploaded Document') : null;
  const isImage = Boolean(file?.type.startsWith('image/') || (existingUrl && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(existingUrl || '')));

  // Create preview URL for selected file or existing URL
  const previewUrl = useMemo(() => {
    if (file && isImage) {
      return URL.createObjectURL(file);
    }
    return existingUrl || null;
  }, [file, existingUrl, isImage]);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (previewUrl && file) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, file]);

  const handleBoxClick = () => {
    if (disabled) return;
    if (fileName && isImage && previewUrl) {
      setIsPreviewOpen(true);
    } else {
      inputRef.current?.click();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="text-[13px] font-bold text-gray-700 mb-1.5 block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Unique File Upload Card */}
      <div
        onClick={handleBoxClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group relative rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden border-2 ${error
            ? 'border-red-400 bg-red-50/40 ring-2 ring-red-400/20'
            : isDragging
              ? 'border-[#2B4399] bg-[#2B4399]/10 ring-4 ring-[#2B4399]/15 scale-[1.005]'
              : fileName
                ? 'border-emerald-300 bg-gradient-to-r from-emerald-50/60 via-white to-emerald-50/30 hover:border-emerald-500 shadow-2xs'
                : 'border-dashed border-slate-300/90 bg-gradient-to-r from-slate-50/80 via-indigo-50/20 to-slate-50/60 hover:border-[#2B4399] hover:bg-[#2B4399]/[0.02] shadow-2xs'
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

        {fileName ? (
          /* File Selected / Uploaded State with Thumbnail */
          <div className="p-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Image Thumbnail or File Icon */}
              {isImage && previewUrl ? (
                <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-emerald-200 shrink-0 bg-slate-100 group-hover:scale-105 transition-transform shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt={fileName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Eye size={14} />
                  </div>
                </div>
              ) : (
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs font-bold">
                  <FileText size={20} />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-gray-800 truncate" title={fileName}>
                    {fileName}
                  </p>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${file ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                  >
                    {file ? 'Selected' : 'Uploaded'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium mt-0.5">
                  {file?.size ? <span>{formatFileSize(file.size)}</span> : null}
                  {isImage ? (
                    <span className="text-[#2B4399] font-semibold flex items-center gap-1">
                      <Eye size={12} /> Click to view image
                    </span>
                  ) : (
                    <span>Click change button to replace</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
              {/* Replace / Change File Button */}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#2B4399] text-slate-700 hover:text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
                title="Change File"
              >
                <FileUp size={13} />
                <span className="hidden sm:inline">Change</span>
              </button>

              {/* Preview Button */}
              {isImage && previewUrl && (
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="p-1.5 rounded-xl bg-indigo-50 hover:bg-[#2B4399] text-[#2B4399] hover:text-white transition-all shadow-2xs"
                  title="Preview Image"
                >
                  <Eye size={15} />
                </button>
              )}

              {/* External Link */}
              {existingUrl && !file && (
                <a
                  href={existingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white transition-all shadow-2xs"
                  title="Open in new tab"
                >
                  <ExternalLink size={15} />
                </a>
              )}

              {/* Clear / Delete Button */}
              {file && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-xl bg-red-50 hover:bg-red-500 text-red-500 hover:text-white transition-all shadow-2xs"
                  title="Remove File"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Empty State - Unique Modern Card */
          <div className="p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-[#2B4399]/10 text-[#2B4399] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#2B4399] group-hover:text-white transition-all shadow-2xs">
                <UploadCloud size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-700 truncate group-hover:text-[#2B4399] transition-colors">
                  {placeholder}
                </p>
                <p className="text-[11px] text-gray-400 font-medium">
                  Supports PDF, PNG, JPG & Docs (Drag & Drop available)
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-[#2B4399]/10 text-[#2B4399] group-hover:bg-[#2B4399] group-hover:text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5">
                <UploadCloud size={14} />
                <span>Browse</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500 font-semibold mt-1">{error}</p>}

      {/* Image Preview Modal */}
      {isPreviewOpen && previewUrl && (
        <div
          className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2 min-w-0">
                <ImageIcon size={18} className="text-[#2B4399] shrink-0" />
                <span className="text-sm font-bold text-gray-800 truncate">{fileName}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-200/70 hover:bg-red-500 hover:text-white text-gray-600 flex items-center justify-center transition-colors"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body: High Res Image Preview */}
            <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-slate-950/5 min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={fileName || 'Preview'}
                className="max-h-[65vh] max-w-full object-contain rounded-xl shadow-md"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-gray-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                {file?.size ? formatFileSize(file.size) : 'Uploaded Document'}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={previewUrl}
                  target="_blank"
                  download={fileName || 'image'}
                  className="px-3 py-1.5 bg-[#2B4399] hover:bg-[#1e3174] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <ExternalLink size={13} />
                  <span>Open Original</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

