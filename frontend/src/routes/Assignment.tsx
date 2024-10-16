import { createSignal } from "solid-js";
import { TextField, Button } from "@suid/material";
import { useNavigate } from "@solidjs/router";
import toast from "solid-toast";
import { useClassContext } from "../lib/useClassContext";
import { useAxiosContext } from "../lib/useAxiosContext";

interface FormDataToPost {
  title: string;
  description: string;
  deadline: string;
  file_url: string;
}

const Assignment = () => {
  const [formData, setFormData] = createSignal<FormDataToPost>({
    title: "",
    description: "",
    deadline: "",
    file_url: "",
  });

  const validateForm = (): boolean => {
    const { title, description, deadline, file_url } = formData();
    if (
      !title.trim() ||
      !description.trim() ||
      !deadline.trim() ||
      !file_url.trim()
    ) {
      toast.error("All fields must be filled out.");
      return false;
    } // Clear any existing errors
    return true;
  };
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();
  const axios = useAxiosContext();
  const { classDetails } = useClassContext();

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      axios!
        .post(`/classes/${classDetails().classId}/assignments`, formData())
        .then((data) => {
          if (data.status === 201) {
            toast.success("Assignment submitted successfully");
            navigate(`/classwork/`);
          } else {
            toast.error("Failed to submit assignment. Please try again.");
          }
        });
    } catch (err) {
      console.error("Submission failed", err);
      toast.error("Failed to submit assignment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">
        Submit Assignment Details
      </h1>

      {/* File URL Field */}
      <div class="w-full max-w-lg mb-6">
        <TextField
          fullWidth
          label="File URL"
          variant="outlined"
          value={formData().file_url}
          onChange={(e) =>
            setFormData({ ...formData(), file_url: e.target.value })
          }
        />
      </div>

      {/* Title Field */}
      <div class="w-full max-w-lg mb-6">
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          value={formData().title}
          onChange={(e) =>
            setFormData({ ...formData(), title: e.target.value })
          }
        />
      </div>

      {/* Description Field */}
      <div class="w-full max-w-lg mb-6">
        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          multiline
          rows={4}
          value={formData().description}
          onChange={(e) =>
            setFormData({ ...formData(), description: e.target.value })
          }
        />
      </div>

      {/* Deadline Field with Date-Time Picker */}
      <div class="w-full max-w-lg mb-6">
        <TextField
          fullWidth
          label="Deadline"
          variant="outlined"
          type="datetime-local" // Date-time picker
          InputLabelProps={{
            shrink: true, // Keeps label in the correct position
          }}
          value={formData().deadline}
          onChange={(e) =>
            setFormData({ ...formData(), deadline: e.target.value })
          }
        />
      </div>

      {/* Error Handling */}

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading()}
        class={`w-full max-w-lg ${
          loading() ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading() ? "Submitting..." : "Submit Assignment"}
      </Button>
    </div>
  );
};

export default Assignment;
