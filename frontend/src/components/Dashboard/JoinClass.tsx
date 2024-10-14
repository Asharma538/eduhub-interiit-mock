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
import toast from "solid-toast";
import { useAxiosContext } from "../../lib/useAxiosContext";

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
  const axios = useAxiosContext();

  const joinClass = async () => {
    axios!
      .post("/join", { code: classId() })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Class joined successfully.Please Refresh");
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Error joining class");
      });
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
