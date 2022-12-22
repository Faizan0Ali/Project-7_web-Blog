const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        required: true,
        trim: true,
    },
    createdBy: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    geoLocation: {
          type:{type: String, required:true},
          coordinates:[]
    },
    isDeleted: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

postSchema.index({location:"2dsphere"});
module.exports = mongoose.model('Post', postSchema);


// Task 3: Create the CRUD of Post for the only authenticated user.
// - User can actions on their own posts only.
// - It should have following details:
// - Title
// - Body
// - Created By
// - Active/Inactive
// - Geo location (latitude and longitude)
// Note: Validate all requests using any library
// Task 4:
// - Create an API to retrieve posts using latitude and longitude.
// Task 5:
// - Show the count of active and inactive post in the dashboard.