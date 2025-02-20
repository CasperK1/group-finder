const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const s3Service = require('../services/s3Service');
const {
  uploadProfileImage,
  deleteProfileImage,
  getProfilePictures,
  uploadGroupFile,
  getGroupFiles,
  downloadGroupFile,
  deleteGroupFile
} = require('../controllers/fileControllers');

/*
  Due to how multer works, the s3Service's upload functions need to be called as middleware in the route handlers.
  Raw data from the file needs to be processed before it reaches controller
  s3Service.deleteFile can be called directly in the controller since data for that file already exists
*/

// http://localhost:3000/api/files/
// User files
router.post('/upload/profile-picture', auth, s3Service.uploadProfilePicture(), uploadProfileImage);
router.delete('/delete/profile-picture', auth, deleteProfileImage);
router.get('/profile-pictures', auth, getProfilePictures);

// Group files
router.get('/group/:groupId/', auth, getGroupFiles);
router.delete('/group/:groupId/:fileId', auth, deleteGroupFile);
router.post('/upload/group/:groupId', auth, s3Service.uploadGroupFile(), uploadGroupFile);
router.get('/group/:groupId/:fileId', auth, downloadGroupFile);

module.exports = router;