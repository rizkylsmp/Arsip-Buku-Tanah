import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { Button, IconButton } from "@radix-ui/themes";
import React, { useState, useMemo } from "react";
import { MoonLoader } from "react-spinners";

const Table = ({
  data,
  columns,
  rowsPerPage = 10,
  loading = false,
  onEdit,
  onDelete,
  onChangePassword,
}) => {
  const [searchText, setSearchText] = useState("");
  const [columnFilters, setColumnFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Handle column filtering
  const handleColumnFilter = (columnKey, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnKey]: value,
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle global search
  const handleGlobalSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Reset all filters, sorting and pagination
  const resetFilters = () => {
    setSearchText("");
    setColumnFilters({});
    setSortConfig({ key: null, direction: "asc" });
    setCurrentPage(1);
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply column filters
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((item) =>
          String(item[key]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    // Apply global search
    if (searchText) {
      result = result.filter((item) =>
        columns.some((col) =>
          String(item[col.key]).toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = String(a[sortConfig.key]);
        const bValue = String(b[sortConfig.key]);
        if (sortConfig.direction === "asc") {
          return aValue.localeCompare(bValue);
        }
        return bValue.localeCompare(aValue);
      });
    }

    return result;
  }, [data, columnFilters, searchText, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="w-full p-3 md:p-5">
      {/* Global Search */}
      <div className="mb-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex items-center w-full sm:w-auto">
              <MagnifyingGlassIcon className="absolute left-3 w-5 h-5 text-blue-600" />
              <input
                type="text"
                placeholder="Cari di semua kolom..."
                className="pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition-all bg-white"
                value={searchText}
                onChange={(e) => handleGlobalSearch(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2.5 text-sm bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 whitespace-nowrap transition-all shadow-sm flex items-center gap-2 font-medium"
            >
              <img
                src="https://www.svgrepo.com/show/340305/filter-reset.svg"
                alt=""
                className="w-4 h-4"
              />
              Reset
            </button>
          </div>
          <div className="text-sm font-medium text-gray-700 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            Menampilkan {paginatedData.length} dari {data.length} data
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative rounded-xl border-2 border-gray-200 shadow-lg scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
        {loading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
            <div className="flex flex-col items-center gap-3 p-10">
              <MoonLoader color="#3b82f6" size={30} />
              <p className="text-sm font-medium text-gray-600">Loading...</p>
            </div>
          </div>
        )}
        <table className="w-full bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 border-b-2 border-blue-200 min-w-[180px]"
                >
                  <div className="flex flex-col justify-between gap-2">
                    <div
                      className="flex items-center cursor-pointer text-sm md:text-base whitespace-nowrap font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => handleSort(column.key)}
                    >
                      {column.header}
                      {sortConfig.key === column.key && (
                        <span className="ml-2 text-blue-600 font-bold">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder={`Filter ${column.header}...`}
                      className="px-3 py-1.5 text-xs border-2 border-blue-300 font-normal focus:ring-2 focus:ring-blue-400 focus:outline-none focus:border-blue-400 rounded-md w-full bg-white/95 text-gray-800 placeholder-gray-500"
                      onChange={(e) =>
                        handleColumnFilter(column.key, e.target.value)
                      }
                      value={columnFilters[column.key] || ""}
                    />
                  </div>
                </th>
              ))}
              {(onEdit || onDelete || onChangePassword) && (
                <th className="px-6 py-4 border-b-2 border-blue-200 min-w-[150px]">
                  <div className="flex items-center justify-center text-sm md:text-base font-semibold text-gray-700">
                    Aksi
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className={`transition-colors border-b border-gray-200 hover:bg-blue-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 text-sm md:text-base text-gray-700 min-w-[180px]"
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                {(onEdit || onDelete || onChangePassword) && (
                  <td className="px-6 py-4 min-w-[150px]">
                    <div className="flex gap-2 items-center justify-center">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(row)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                          title="Edit"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                            <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                          </svg>
                        </button>
                      )}
                      {onChangePassword && (
                        <button
                          type="button"
                          onClick={() => onChangePassword(row)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                          title="Ubah Password"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" />
                          </svg>
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(row)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                          title="Delete"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200">
        <div className="flex gap-2 items-center">
          <IconButton
            className="px-3 py-2 border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100 hover:border-blue-400 transition-all shadow-sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </IconButton>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                className={`px-4 py-2 rounded-lg font-semibold transition-all shadow-sm ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-2 border-blue-500 shadow-md"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <IconButton
            className="px-3 py-2 border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100 hover:border-blue-400 transition-all shadow-sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </IconButton>
        </div>
        <div className="text-sm font-medium text-gray-700 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          Halaman {currentPage} dari {totalPages}
        </div>
      </div>
    </div>
  );
};

export default Table;
