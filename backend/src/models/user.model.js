import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    display_name: {
        type: String,
        required: true
    },
    classes: [{
        type: Schema.Types.ObjectId, 
        ref: 'Classroom'
    }],
    todoList: {
        type: Schema.Types.ObjectId, 
        ref: 'TodoList'
    },
    app_settings: {
        type: Schema.Types.ObjectId, 
        ref: 'AppSettings'
    },
}, { timestamps: true }); 

const User = mongoose.model('User', userSchema);
export default User;

