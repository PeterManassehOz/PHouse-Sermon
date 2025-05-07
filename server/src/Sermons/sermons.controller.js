const Sermon = require('./sermons.model');
const upload = require('../Middleware/uploadConfig'); // Import upload middleware
const fs = require('fs'); // To delete old images
const mongoose = require('mongoose');
const path = require('path');


// Create a new sermon
exports.createSermon = async (req, res) => {
    try {
        const { title, preacher, date, category, description, duration } = req.body;

        console.log("Request received:", req.body);
        console.log("Uploaded files:", req.files);

        if (!req.files || !req.files['audioFile'] || !req.files['image']) {
            return res.status(400).json({ message: 'Audio file and image are required' });
        }

        const audioFile = req.files['audioFile'][0].path.replace(/\\/g, '/');
        const image = req.files['image'][0].path.replace(/\\/g, '/');

        console.log("Audio Path:", audioFile);
        console.log("Image Path:", image);

        const sermon = new Sermon({
            userId: req.user.id,
            title,
            preacher,
            date,
            audioFile,
            image,
            category,
            description,
            duration,
            views: 0,
            downloads: 0,
            likes: [],
            comments: [],
        });

        await sermon.save();
        res.status(201).json({ 
            message: 'Sermon created successfully', 
            sermon: {
                ...sermon.toObject(),
                audioFile: `${req.protocol}://${req.get('host')}/${audioFile}`,
                image: `${req.protocol}://${req.get('host')}/${image}`
            }
        });
    } catch (error) {
        console.error("Error creating sermon:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all sermons
exports.getAllSermons = async (req, res) => {
    try {
        console.log("Fetching all sermons...");
        const sermons = await Sermon.find()
            .populate('userId', 'username email')
            .sort({ createdAt: -1 });

        console.log("Sermons retrieved:", sermons.length);
        res.status(200).json(sermons);
    } catch (error) {
        console.error("Error fetching sermons:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a single sermon by ID
exports.getSermonById = async (req, res) => {
    try {
        const sermon = await Sermon.findById(req.params.id)
            .populate('userId', 'username email')
            .populate({
                path: 'comments.userId', 
                select: 'username email image' 
            });

        if (!sermon) return res.status(404).json({ message: 'Sermon not found' });

        console.log("Sermon Response:", JSON.stringify(sermon, null, 2)); // Log response

        res.status(200).json(sermon);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateSermon = async (req, res) => {
    try {
        console.log('Updating sermon with ID:', req.params.id);
        console.log('User ID from token:', req.user.id);

        const sermon = await Sermon.findById(req.params.id);
        if (!sermon) {
            console.log('Sermon not found');
            return res.status(404).json({ message: 'Sermon not found' });
        }

        console.log('Sermon belongs to user ID:', sermon.userId.toString());

        if (sermon.userId.toString() !== req.user.id) {
            console.log('Unauthorized attempt to update sermon');
            return res.status(403).json({ message: 'Unauthorized to update this sermon' });
        }

        let updatedData = { ...req.body };

        // Handle image update
        if (req.file) {
            // Delete the old image if it exists
            if (sermon.image) {
                const oldImagePath = path.join(__dirname, '..', sermon.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            updatedData.image = `uploads/images/${req.file.filename}`;
        }

        
        console.log('Request body:', req.body);
        console.log('File uploaded:', req.file);
        console.log('Updated data:', updatedData);
        const updatedSermon = await Sermon.findByIdAndUpdate(req.params.id, updatedData, {
            new: true,
            runValidators: true,
          });
          await updatedSermon.save();
          console.log('Updated sermon from DB:', updatedSermon);
          
        console.log('Sermon updated successfully:', updatedSermon);
        res.status(200).json({ message: 'Sermon updated', sermon: updatedSermon });
    } catch (error) {
        console.log('Error updating sermon:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a sermon
exports.deleteSermon = async (req, res) => {
    try {
        const sermon = await Sermon.findById(req.params.id);
        if (!sermon) return res.status(404).json({ message: 'Sermon not found' });
        if (sermon.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to delete this sermon' });
        }
        await sermon.deleteOne();
        res.status(200).json({ message: 'Sermon deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Like/unlike a sermon
exports.likeSermon = async (req, res) => {
    try {
        console.log(`Liking sermon with ID: ${req.params.id} by user: ${req.user.id}`);
        const sermon = await Sermon.findById(req.params.id);
        if (!sermon) return res.status(404).json({ message: 'Sermon not found' });

        const userId = req.user.id;
        if (sermon.likes.includes(userId)) {
            sermon.likes = sermon.likes.filter(id => id.toString() !== userId);
            console.log("Sermon unliked");
        } else {
            sermon.likes.push(userId);
            console.log("Sermon liked");
        }
        await sermon.save();
        res.status(200).json({ message: 'Like status updated' });
    } catch (error) {
        console.error("Error liking sermon:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Increment view count
exports.incrementView = async (req, res) => {
    try {
        const sermon = await Sermon.findById(req.params.id);
        if (!sermon) return res.status(404).json({ message: 'Sermon not found' });
        sermon.views += 1;
        await sermon.save();
        res.json({ views: sermon.views });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Increment download count
exports.incrementDownload = async (req, res) => {
    try {
        const sermon = await Sermon.findById(req.params.id);
        if (!sermon) return res.status(404).json({ message: 'Sermon not found' });
        sermon.downloads += 1;
        await sermon.save();
        res.json({ downloads: sermon.downloads });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Add a comment
exports.addComment = async (req, res) => {
    try {
        console.log("Adding comment:", req.body);
        const { text } = req.body;
        const sermon = await Sermon.findById(req.params.id);
        if (!sermon) return res.status(404).json({ message: 'Sermon not found' });

        const commenterName = req.user.isAdmin ? "Admin" : req.user.name;

        const comment = {
            userId: req.user.id,
            name: commenterName,
            text,
            createdAt: new Date()
        };

        sermon.comments.push(comment);
        await sermon.save();

        console.log("Comment added successfully:", comment);
        res.status(201).json({ message: 'Comment added', comment });
    } catch (error) {
        console.error("Error adding comment:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    try {
        console.log("Received delete comment request:", req.params);
        
        let { sermonId, commentId } = req.params;
        sermonId = sermonId.trim();
        commentId = commentId.trim();

        if (!mongoose.Types.ObjectId.isValid(sermonId) || !mongoose.Types.ObjectId.isValid(commentId)) {
            console.error("Invalid ID format");
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const sermon = await Sermon.findById(sermonId);
        if (!sermon) return res.status(404).json({ message: "Sermon not found" });

        const commentIndex = sermon.comments.findIndex(c => c._id.toString() === commentId);
        if (commentIndex === -1) {
            console.error("Comment not found");
            return res.status(404).json({ message: "Comment not found" });
        }

        sermon.comments.splice(commentIndex, 1);
        await sermon.save();

        console.log("Comment deleted successfully");
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getAggregatedData = async (req, res) => {
    try {
        const result = await Sermon.aggregate([
            {
                $group: {
                    _id: null,
                    totalSermons: { $sum: 1 },
                    totalLikes: { $sum: { $size: "$likes" } },
                    totalViews: { $sum: "$views" },
                    totalDownloads: { $sum: "$downloads" },
                    totalComments: { $sum: { $size: "$comments" } },
                    allComments: { $push: "$comments" } // Collect all comments into an array
                }
            },
            {
                $unwind: { path: "$allComments", preserveNullAndEmptyArrays: true }
            },
            {
                $unwind: { path: "$allComments", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "users", // The name of the user collection in MongoDB
                    localField: "allComments.userId",
                    foreignField: "_id",
                    as: "allComments.user"
                }
            },
            {
                $group: {
                    _id: null,
                    totalSermons: { $first: "$totalSermons" },
                    totalLikes: { $first: "$totalLikes" },
                    totalViews: { $first: "$totalViews" },
                    totalDownloads: { $first: "$totalDownloads" },
                    totalComments: { $first: "$totalComments" },
                    allComments: { $push: "$allComments" } // Reassemble comments after population
                }
            }
        ]);

        res.status(200).json(result[0] || {
            totalSermons: 0,
            totalLikes: 0,
            totalViews: 0,
            totalDownloads: 0,
            totalComments: 0,
            allComments: []
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


