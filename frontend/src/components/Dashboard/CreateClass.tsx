import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@suid/material";
import { Accessor, Component, createSignal, Show, Signal } from "solid-js";
import { useAxiosContext } from "../../lib/useAxiosContext";
import { nanoid } from "nanoid";
import toast from "solid-toast";

interface CreateClassProps {
  open: Accessor<boolean>;
  handleClose: () => void;
}
// Function to generate random data

const CreateClass: Component<CreateClassProps> = ({ open, handleClose }) => {
  // Local state to manage dialog visibility
  const [className, setClassName] = createSignal(""); // State for class name
  const [classDetails, setClassDetails] = createSignal(""); // Random user data
  const axios = useAxiosContext();

  const createClass = () => {
    axios!
      .post("/create", {
        name: className(),
        details: classDetails(),
      })
      .then((data) => {
        if (data.status === 201) {
          toast.success("Class created successfully");
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Error creating class");
      });
    handleClose(); // Close dialog after creation
  };

  return (
    <Show when={open}>
      <Dialog
        open={open()}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Class</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name of the class, and we will create a classroom for you!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Class Name"
            type="text"
            fullWidth
            value={className()}
            onChange={(e) => setClassName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Class Details"
            type="text"
            fullWidth
            value={classDetails()}
            onChange={(e) => setClassDetails(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={createClass} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Show>
  );
};

export default CreateClass;
