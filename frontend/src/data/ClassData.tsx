import moment from "moment";

export default {
  name: "SolidJS Class",
  posts: [
    {
      authorId: "user1",
      content: "Welcome to the class!",
      date: moment().subtract(1, "days").format("MMM Do YY"),
      image: "https://via.placeholder.com/50",
      name: "John Doe",
    },
    {
      authorId: "user2",
      content: "Don’t forget the meeting tomorrow!",
      date: moment().subtract(2, "days").format("MMM Do YY"),
      image: "https://via.placeholder.com/50",
      name: "Jane Smith",
    },
  ],
};
