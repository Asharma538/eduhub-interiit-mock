import mongoose from "mongoose";
const Schema = mongoose.Schema;

const assignmentSchema = new Schema(
  {
    title: {
        type: String,
        required: true,                                                                                               
    },
    description: {                                                                    
        type: String,
        required: false,
    },
    deadline: {
        type: Date,
        required: false,
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
    submissions: [{
        type: Schema.Types.ObjectId,
        ref: "Submission",
    }]
  },
  { timestamps: true }
);
const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
