import React from "react";
import { LockKey, PencilSimple, Trash } from "@phosphor-icons/react";

const Action = ({ onEdit, onDelete, onChangePassword, rowId }) => {
  return (
    <div className="flex gap-2 items-center">
      <button
        type="button"
        onClick={() => onEdit && onEdit(rowId)}
        className="inline-flex items-center justify-center h-7 w-7 cursor-pointer rounded bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
        title="Edit"
      >
        <PencilSimple size={16} weight="bold" />
      </button>
      {onChangePassword && (
        <button
          type="button"
          onClick={() => onChangePassword(rowId)}
          className="inline-flex items-center justify-center h-7 w-7 cursor-pointer rounded bg-yellow-100 hover:bg-yellow-200 text-yellow-600 transition"
          title="Ubah Password"
        >
          <LockKey size={16} weight="bold" />
        </button>
      )}
      <button
        type="button"
        onClick={() => onDelete && onDelete(rowId)}
        className="inline-flex items-center justify-center h-7 w-7 cursor-pointer rounded bg-red-100 hover:bg-red-200 text-red-600 transition"
        title="Delete"
      >
        <Trash size={16} weight="bold" />
      </button>
    </div>
  );
};

export default Action;
