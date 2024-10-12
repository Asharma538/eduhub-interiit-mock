import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@suid/material";
import { Accessor, Component, createSignal, Show } from "solid-js";

interface JoinClassProps {
  open: Accessor<boolean>;
  handleClose: () => void;
}

// Function to simulate class existence check and joining

const JoinClass: Component<JoinClassProps> = ({
  open,
  handleClose,
}: JoinClassProps) => {
  // Local state for dialog visibility
  const [classId, setClassId] = createSignal(""); // State for class ID

  const joinClass = async () => {

  };

  return (
    <Show when={open()}>
      <Dialog
        open={open()}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Join Class</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the ID of the class to join the classroom.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Class ID"
            type="text"
            fullWidth
            value={classId()}
            onChange={(e) => setClassId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={joinClass} color="primary">
            Join
          </Button>
        </DialogActions>
      </Dialog>
    </Show>
  );
};

export default JoinClass;
