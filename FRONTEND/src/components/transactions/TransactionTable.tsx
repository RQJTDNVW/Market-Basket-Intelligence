import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ExternalLink,
  ShoppingBag,
  Filter,
} from 'lucide-react';
import clsx from 'clsx';
import { TransactionRow } from '../../types';
import { SearchBar } from '../common/SearchBar';

interface TransactionTableProps {
  rows: TransactionRow[];
  totalRows: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  countries: string[];
  sortBy: keyof TransactionRow;
  sortDirection: 'asc' | 'desc';
  onSortChange: (column: keyof TransactionRow) => void;
  onSelectBillNo: (billNo: string) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  rows,
  totalRows,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  searchQuery,
  onSearchChange,
  selectedCountry,
  onCountryChange,
  countries,
  sortBy,
  sortDirection,
  onSortChange,
  onSelectBillNo,
}) => {
  return (
    <div className="space-y-4">
      {/* Controls row: Search + Country filter + Page size */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by Bill No, Product, Customer..."
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Country select */}
          <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#0D141B] px-3 py-2 text-xs text-[#8B98A7]">
            <Filter className="h-3.5 w-3.5" />
            <select
              value={selectedCountry}
              onChange={(e) => onCountryChange(e.target.value)}
              className="bg-transparent text-[#F5F7FA] outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-[#0D141B] text-white">
                All Countries ({countries.length})
              </option>
              {countries.map((c) => (
                <option key={c} value={c} className="bg-[#0D141B] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Page size select */}
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#0D141B] px-2.5 py-2 text-xs text-[#8B98A7]">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-transparent text-[#F5F7FA] font-mono outline-none cursor-pointer text-xs"
            >
              <option value={15} className="bg-[#0D141B]">15</option>
              <option value={25} className="bg-[#0D141B]">25</option>
              <option value={50} className="bg-[#0D141B]">50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#0D141B]/90 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#111A22]/80 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#8B98A7]">
                <th
                  onClick={() => onSortChange('billNo')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Bill No</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => onSortChange('itemname')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Product Description</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => onSortChange('quantity')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Quantity</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => onSortChange('date')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Date</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => onSortChange('price')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Price</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => onSortChange('customerId')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Customer ID</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => onSortChange('country')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Country</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-sans">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="group hover:bg-white/[0.04] transition-colors"
                >
                  {/* Bill No with clickable drawer trigger */}
                  <td className="py-3 px-4 font-mono font-medium">
                    <button
                      onClick={() => onSelectBillNo(row.billNo)}
                      className="inline-flex items-center gap-1 rounded bg-[#35E0B5]/10 border border-[#35E0B5]/30 px-2 py-0.5 text-xs text-[#35E0B5] hover:bg-[#35E0B5]/20 transition-colors"
                      title="Open full basket drawer"
                    >
                      <span>{row.billNo}</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </button>
                  </td>

                  {/* Product */}
                  <td className="py-3 px-4 font-medium text-[#F5F7FA] max-w-[320px] truncate">
                    {row.itemname}
                  </td>

                  {/* Quantity */}
                  <td className="py-3 px-4 text-right font-mono font-semibold text-[#F5F7FA]">
                    {row.quantity}
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 font-mono text-[#8B98A7]">
                    {row.date}
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 text-right font-mono text-[#35E0B5] font-semibold">
                    £{row.price.toFixed(2)}
                  </td>

                  {/* Customer ID */}
                  <td className="py-3 px-4 font-mono text-[#8B98A7]">
                    {row.customerId || 'Guest'}
                  </td>

                  {/* Country */}
                  <td className="py-3 px-4 text-[#8B98A7]">
                    {row.country}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 px-4 py-3 bg-[#111A22]/50 text-xs text-[#8B98A7]">
          <div>
            Showing{' '}
            <span className="font-mono text-[#F5F7FA] font-medium">
              {Math.min((page - 1) * pageSize + 1, totalRows)}
            </span>{' '}
            to{' '}
            <span className="font-mono text-[#F5F7FA] font-medium">
              {Math.min(page * pageSize, totalRows)}
            </span>{' '}
            of{' '}
            <span className="font-mono text-[#F5F7FA] font-medium">
              {totalRows.toLocaleString()}
            </span>{' '}
            rows
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#8B98A7] hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="px-3 py-1 rounded border border-white/10 bg-[#0D141B] text-xs text-[#F5F7FA]">
              Page {page} of {totalPages || 1}
            </span>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#8B98A7] hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

