// components/Pagination.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange, className }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center gap-3 text-sm ${className || ""}`}>
      <div>
        Showing <span className="font-semibold">{startIndex}</span> to <span className="font-semibold">{endIndex}</span> of <span className="font-semibold">{totalItems}</span> entries
      </div>

      <div className="flex items-center gap-4">
        <select
          value={itemsPerPage}
          onChange={(e) => { onItemsPerPageChange(Number(e.target.value)); }}
          className="border border-gray-300 rounded-lg px-2 py-1"
        >
          {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 rounded border border-gray-300 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1 rounded border border-gray-300 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
