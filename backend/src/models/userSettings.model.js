import mongoose from 'mongoose';

const Schema= mongoose.Schema;

const userSettingsSchema = new Schema({
    is_dark_mode:{
        type:Boolean,
        defualt: false
    },
    notifications:{
        type:Boolean,
        default: false
    }
})

const UserSetting = mongoose.model('UserSetting', userSettingsSchema);

export default UserSetting;

