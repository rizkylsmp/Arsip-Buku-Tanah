import React from "react";
import { Pencil1Icon, TrashIcon, LockClosedIcon } from "@radix-ui/react-icons";

const Action = ({ onEdit, onDelete, onChangePassword, rowId }) => {
  return (
    <div className="flex gap-2 items-center">
      <button
        type="button"
        onClick={() => onEdit && onEdit(rowId)}
        className="inline-flex items-center justify-center h-7 w-7 rounded bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
        title="Edit"
      >
        <Pencil1Icon className="w-4 h-4" />
      </button>
      {onChangePassword && (
        <button
          type="button"
          onClick={() => onChangePassword(rowId)}
          className="inline-flex items-center justify-center h-7 w-7 rounded bg-yellow-100 hover:bg-yellow-200 text-yellow-600 transition"
          title="Ubah Password"
        >
          <LockClosedIcon className="w-4 h-4" />
        </button>
      )}
      <button
        type="button"
        onClick={() => onDelete && onDelete(rowId)}
        className="inline-flex items-center justify-center h-7 w-7 rounded bg-red-100 hover:bg-red-200 text-red-600 transition"
        title="Delete"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Action;
