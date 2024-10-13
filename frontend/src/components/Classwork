import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';

const Classwork = () => {
  // Dummy data for topics and assignments (removing quizzes)
  const [topics] = createSignal([
    {
      id: 1,
      title: 'Week 1 - Introduction to React',
      assignments: [
        { id: 1, title: 'Assignment 1: Introduction' },
        // Removed the Quiz
      ],
    },
    {
      id: 2,
      title: 'Week 2 - Advanced React',
      assignments: [
        { id: 2, title: 'Assignment 2: Hooks' },
        // Removed the Quiz
      ],
    }
  ]);

  const navigate = useNavigate();

  const handleAssignmentClick = (assignmentId) => {
    // Navigate to the assignment page with the assignmentId as a parameter
    navigate(`/assignment/${assignmentId}`);
  };

  return (
    <div class="p-6 bg-gray-100 min-h-screen">
      <div class="max-w-4xl mx-auto bg-white shadow-md rounded-lg">
        <div class="p-4 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900">Classwork</h1>
        </div>
        <div class="p-4">
          {topics().map(topic => (
            <div class="mb-4" key={topic.id}>
              <div class="flex items-center justify-between mb-2">
                <h2 class="text-xl font-bold text-gray-800">{topic.title}</h2>
              </div>
              <div class="space-y-2">
                {topic.assignments.map(assignment => (
                  <div
                    class="p-4 bg-gray-50 border rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleAssignmentClick(assignment.id)}
                    key={assignment.id}
                  >
                    <h3 class="text-lg text-gray-700">{assignment.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Classwork;
