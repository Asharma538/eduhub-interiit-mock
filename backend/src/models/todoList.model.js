import mongoose from "mongoose";

const Schema = mongoose.Schema;

const toDoListSchema = new Schema(
    {
        assignments:[
            {
                type:Schema.Types.ObjectId,
                ref:"Assignment",
            }
        ]
    },
    {timestamps: true}
);

const ToDoList = mongoose.model("ToDoList",toDoListSchema)
export default ToDoList