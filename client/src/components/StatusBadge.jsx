import React from "react";

const StatusBadge = ({ status }) => {
  const color = {
    Pending: "bg-yellow-200 text-yellow-800",
    Accepted: "bg-blue-200 text-blue-800",
    Rejected: "bg-red-200 text-red-800",
    Completed: "bg-green-200 text-green-800",
  }[status] || "bg-gray-200 text-gray-800";

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{status}</span>
  );
};

export default StatusBadge;
