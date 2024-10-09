import mongoose from "mongoose";
const Schema = mongoose.Schema;

const announcementSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    group: {
      type: String,
      required: false,
    },
    class_id: {
      type: Schema.Types.ObjectId,
      ref: "Classrooms",
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
    file_url: {
      type: String,
        required: false,
    },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

const Announcement  = mongoose.model('Announcement', announcementSchema);

export default Announcement;
