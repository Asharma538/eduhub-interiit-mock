import { createSignal, For, createEffect } from "solid-js";
import { IconButton } from "@suid/material";
import SendOutlinedIcon from "@suid/icons-material/SendOutlined";
import moment from "moment";
import { A, useParams } from "@solidjs/router";
import { useAxiosContext } from "../lib/useAxiosContext";
import toast from "solid-toast";

function Class() {
  const axios = useAxiosContext();
  const { classId } = useParams(); // Get classId from URL parameters
  const [className, setClassName] = createSignal("Loading...");
  const [announcementContent, setAnnouncementContent] = createSignal("");
  const [posts, setPosts] = createSignal([]);

  const user = {
    uid: "user123", // Replace with actual user ID fetching logic
    photoURL: "https://via.placeholder.com/50",
    displayName: "My Name",
  };

  // Function to fetch class details and announcements from the backend
  const fetchClassDetails = async () => {
    try {
      const response = await axios!.get(`/classes/${classId}`);
      setClassName(response.data.data.classroom.name || "No Class Name Available");
      setPosts(response.data.data.announcements || []); // Set posts from announcements
    } catch (error) {
      console.error("Error fetching class details:", error);
      toast.error("Failed to fetch class details");
    }
  };

  // Call fetchClassDetails when the component mounts or after an update
  createEffect(() => {
    fetchClassDetails();
  });

  // Function to create a new post (announcement)
  const createPost = async () => {
    if (announcementContent().trim() !== "") {
      try {
        // POST the new announcement to the backend
        const response = await axios!.post(`/classes/${classId}/announcements`, {
          content: announcementContent(),
        });

        // Clear the input after posting
        setAnnouncementContent(""); 
        toast.success("Announcement created successfully");

        // Fetch the updated list of announcements from the backend
        fetchClassDetails();

      } catch (error) {
        console.error("Error posting announcement:", error);
        toast.error("Failed to post announcement");
      }
    }
  };

  return (
    <div class="w-full max-w-6xl mx-auto mt-8">
      {/* Class header section */}
      <div class="relative bg-teal-600 rounded-lg h-48 flex items-center justify-center">
        <h1 class="relative text-white text-3xl font-semibold">
          {className()}
        </h1>
      </div>
      

      {/* Tabs: Stream, Classwork, People */}
      <div class="flex justify-center space-x-8 mt-6">
        <button class="border-b-2 border-blue-500 font-semibold">Stream</button>
        <A href={`/class/${classId}/classwork`} class="text-gray-500">
          Classwork
        </A>
        <A href={`/people/class/${classId}`} class="text-gray-500">
          People
        </A>
      </div>

      {/* Upcoming Section */}
      <div class="flex mt-6">
        <div class="bg-white shadow-md rounded-lg p-4 w-1/4 mr-6">
          <h2 class="font-semibold text-lg">Upcoming</h2>
          <p class="text-sm text-gray-500">Woohoo, no work due soon!</p>
          <a href="#" class="text-blue-500 mt-2 block">
            View all
          </a>
        </div>

        {/* Announcements and Posts */}
        <div class="w-3/4">
          {/* Announcement input */}
          <div class="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center">
            <img
              src={user.photoURL}
              alt="User"
              class="h-12 w-12 rounded-full mr-4"
            />
            <input
              type="text"
              value={announcementContent()}
              onInput={(e) => setAnnouncementContent(e.target.value)}
              placeholder="Announce something to your class"
              class="flex-grow border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <IconButton onClick={createPost}>
              <SendOutlinedIcon class="text-blue-500" />
            </IconButton>
          </div>

          {/* Render Announcements */}
          <div class="space-y-4">
            <For each={posts()}>
              {(post) => (
                <div class="bg-white shadow-md rounded-lg p-4 flex items-start space-x-4">
                  <img
                    src="https://via.placeholder.com/50"
                    alt="User"
                    class="h-12 w-12 rounded-full"
                  />
                  <div>
                    <div class="text-sm text-gray-500">
                      {post.user_id.display_name} • {moment(post.date).fromNow()}
                    </div>
                    <p class="mt-2 text-gray-800">{post.content}</p>
                    {/* Display any file URLs (if available) */}
                    {post.file_url.length > 0 && (
                      <div class="mt-2">
                        {post.file_url.map((file) => (
                          <a href={file} target="_blank" class="text-blue-500 underline">View File</a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Class;
