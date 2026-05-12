import {
  ArrowLeft,
  ArrowRight,
  CaretDown,
  CaretUp,
  FunnelX,
  LockKey,
  MagnifyingGlass,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react";
import React, { useEffect, useState, useMemo } from "react";
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
  }, [data, columns, columnFilters, searchText, sortConfig]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedData.length / rowsPerPage)
  );
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const paginationItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = new Set([1, totalPages, currentPage]);
    for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
      if (page > 1 && page < totalPages) pages.add(page);
    }

    const sortedPages = [...pages].sort((a, b) => a - b);
    return sortedPages.flatMap((page, index) => {
      const previous = sortedPages[index - 1];
      if (index > 0 && page - previous > 1) {
        return [`ellipsis-${previous}-${page}`, page];
      }
      return [page];
    });
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="w-full p-3 md:p-5">
      {/* Global Search */}
      <div className="mb-5 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 shadow-sm border border-slate-200/80">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex items-center w-full sm:w-auto">
              <MagnifyingGlass
                size={20}
                weight="bold"
                className="absolute left-3 text-blue-600"
              />
              <input
                type="text"
                placeholder="Cari di semua kolom..."
                className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 shadow-sm transition-all bg-white text-sm"
                value={searchText}
                onChange={(e) => handleGlobalSearch(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2.5 cursor-pointer text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 whitespace-nowrap transition-all shadow-sm flex items-center gap-2 font-medium text-gray-700"
            >
              <FunnelX size={17} weight="bold" />
              Reset
            </button>
          </div>
          <div className="text-sm font-medium text-gray-700 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            Menampilkan {paginatedData.length} dari {data.length} data
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative rounded-xl border border-gray-200 shadow-md scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100">
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
                  className="px-5 py-3 border-b border-blue-100 min-w-[180px]"
                >
                  <div className="flex flex-col justify-between gap-2">
                    <div
                      className="flex items-center gap-1.5 cursor-pointer text-sm whitespace-nowrap font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => handleSort(column.key)}
                    >
                      {column.header}
                      {sortConfig.key === column.key &&
                        (sortConfig.direction === "asc" ? (
                          <CaretUp size={14} weight="bold" className="text-blue-600" />
                        ) : (
                          <CaretDown size={14} weight="bold" className="text-blue-600" />
                        ))}
                    </div>
                    <input
                      type="text"
                      placeholder={`Filter ${column.header}...`}
                      className="px-3 py-1.5 text-xs border border-blue-100 font-normal focus:ring-2 focus:ring-blue-100 focus:outline-none focus:border-blue-300 rounded-md w-full bg-white/95 text-gray-800 placeholder-gray-400"
                      onChange={(e) =>
                        handleColumnFilter(column.key, e.target.value)
                      }
                      value={columnFilters[column.key] || ""}
                    />
                  </div>
                </th>
              ))}
              {(onEdit || onDelete || onChangePassword) && (
                <th className="px-5 py-3 border-b border-blue-100 min-w-[140px]">
                  <div className="flex items-center justify-center text-sm font-semibold text-gray-700">
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
                className={`transition-colors border-b border-gray-100 last:border-b-0 hover:bg-blue-50/70 ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-5 py-3.5 text-sm text-gray-700 min-w-[180px]"
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                {(onEdit || onDelete || onChangePassword) && (
                  <td className="px-5 py-3.5 min-w-[140px]">
                    <div className="flex gap-2 items-center justify-center">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(row)}
                          className="inline-flex items-center justify-center h-8 w-8 cursor-pointer rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 transition-all"
                          title="Edit"
                        >
                          <PencilSimple size={17} weight="bold" />
                        </button>
                      )}
                      {onChangePassword && (
                        <button
                          type="button"
                          onClick={() => onChangePassword(row)}
                          className="inline-flex items-center justify-center h-8 w-8 cursor-pointer rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-100 transition-all"
                          title="Ubah Password"
                        >
                          <LockKey size={17} weight="bold" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(row)}
                          className="inline-flex items-center justify-center h-8 w-8 cursor-pointer rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 transition-all"
                          title="Delete"
                        >
                          <Trash size={17} weight="bold" />
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
      <div className="mt-5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200/80">
        <div className="flex gap-1.5 items-center overflow-x-auto max-w-full">
          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ArrowLeft size={18} weight="bold" />
          </button>
          {paginationItems.map((item) =>
            typeof item === "string" ? (
              <span
                key={item}
                className="inline-flex h-9 min-w-8 shrink-0 items-center justify-center px-1 text-sm font-semibold text-gray-400"
              >
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                className={`inline-flex h-9 min-w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg px-3 text-sm font-semibold transition-all shadow-sm ${
                  currentPage === item
                    ? "bg-blue-600 text-white border border-blue-600 shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-200"
                }`}
                onClick={() => setCurrentPage(item)}
              >
                {item}
              </button>
            )
          )}
          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ArrowRight size={18} weight="bold" />
          </button>
        </div>
        <div className="text-sm font-medium text-gray-700 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          Halaman {currentPage} dari {totalPages}
        </div>
      </div>
    </div>
  );
};

export default Table;
