import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  DialogActions,
  Paper,
} from "@mui/material";

// In your component:
const DialogComponent = ({
  open,
  onClose,
  title,
  children,
  actions,
  anchorEl,
  position,
  className,
}: DialogProps & {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  anchorEl?: HTMLElement | null;
  position?: {
    top: number;
    left: number;
  };
  className?: string;
}) => {
  // get where the anchorEl is in the page and use the paperComponent to render
  const Position = anchorEl ? anchorEl.getBoundingClientRect() : null;
  //   add the top and left to the position
  console.log(Position);
  const anchorPosition = Position
    ? {
        top: Position.top + (position?.top ?? 0),
        left: Position.left - (position?.left ?? 0),
      }
    : null;

  return (
    <Dialog
      open={open}
      slots={{
        paper: (props) => (
          <Paper
            {...props}
            className={className}
            style={{
              position: "absolute",
              top: anchorPosition?.top,
              left: anchorPosition?.left,
              zIndex: 1000,
              width: "fit-content",
            }}
          >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
            {actions && <DialogActions>{actions}</DialogActions>}
          </Paper>
        ),
      }}
      onClose={onClose}
    ></Dialog>
  );
};

export default DialogComponent;
