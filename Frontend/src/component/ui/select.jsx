import React, { useState } from "react";

export function Select({ children }) {
  return <div className="relative inline-block w-full">{children}</div>;
}

export function SelectTrigger({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-3 py-2 border rounded-lg text-left bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </button>
  );
}

export function SelectContent({ open, children }) {
  if (!open) return null;
  return (
    <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-10">
      {children}
    </div>
  );
}

export function SelectItem({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
    >
      {children}
    </div>
  );
}

export function SelectValue({ placeholder, value }) {
  return <span>{value || placeholder}</span>;
}
