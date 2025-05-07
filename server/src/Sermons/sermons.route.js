const express = require('express');
const router = express.Router();
const SermonController = require('./sermons.controller');
const { authMiddleware, adminAuthMiddleware } = require('../Middleware/authMiddleware');
const upload = require('../Middleware/uploadConfig'); // Import the upload configuration

// Use multer for handling multipart form data
router.post(
    '/',
    authMiddleware,
    adminAuthMiddleware,
    upload.fields([
        { name: 'audioFile', maxCount: 1 },
        { name: 'image', maxCount: 1 }
    ]),
    SermonController.createSermon
);

router.get('/', SermonController.getAllSermons);
router.get('/aggregated-data', authMiddleware, adminAuthMiddleware, SermonController.getAggregatedData);
router.get('/:id', SermonController.getSermonById);
router.put('/:id', authMiddleware, adminAuthMiddleware,upload.single('image'), SermonController.updateSermon);
router.delete('/:id', authMiddleware, adminAuthMiddleware, SermonController.deleteSermon);


// Interaction Routes (Regular users should be able to access these)
router.patch('/:id/like', authMiddleware, SermonController.likeSermon);
router.patch('/:id/view', SermonController.incrementView);
router.patch('/:id/download', SermonController.incrementDownload);
router.post('/:id/comment', authMiddleware, SermonController.addComment);
router.delete('/:sermonId/comment/:commentId', authMiddleware, SermonController.deleteComment);

module.exports = router;