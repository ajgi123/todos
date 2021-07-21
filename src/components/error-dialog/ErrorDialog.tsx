import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React from "react";

type ErrorDialogPropsType = {
  open: boolean;
  handleClose: () => void;
};

const ErrorDialog = (props: ErrorDialogPropsType) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="error-dialog-title"
      >
        <DialogTitle id="error-dialog-title">Something went wrong</DialogTitle>
        <DialogContent>
          <DialogContentText>You will be log out.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ErrorDialog;
