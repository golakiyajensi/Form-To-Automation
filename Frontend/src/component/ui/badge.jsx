import React from "react";

export function Badge({ children, className = "" }) {
  return (
    <span className={`inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 ${className}`}>
      {children}
    </span>
  );
}
