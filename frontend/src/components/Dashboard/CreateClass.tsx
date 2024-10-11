import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@suid/material";
import { createSignal } from "solid-js";

// Function to generate random data
const generateRandomClass = () => {
  const classNames = [
    "Math 101",
    "History of Art",
    "Biology Basics",
    "Physics Advanced",
    "Chemistry Experiments",
  ];
  const randomName = classNames[Math.floor(Math.random() * classNames.length)];
  const randomUID = Math.random().toString(36).substring(2, 15);
  return { uid: randomUID, className: randomName };
};

const CreateClass = () => {
  const [open, setOpen] = createSignal(false); // Local state to manage dialog visibility
  const [className, setClassName] = createSignal(""); // State for class name
  const [randomUser, setRandomUser] = createSignal(generateRandomClass()); // Random user data

  const handleClose = () => {
    setOpen(false);
  };

  const createClass = () => {
    console.log("UID:", randomUser().uid);
    console.log("Class Name:", className() || randomUser().className);
    // Logic to store or display the class information
    handleClose(); // Close dialog after creation
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Create Class
      </Button>
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
    </div>
  );
};

export default CreateClass;
