import React from "react";

export function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
}
