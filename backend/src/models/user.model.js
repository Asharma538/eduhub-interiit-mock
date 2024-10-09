import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id : {
        type : String,
        required : false
    },
    classes : {
        type : [ClassroomsSchema],
        required : false
    },
    email : {
        type : String,
        required : true
    },
    display_name : {
        type : String,
        required : true
    },
    todoList : {
        type : TodoListSchema,
        required : false
    },
    role : {
        type : String,
        required : true
    },
    app_settings : {
        type : AppSettingsSchema,
        required : false
    },

},{timestamp : true})

const User = mongoose.model('User', userSchema);
