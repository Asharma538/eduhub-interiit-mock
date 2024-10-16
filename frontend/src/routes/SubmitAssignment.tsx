import { createSignal } from "solid-js";
import { Button, TextField } from "@suid/material";
import toast from "solid-toast";
import { useAxiosContext } from "../lib/useAxiosContext";
import { useClassContext } from "../lib/useClassContext";
import { useNavigate, useParams } from "@solidjs/router";

const FileSubmission = () => {
  const [fileUrl, setFileUrl] = createSignal("");
  const axios = useAxiosContext();
  const classContext = useClassContext();
  const navigate = useNavigate()
  const {assignmentId}  = useParams()

  const handleSubmit = () => {
    if (!fileUrl()) {
      toast.error("File URL is required.");
      return;
    }

    axios
      ?.post(`/classes/${classContext.classDetails().classId}/assignments/${assignmentId}`, {
        file_url: fileUrl(),
      })
      .then(() => {
        toast.success("File submitted successfully!");
        navigate("/classwork")
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Error submitting the file"
        );
      });
  };

  return (
    <div class="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div class="max-w-lg w-full bg-white shadow-md rounded-lg p-8">
        <h1 class="text-2xl font-semibold text-gray-900 mb-4">
          Submit Assignment
        </h1>
        <div class="mb-4">
          <TextField
            label="File URL"
            variant="outlined"
            fullWidth
            value={fileUrl()}
            onChange={(e) => setFileUrl(e.target.value)}
          />
        </div>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default FileSubmission;