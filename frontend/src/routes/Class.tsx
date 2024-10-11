import { createSignal, For } from "solid-js";
import { IconButton } from "@suid/material";
import SendOutlinedIcon from "@suid/icons-material/SendOutlined";
import moment from "moment";
import Announcement from "../components/Class/Announcements";

function Class() {
  const [classData, setClassData] = createSignal({
    name: "SolidJS Class",
    posts: [
      {
        authorId: "user1",
        content: "Welcome to the class!",
        date: moment().subtract(1, 'days').format("MMM Do YY"),
        image: "https://via.placeholder.com/50",
        name: "John Doe",
      },
      {
        authorId: "user2",
        content: "Don’t forget the meeting tomorrow!",
        date: moment().subtract(2, 'days').format("MMM Do YY"),
        image: "https://via.placeholder.com/50",
        name: "Jane Smith",
      }
    ]
  });

  const [announcementContent, setAnnouncementContent] = createSignal("");
  const [posts, setPosts] = createSignal([...classData().posts]);
  const [user] = createSignal({
    uid: "user123",
    photoURL: "https://via.placeholder.com/50",
    displayName: "My Name",
  });

  const createPost = () => {
    const newPost = {
      authorId: user().uid,
      content: announcementContent(),
      date: moment().format("MMM Do YY"),
      image: user().photoURL,
      name: user().displayName,
    };

    // Add the new post to the top of the list
    setPosts([newPost, ...posts()]);
    setAnnouncementContent(""); // Clear the input field after posting
  };

  return (
    <div class="w-2/3 mx-auto">
      <div class="class__nameBox bg-teal-600 text-white h-96 mt-8 rounded-lg flex flex-col items-start p-8 font-bold text-4xl">
        <div>{classData().name}</div>
      </div>
      <div class="class__announce flex items-center w-full p-5 mb-6 shadow-md justify-between rounded-xl mt-5">
        <img src={user().photoURL} alt="My image" class="h-12 w-12 rounded-full" />
        <input
          type="text"
          value={announcementContent()}
          onInput={(e) => setAnnouncementContent(e.target.value)}
          placeholder="Announce something to your class"
          class="border-none p-4 w-full mx-5 text-lg outline-none"
        />
        <IconButton onClick={createPost}>
          <SendOutlinedIcon />
        </IconButton>
      </div>
      <For each={posts()}>
        {(post) => (
          <Announcement
            authorId={post.authorId}
            content={post.content}
            date={post.date}
            image={post.image}
            name={post.name}
          />
        )}
      </For>
    </div>
  );
}

export default Class;
