import { createSignal, For } from "solid-js";
import { IconButton } from "@suid/material";
import SendOutlinedIcon from "@suid/icons-material/SendOutlined";
import moment from "moment";
import { A } from "@solidjs/router";


function Class() {
  const [announcementContent, setAnnouncementContent] = createSignal("");
  const [posts, setPosts] = createSignal([
    {
      authorId: "user123",
      content: "Welcome to the class!",
      date: moment().format("MMM Do YY"),
      image: "https://via.placeholder.com/50",
      name: "Poushali Nandi",
    },
  ]);
  const [user] = createSignal({
    uid: "user123",
    photoURL: "https://via.placeholder.com/50",
    displayName: "My Name",
  });

  const createPost = () => {
    if (announcementContent().trim() !== "") {
      const newPost = {
        authorId: user().uid,
        content: announcementContent(),
        date: moment().format("MMM Do YY"),
        image: user().photoURL,
        name: user().displayName,
      };
      setPosts([newPost, ...posts()]);
      setAnnouncementContent("");
    }
  };

  return (
    <div class="w-full max-w-6xl mx-auto mt-8">
      {/* Class header section */}
      <div class="relative bg-teal-600 rounded-lg h-48 flex items-center justify-center">
     
        <h1 class="relative text-white text-3xl font-semibold">
          Introduction to Profession
        </h1>
      </div>

     {/* Tabs: Stream, Classwork, People */}
      <div class="flex justify-center space-x-8 mt-6">
        <button class="border-b-2 border-blue-500 font-semibold">Stream</button>
        <A href="/classwork" class="text-gray-500">
          Classwork
        </A>
        <A href="/people" class="text-gray-500">
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
              src={user().photoURL}
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
                    src={post.image}
                    alt="User"
                    class="h-12 w-12 rounded-full"
                  />
                  <div>
                    <div class="text-sm text-gray-500">
                      {post.name} • {post.date}
                    </div>
                    <p class="mt-2 text-gray-800">{post.content}</p>
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
