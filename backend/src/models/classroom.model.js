import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const classroomSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    invitation_code: {
        type: String,
        required: true,
        unique:true
    },
    details: {
        type: String,
        required: true
    },
    announcements: [{
        type: Schema.Types.ObjectId,
        ref: 'Announcement',
    }],
    assignments: [{
        type: Schema.Types.ObjectId, 
        ref: 'Assignment'
    }],
    teachers: [{
        type: Schema.Types.ObjectId, 
        ref: 'User',
    }],
    students: [{
        type: Schema.Types.ObjectId, 
        ref: 'User',
    }],
}, {timestamps: true});

const Classroom = mongoose.model('Classroom', classroomSchema);
export default Classroom;
