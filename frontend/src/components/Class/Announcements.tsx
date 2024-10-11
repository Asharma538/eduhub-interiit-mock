import { IconButton } from "@suid/material";
import MoreVertIcon from "@suid/icons-material/MoreVert";
import { Component } from "solid-js";

// Announcement props interface
interface AnnouncementProps {
  image: string;
  name: string;
  date: string;
  content: string;
  authorId: string;
}

// Single announcement display component
const AnnouncementCard: Component<AnnouncementProps> = ({
  image,
  name,
  date,
  content,
  authorId,
}) => {
  return (
    <div class="w-full p-6 border border-gray-300 rounded-lg mb-5">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="rounded-full h-12 w-12 overflow-hidden">
            <img
              src={image}
              alt={`${name}'s profile`}
              class="h-full w-full object-cover"
            />
          </div>
          <div class="ml-3">
            <div class="font-semibold">{name}</div>
            <div class="text-sm text-gray-600 mt-1">{date}</div>
          </div>
        </div>
        <div>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div class="mt-4">{content}</div>
    </div>
  );
};

// Announcement list component
function AnnouncementsList() {
  const announcements = [
    {
      id: 1,
      title: "New Assignment Released",
      description: "Please complete the following assignment by next Monday.",
      date: "2024-10-12",
      authorId: "1",
      name: "John Doe",
      image: "https://via.placeholder.com/150", // Placeholder image URL
      content: "Please review the new assignment posted in the classroom.",
      assignment: {
        title: "Math Assignment 1",
        dueDate: "2024-10-18",
        details: "Solve the problems in Chapter 5 and submit them online.",
        link: "/assignment", // Link to assignment page
      },
    },
    // Add more announcements if necessary
  ];

  return (
    <div class="p-4">
      <h1 class="text-3xl font-bold mb-6">Class Announcements</h1>
      {announcements.map((ann) => (
        <div key={ann.id} class="bg-white shadow-lg rounded-lg p-6 mb-6">
          <AnnouncementCard
            image={ann.image}
            name={ann.name}
            date={ann.date}
            content={ann.content}
            authorId={ann.authorId}
          />
          {/* Assignment Section */}
         
{ann.assignment && (
  <div class="border-t border-gray-200 pt-4 mt-4">
    <h3 class="text-xl font-medium">
      Assignment: {ann.assignment.title}
    </h3>
    <p class="text-gray-500 mb-2">
      <strong>Due Date:</strong> {ann.assignment.dueDate}
    </p>
    <p class="text-gray-500 mb-4">{ann.assignment.details}</p>
    <a
      href={"/assignment/assignment"}
      class="text-blue-500 hover:underline"
    >
      View Assignment
    </a>
  </div>
)}

        </div>
      ))}
    </div>
  );
}

export default AnnouncementsList;
