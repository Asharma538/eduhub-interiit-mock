import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";

const Assignment = () => {
  const [textResponse, setTextResponse] = createSignal("");
  const [uploadedFiles, setUploadedFiles] = createSignal<File[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal(null);
  const navigate = useNavigate();

  // Handle file selection via file input
  const handleFileInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      setUploadedFiles([...uploadedFiles(), ...Array.from(target.files)]);
    }
  };

  // Handle drag-and-drop file upload
  const handleFileDrop = (e: DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files) {
      setUploadedFiles([...uploadedFiles(), ...Array.from(files)]);
    }
  };

  // Handle text input
  const handleTextInputChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    setTextResponse(target.value);
  };

  // Handle assignment submission (no backend interaction)
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Just a simulated delay for UX purposes
      setTimeout(() => {
        alert("Assignment submitted successfully!");
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Submission failed", err);
      setError("Failed to submit assignment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Submit Assignment</h1>

      {/* Text Response Section */}
      <div class="w-full max-w-lg mb-8">
        <label class="block text-lg font-semibold mb-2 text-gray-700">Write Your Response</label>
        <textarea
          class="w-full p-4 border border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={5}
          value={textResponse()}
          onInput={handleTextInputChange}
          placeholder="Type your response here..."
        />
      </div>

      {/* File Upload Section */}
      <div
        class="file-upload w-full max-w-lg p-8 border-4 border-dashed border-gray-400 rounded-lg mb-6 bg-white"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
      >
        <label class="block text-lg font-semibold mb-2 text-gray-700">Upload Files</label>
        <input
          type="file"
          multiple
          class="w-full p-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer mb-4"
          onChange={handleFileInputChange}
        />
        <p class="text-sm text-gray-500">Drag and drop files here or click to upload.</p>

        {/* Display uploaded files */}
        <ul class="mt-4 space-y-1">
          {uploadedFiles().map((file) => (
            <li class="text-sm text-gray-600">{file.name}</li>
          ))}
        </ul>
      </div>

      {/* Error Handling */}
      {error() && <p class="text-red-500 mb-4">{error()}</p>}

      {/* Submit Button */}
      <button
        class={`px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          loading() ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={handleSubmit}
        disabled={loading()}
      >
        {loading() ? "Submitting..." : "Submit Assignment"}
      </button>
    </div>
  );
};

export default Assignment;
