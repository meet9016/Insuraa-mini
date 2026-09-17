"use client";

import React, { useMemo } from "react";
import { AgGridReact, AgGridProvider } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  RowSelectionModule,
  enableDevValidations,
  // TextFilterModule,
  // NumberFilterModule,
  PaginationModule,
  ColDef,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";

const modules = [
  RowSelectionModule,
  ClientSideRowModelModule,
  // TextFilterModule,
  // NumberFilterModule,
  PaginationModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
];

interface AgGridTableProps<T = any> {
  rowData: T[];
  columnDefs: ColDef<T>[];
  loading?: boolean;
  height?: string | number;
  rowHeight?: number;
  pagination?: boolean;
  paginationPageSize?: number;
  paginationPageSizeSelector?: number[];
  onPaginationChanged?: (event: any) => void;
}

const CustomNoRowsOverlay = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <img
        src="/images/no-data.png"
        alt="No Data Found"
        className="w-72 sm:w-80 h-auto max-w-full object-contain mb-2"
      />
      <h3 className="text-base font-bold text-gray-800">No Data Available</h3>
      <p className="text-xs text-gray-400 mt-1 max-w-xs">There are no records to display at the moment.</p>
    </div>
  );
};

const overlayNoRowsTemplate = `
  <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 16px; text-align:center;">
    <img src="/images/no-data.png" alt="No Data Available" style="width:280px; height:auto; max-width:100%; object-fit:contain; margin-bottom:8px; margin-left:auto; margin-right:auto;" />
    <span style="font-size:16px; font-weight:700; color:#1e293b; display:block;">No Data Available</span>
    <span style="font-size:12px; color:#94A3B8; margin-top:4px; display:block;">There are no records to display at the moment.</span>
  </div>
`;

export default function AgGridTable<T = any>({
  rowData,
  columnDefs,
  loading = false,
  height = "650px",
  rowHeight,
  pagination = true,
  paginationPageSize = 10,
  paginationPageSizeSelector = [10, 25, 50, 100],
  onPaginationChanged,
}: AgGridTableProps<T>) {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(
    () => ({
      height: typeof height === "number" ? `${height}px` : height,
      width: "100%",
    }),
    [height]
  );

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      filter: true,
    };
  }, []);

  const rowSelection = useMemo<any>(() => {
    return {
      mode: "multiRow",
      checkboxes: true,
      headerCheckbox: true,
    };
  }, []);

  const noRowsOverlayComponent = useMemo(() => CustomNoRowsOverlay, []);

  return (
    <AgGridProvider modules={modules}>
      <div style={containerStyle}>
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            theme="legacy"
            rowData={rowData}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection={rowSelection}
            rowHeight={rowHeight}
            pagination={pagination}
            paginationPageSize={paginationPageSize}
            paginationPageSizeSelector={paginationPageSizeSelector}
            onPaginationChanged={onPaginationChanged}
            noRowsOverlayComponent={noRowsOverlayComponent}
            overlayNoRowsTemplate={overlayNoRowsTemplate}
          />
        </div>
      </div>
    </AgGridProvider>
  );
}
