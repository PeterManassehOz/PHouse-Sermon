const mongoose = require('mongoose');


const SermonSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference User model
    title: { type: String, required: true },
    preacher: { type: String, required: true },
    date: { type: Date, required: true },
    audioFile: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Update comments userId too
        text: String,
        createdAt: { type: Date, default: Date.now }
    }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Update likes field
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    duration: { type: String, required: true },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
}, { timestamps: true });

const Sermon = mongoose.model('Sermon', SermonSchema);

module.exports = Sermon;
