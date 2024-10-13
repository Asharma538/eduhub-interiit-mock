// src/components/People.tsx

import { createSignal, onMount } from "solid-js";
import axios from "axios";

interface Member {
  email: string;
  display_name: string;
}

interface PeopleProps {
  classId: string;
}

const People = (props: PeopleProps): JSX.Element => {
  const [teachers, setTeachers] = createSignal<Member[]>([
    { email: "teacher1@example.com", display_name: "Teacher One" },
    { email: "teacher2@example.com", display_name: "Teacher Two" },
  ]);
  
  const [students, setStudents] = createSignal<Member[]>([
    { email: "student1@example.com", display_name: "Student One" },
    { email: "student2@example.com", display_name: "Student Two" },
  ]);
  
  const [newStudentEmail, setNewStudentEmail] = createSignal("");
  const [newTeacherEmail, setNewTeacherEmail] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(true);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`/api/classrooms/${props.classId}/members`);
      setTeachers(response.data.teachers);
      setStudents(response.data.students);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching members");
      setLoading(false);
    }
  };

  onMount(() => {
    // Uncomment the line below to fetch actual data from the API
    // fetchMembers();
  });

  const addStudent = async () => {
    try {
      await axios.post(`/api/classrooms/${props.classId}/students`, { studentMail: newStudentEmail() });
      setNewStudentEmail("");
      await fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || "Error adding student");
    }
  };

  const addTeacher = async () => {
    try {
      await axios.post(`/api/classrooms/${props.classId}/teachers`, { teacherMail: newTeacherEmail() });
      setNewTeacherEmail("");
      await fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || "Error adding teacher");
    }
  };

  return (
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">Classroom Members</h2>
      {error() && <div class="text-red-600 mb-4">{error()}</div>}

      <h3 class="text-xl font-semibold mb-2">Teachers</h3>
      <ul class="mb-4">
        {teachers().map((teacher) => (
          <li key={teacher.email} class="mb-2">
            {teacher.display_name} - <span class="text-gray-600">{teacher.email}</span>
          </li>
        ))}
      </ul>
      <div class="flex mb-4">
        <input
          type="email"
          value={newTeacherEmail()}
          onInput={(e) => setNewTeacherEmail(e.currentTarget.value)}
          placeholder="Add teacher by email"
          class="border border-gray-300 rounded px-4 py-2 mr-2 flex-grow"
        />
        <button onClick={addTeacher} class="bg-blue-600 text-white rounded px-4 py-2">Add Teacher</button>
      </div>

      <h3 class="text-xl font-semibold mb-2">Students</h3>
      <ul class="mb-4">
        {students().map((student) => (
          <li key={student.email} class="mb-2">
            {student.display_name} - <span class="text-gray-600">{student.email}</span>
          </li>
        ))}
      </ul>
      <div class="flex">
        <input
          type="email"
          value={newStudentEmail()}
          onInput={(e) => setNewStudentEmail(e.currentTarget.value)}
          placeholder="Add student by email"
          class="border border-gray-300 rounded px-4 py-2 mr-2 flex-grow"
        />
        <button onClick={addStudent} class="bg-green-600 text-white rounded px-4 py-2">Add Student</button>
      </div>
    </div>
  );
};

export default People;
