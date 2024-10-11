import mongoose from "mongoose";
const Schema = mongoose.Schema;

const announcementSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    created_date: {
      type: Date,
      default: Date.now,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    file_url: [
      {
        type: String,
        required: false,
      }
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);
const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
