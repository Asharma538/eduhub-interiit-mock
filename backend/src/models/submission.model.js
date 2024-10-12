import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    student_id:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignment_id:{
        type: Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    submission_date:{
        type: Date,
        required: true,
        default: Date.now
    },
    file_url:[{
        type: String,
        required:true
    }],
    content:{
        type: String,
        required: false
    }
})

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
