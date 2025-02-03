import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: React.ReactNode;
  options?: {
    label: string;
    value: any;
    color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  }[];
  onClose: () => void;
  onConfirm: (value: any) => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  options = [],
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "rounded-xl",
      }}
    >
      <DialogTitle className="bg-gray-50 px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </DialogTitle>
      <DialogContent className="px-6 py-4">
        <div className="text-gray-600">{message}</div>
      </DialogContent>
      <DialogActions className="px-6 py-4 border-t bg-gray-50 gap-2">
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          className="text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </Button>
        {options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onConfirm(option.value)}
            variant="contained"
            color={option.color || "primary"}
            className={`
              ${
                option.color === "warning"
                  ? "bg-amber-500 hover:bg-amber-600"
                  : option.color === "error"
                    ? "bg-red-500 hover:bg-red-600"
                    : ""
              }
              shadow-sm
            `}
          >
            {option.label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
