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
}

export default function AgGridTable<T = any>({
  rowData,
  columnDefs,
  loading = false,
}: AgGridTableProps<T>) {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "500px", width: "100%" }), []);

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
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 25, 50, 100]}
          />
        </div>
      </div>
    </AgGridProvider>
  );
}
