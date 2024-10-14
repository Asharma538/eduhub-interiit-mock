// src/components/People.tsx

import { Component, createSignal, JSX, onMount } from "solid-js";
import { useParams } from "@solidjs/router";
import { useAxiosContext } from "../lib/useAxiosContext";
import toast from "solid-toast";

interface Member {
  email: string;
  display_name: string;
}

const People = (): JSX.Element => {
  const { id } = useParams();
  const [teachers, setTeachers] = createSignal<Member[]>([]);

  const [students, setStudents] = createSignal<Member[]>([]);

  const [newStudentEmail, setNewStudentEmail] = createSignal("");
  const [newTeacherEmail, setNewTeacherEmail] = createSignal("");
  const [loading, setLoading] = createSignal(true);
  const axios = useAxiosContext();

  const fetchMembers = async () => {
    try {
      const response = await axios!.get(`classes/${id}/members`);
      console.log(response.data);

      setTeachers(response.data.teachers);
      setStudents(response.data.students);
      setLoading(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error fetching members");
      setLoading(false);
    }
  };

  onMount(() => {
    // Uncomment the line below to fetch actual data from the API
    fetchMembers();
  });

  const addStudent = async () => {
    try {
      await axios!.post(`classes/${id}/members/add/student`, {
        studentMail: newStudentEmail(),
      });
      setNewStudentEmail("");
      await fetchMembers();
    } catch (err: any) {
      console.log(err);

      toast.error(err.response?.data?.message || "Error adding student");
    }
  };

  const addTeacher = async () => {
    try {
      await axios!.post(`classes/${id}/members/add/teacher`, {
        teacherMail: newTeacherEmail(),
      });
      setNewTeacherEmail("");
      await fetchMembers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error adding teacher");
    }
  };

  return (
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">Classroom Members</h2>

      <h3 class="text-xl font-semibold mb-2">Teachers</h3>
      <ul class="mb-4">
        {teachers()?.map((teacher) => (
          <li class="mb-2">
            {teacher.display_name} -{" "}
            <span class="text-gray-600">{teacher.email}</span>
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
        <button
          onClick={addTeacher}
          class="bg-blue-600 text-white rounded px-4 py-2"
        >
          Add Teacher
        </button>
      </div>

      <h3 class="text-xl font-semibold mb-2">Students</h3>
      <ul class="mb-4">
        {students()?.map((student) => (
          <li class="mb-2">
            {student.display_name} -{" "}
            <span class="text-gray-600">{student.email}</span>
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
        <button
          onClick={addStudent}
          class="bg-green-600 text-white rounded px-4 py-2"
        >
          Add Student
        </button>
      </div>
    </div>
  );
};

export default People;
