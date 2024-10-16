import { createEffect, createSignal, For } from "solid-js";
import { Card, CardContent, Typography, Button } from "@suid/material";
import { useAxiosContext } from "../lib/useAxiosContext";
import { useParams } from "@solidjs/router";
import { useClassContext } from "../lib/useClassContext";
import toast from "solid-toast";

interface Submission {
  student_id: {
    display_name: string;
    email: string;
  };
  submission_date: string;
  file_url: string;
}

const AssignmentSubmissions = () => {
  // Dummy data for submissions
  const [submissions, setSubmissions] = createSignal<Submission[]>([]);
  const axios = useAxiosContext();
  const { assignmentId } = useParams();
  const classContext = useClassContext();

  createEffect(() => {
    axios
      ?.get(
        `/classes/${
          classContext.classDetails().classId
        }/assignments/${assignmentId}/submissions/`
      )
      .then((response) => {
        setSubmissions(response.data.data);
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Error fetching submissions"
        );
      });
  });

  return (
    <div class="p-6 bg-gray-100 min-h-screen">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-semibold mb-4 text-gray-900">
          Assignment Submissions
        </h1>

        {/* List of Submissions */}
        <For each={submissions()} fallback={<p>No submissions found</p>}>
          {(submission) => (
            <Card variant="outlined" class="mb-4">
              <CardContent>
                <Typography variant="h6" component="div" class="mb-2">
                  Submitted by: {submission.student_id.display_name}
                </Typography>
                <Typography color="textSecondary" class="mb-2">
                  Date of Submission: {submission.submission_date}
                </Typography>
                <a
                  href={submission.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outlined" color="primary">
                    View Submission
                  </Button>
                </a>
              </CardContent>
            </Card>
          )}
        </For>
      </div>
    </div>
  );
};

export default AssignmentSubmissions;
