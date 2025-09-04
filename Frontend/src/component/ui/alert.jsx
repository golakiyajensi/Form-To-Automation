import React from "react";

export function Alert({ children, className = "", ...props }) {
  return (
    <div
      className={`p-4 border rounded-lg bg-red-100 border-red-400 text-red-700 ${className}`}
      role="alert"
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertTitle({ children }) {
  return <h4 className="font-bold mb-1">{children}</h4>;
}

export function AlertDescription({ children }) {
  return <p className="text-sm">{children}</p>;
}
