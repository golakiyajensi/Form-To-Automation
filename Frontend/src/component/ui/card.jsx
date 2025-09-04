// import React from "react";

// export function Card({ children, className = "" }) {
//   return <div className={`rounded-lg border shadow p-4 ${className}`}>{children}</div>;
// }

// export function CardHeader({ children, className = "" }) {
//   return <div className={`mb-2 ${className}`}>{children}</div>;
// }

// export function CardTitle({ children, className = "" }) {
//   return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
// }

// export function CardContent({ children, className = "" }) {
//   return <div className={className}>{children}</div>;
// }


// src/component/ui/card.jsx
import * as React from "react";

const Card = ({ className = "", ...props }) => (
  <div className={`rounded-xl border bg-white shadow ${className}`} {...props} />
);

const CardHeader = ({ className = "", ...props }) => (
  <div className={`border-b p-4 ${className}`} {...props} />
);

const CardTitle = ({ className = "", ...props }) => (
  <h3 className={`font-semibold leading-none tracking-tight ${className}`} {...props} />
);

const CardDescription = ({ className = "", ...props }) => (
  <p className={`text-sm text-gray-500 ${className}`} {...props} />
);

const CardContent = ({ className = "", ...props }) => (
  <div className={`p-4 ${className}`} {...props} />
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
