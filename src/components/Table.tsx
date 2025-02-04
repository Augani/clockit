"use client";
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import clsx from "clsx";
import React from "react";

interface TableProps {
  columns: Record<string, string>[];
  data: Record<string, any>[];
  className?: string;
  pagination?: boolean;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  onRowClick?: (row: Record<string, any>) => void;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  className,
  pagination,
  page,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
}) => {
  const handleRowClick = React.useCallback(
    (row: Record<string, any>) =>
      (e: React.MouseEvent<HTMLTableRowElement>) => {
        if (onRowClick) {
          e.stopPropagation();
          onRowClick(row);
        }
      },
    [onRowClick]
  );

  return (
    <TableContainer
      className={clsx("bg-surface rounded-lg shadow-none", className)}
    >
      <MuiTable>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index} className="text-primary font-bold">
                {column.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data
            .slice(
              (page || 0) * (rowsPerPage || 10),
              (page || 0) * (rowsPerPage || 10) + (rowsPerPage || 10)
            )
            .map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={handleRowClick(row)}
                className="cursor-pointer"
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>{row[column.key]}</TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
        <TableFooter>
          {pagination && (
            <TableRow>
              <TablePagination
                count={data.length}
                rowsPerPage={rowsPerPage || 10}
                page={page || 0}
                onPageChange={(_, page) => onPageChange?.(page)}
                onRowsPerPageChange={(e) =>
                  onRowsPerPageChange?.(Number(e.target.value))
                }
              />
            </TableRow>
          )}
        </TableFooter>
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
