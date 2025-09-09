import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

const ActionButtons = ({
  onView,
  onEdit,
  onDelete,
  showLabels = false,
  variant = "default", // "default" | "underline"
}) => {
  const baseClass = "flex items-center space-x-1 text-sm";

  const styles = {
    default: {
      view: "text-blue-600 hover:text-blue-800 cursor-pointer",
      edit: "text-green-600 hover:text-green-800 cursor-pointer",
      delete: "text-red-600 hover:text-red-800 cursor-pointer",
    },
    underline: {
      view: "text-blue-500 hover:underline cursor-pointer",
      edit: "text-green-500 hover:underline cursor-pointer",
      delete: "text-red-500 hover:underline cursor-pointer",
    },
  };

  return (
    <div className="flex space-x-3 mt-2 text-sm">
      {onView && (
        <button className={`${baseClass} ${styles[variant].view}`} onClick={onView}>
          <Eye className="w-4 h-4" />
          {showLabels && <span>View</span>}
        </button>
      )}
      {onEdit && (
        <button className={`${baseClass} ${styles[variant].edit}`} onClick={onEdit}>
          <Pencil className="w-4 h-4" />
          {showLabels && <span>Edit</span>}
        </button>
      )}
      {onDelete && (
        <button className={`${baseClass} ${styles[variant].delete}`} onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
          {showLabels && <span>Delete</span>}
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
