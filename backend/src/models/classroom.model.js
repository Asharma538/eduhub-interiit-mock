import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const classroomSchema = new Schema({
    id : {
        type : String,
        required : true
    },
    announcements : {
        type : [AnnouncementSchema],
        required : false
    },
    name: {
        type: String,
        required: true
    },
    invitation_code: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    comments : {
        type : [CommentSchema],
        required : false
    },
    teachers : {
        type : [UserSchema],
        required : true
    },
    students : {
        type : [UserSchema],
        required : false
    },

},{timestamps : true});