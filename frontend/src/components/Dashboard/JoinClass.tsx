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
  
  // Function to simulate class existence check and joining
  const checkClassExists = async (classId: string) => {
    // Simulated class data
    const simulatedClasses = [
      { id: "class1", name: "Math 101", creatorName: "John Doe", creatorPhoto: "url_to_photo" },
      { id: "class2", name: "History 201", creatorName: "Jane Smith", creatorPhoto: "url_to_photo" },
    ];
  
    return simulatedClasses.find((cls) => cls.id === classId) || null;
  };
  
  const JoinClass = () => {
    const [open, setOpen] = createSignal(false); // Local state for dialog visibility
    const [classId, setClassId] = createSignal(""); // State for class ID
    const [user] = createSignal({ uid: "randomUserUID" }); // Simulated user data
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const joinClass = async () => {
      try {
        // Check if class exists
        const classData = await checkClassExists(classId());
        if (!classData) {
          return alert(`Class doesn't exist, please provide a correct ID.`);
        }
  
        // Simulated user data update (could be saved in local storage or a global state)
        const enrolledClassrooms = [
          // Mock existing classrooms (if any)
          { id: "class3", name: "Biology Basics" },
        ];
        enrolledClassrooms.push({
          creatorName: classData.creatorName,
          creatorPhoto: classData.creatorPhoto,
          id: classId(),
          name: classData.name,
        });
  
        // Alert success
        alert(`Enrolled in ${classData.name} successfully!`);
        handleClose();
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    };
  
    return (
      <div className="joinClass">
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Join Class
        </Button>
        <Dialog open={open()} onClose={handleClose} aria-labelledby="form-dialog-title">
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
      </div>
    );
  };
  
  export default JoinClass;
  