import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { Button, IconButton } from "@radix-ui/themes";
import React, { useState, useMemo } from "react";

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
    <div className="w-full p-5">
      {/* Global Search */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <MagnifyingGlassIcon className="absolute left-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search all columns..."
              className="pl-9 pr-3 py-2 border border-abu rounded w-64 focus:outline-none  focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchText}
              onChange={(e) => handleGlobalSearch(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="px-3 py-2 text-sm bg-abu rounded hover:bg-gray-100"
          >
            Reset
          </button>
        </div>
        <div className="text-sm text-gray-600">
          Showing {paginatedData.length} of {data.length} entries
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        <table className="min-w-full bg-white border border-abu">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-3 border-b border-abu">
                  <div className="flex flex-col justify-between">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort(column.key)}
                    >
                      {column.header}
                      {sortConfig.key === column.key && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder={`Seacrh ${column.header}`}
                      className="mt-2 px-2 py-1 text-xs border font-extralight focus:ring-0 focus:outline-none border-abu rounded w-full"
                      onChange={(e) =>
                        handleColumnFilter(column.key, e.target.value)
                      }
                      value={columnFilters[column.key] || ""}
                    />
                  </div>
                </th>
              ))}
              {(onEdit || onDelete || onChangePassword) && (
                <th className="px-6 py-3 border-b border-abu">
                  <div className="flex items-center justify-center">Action</div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 border-b border-abu"
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                {(onEdit || onDelete || onChangePassword) && (
                  <td className="px-6 py-4 border-b border-abu">
                    <div className="flex gap-2 items-center justify-center">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(row)}
                          className="inline-flex items-center justify-center h-7 w-7 rounded bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
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
                          className="inline-flex items-center justify-center h-7 w-7 rounded bg-yellow-100 hover:bg-yellow-200 text-yellow-600 transition"
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
                          className="inline-flex items-center justify-center h-7 w-7 rounded bg-red-100 hover:bg-red-200 text-red-600 transition"
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
      <div className="mt-4 flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <IconButton
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon />
          </IconButton>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                className={`px-3 py-1 border rounded ${
                  currentPage === page ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <IconButton
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            {" "}
            <ChevronRightIcon />
          </IconButton>
        </div>
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    </div>
  );
};

export default Table;
