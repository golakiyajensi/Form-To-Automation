import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

const ActionButtons = ({ item, onView, onEdit, onDelete }) => {
  return (
    <div className="flex gap-2">
      <button
        className="text-blue-600 hover:text-blue-800"
        onClick={() => onView(item)}
      >
        <Eye size={18} />
      </button>
      <button
        className="text-green-600 hover:text-green-800"
        onClick={() => onEdit(item.id)}
      >
        <Pencil size={18} />
      </button>
      <button
        className="text-red-600 hover:text-red-800"
        onClick={() => onDelete(item.id)}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default ActionButtons;
