"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";

import {
  ClientSideRowModelModule,
  NumberFilterModule,
  TextFilterModule,
  RowSelectionModule,
  ModuleRegistry,
  ColDef,
  GridReadyEvent,
  GridApi,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ExcelExportModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { Search, Download, Plus } from "lucide-react";

const gridModules = [
  RowSelectionModule,
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  ExcelExportModule,
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
];

// Register AG Grid modules once globally
ModuleRegistry.registerModules(gridModules);

export interface AgGridTableProps<T = any> {
  rowData: T[];
  columnDefs: ColDef<T>[];
  title?: string;
  subtitle?: string;
  addLabel?: string;
  onAdd?: () => void;
  enableExport?: boolean;
  enableSearch?: boolean;
  theme?: string;
  height?: string;
  paginationPageSize?: number;
}

export default function AgGridTable<T = any>({
  rowData,
  columnDefs,
  title = "Data Table",
  subtitle,
  addLabel = "Add New",
  onAdd,
  enableExport = true,
  enableSearch = true,
  theme = "ag-theme-alpine",
  height = "520px",
  paginationPageSize = 10,
}: AgGridTableProps<T>) {
  const gridRef = useRef<AgGridReact<T>>(null);
  const [gridApi, setGridApi] = useState<GridApi<T> | null>(null);
  const [quickFilterText, setQuickFilterText] = useState("");

  const defaultColDef = useMemo<ColDef<T>>(() => {
    return {
      filter: true,
      sortable: true,
      resizable: true,
      minWidth: 120,
      flex: 1,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent<T>) => {
    setGridApi(params.api);
  }, []);

  const handleExportExcel = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.exportDataAsExcel({
        fileName: `${title.toLowerCase().replace(/\s+/g, "_")}_export.xlsx`,
      });
    }
  }, [title]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuickFilterText(value);
    if (gridApi) {
      gridApi.setGridOption("quickFilterText", value);
    }
  };

  const popupParent = useMemo(() => {
    if (typeof document !== "undefined") {
      return document.body;
    }
    return undefined;
  }, []);

  return (
    <div className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden flex flex-col">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 sm:p-6 border-b border-gray-200 bg-white">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {subtitle || `Manage and view your ${title.toLowerCase()} records`}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          {enableSearch && (
            <div className="relative flex-1 sm:flex-none sm:min-w-[260px] group">
              <input
                type="text"
                value={quickFilterText}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#2D3591]/20 focus:border-[#2D3591] group-hover:border-gray-300"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 transition-colors group-focus-within:text-[#2F439D]" />
            </div>
          )}

          {enableExport && (
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Download size={16} />
              <span>Export Excel</span>
            </button>
          )}

          {onAdd && (
            <button
              type="button"
              onClick={onAdd}
              className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-md shadow-blue-900/20 transition-all hover:-translate-y-0.5 whitespace-nowrap flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span>{addLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* AG Grid Table Container */}
      <div className="w-full p-4">
        <div className={`${theme} w-full rounded-xl overflow-hidden`} style={{ height }}>
          <AgGridReact<T>
            ref={gridRef}
            modules={gridModules}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowHeight={52}
            headerHeight={46}
            popupParent={popupParent}
            pagination={true}
            paginationPageSize={paginationPageSize}
            paginationPageSizeSelector={[10, 25, 50, 100]}
            onGridReady={onGridReady}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            animateRows={true}
          />
        </div>
      </div>
    </div>
  );
}
