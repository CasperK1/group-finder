const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const s3Service = require('../services/s3Service');
const {
  uploadProfileImage,
  deleteProfileImage,
  uploadGroupFile,
  getGroupFile
} = require('../controllers/fileControllers');

/*
  Due to how multer works, the upload functions need to be called as middleware in the route handlers.
  Raw data from the file needs to be processed before it reaches controller
  s3Service.deleteFile can be called directly in the controller since data for that file already exists
*/

// http://localhost:3000/api/files/
// User files
router.post('/upload/profile-picture', auth, s3Service.uploadProfilePicture(), uploadProfileImage);
router.delete('/delete/profile-picture', auth, deleteProfileImage);
// TODO:
// GET profile picture

// Group files
// TODO: commented below and maybe more?
// GET /api/files/group/:groupId
// DELETE /api/files/group/:groupId/:fileId
router.post('/upload/group/:groupId', auth, s3Service.uploadGroupFile(), uploadGroupFile);
router.get('/group/:groupId/:fileId', auth, getGroupFile);

module.exports = router;