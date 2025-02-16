const User = require('../models/User');
const Group = require('../models/Group');
const s3Service = require('../services/s3Service');

// POST /api/files/upload/profile-picture
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({message: 'No file uploaded'});
    }
    const user = await User.findById(req.user.id);

    // If user already has a profile picture, delete the old one
    if (user.profile.photo) {
      try {
        await s3Service.deleteFile(user.profile.photo);
      } catch (error) {
        console.error('Error deleting old profile picture:', error);
      }
    }


    // Update user's profile photo with the new S3 location
    user.profile.photo = req.file.key;
    await user.save();

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      photoUrl: req.file.location
    });
  } catch (error) {
    console.error('Error in uploadProfileImage:', error);
    res.status(500).json({
      message: 'Failed to upload profile picture',
      error: error.message
    });
  }
};

// DELETE /api/files/delete/profile-picture
const deleteProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.profile.photo) {
      return res.status(404).json({message: 'No profile picture found'});
    }

    await s3Service.deleteFile(user.profile.photo);

    // Clear the photo field in user profile
    user.profile.photo = null;
    await user.save();

    res.status(200).json({message: 'Profile picture deleted successfully'});
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete profile picture',
      error: error.message
    });
  }
};

// POST /api/files/group/:groupId
const uploadGroupFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({message: 'No file uploaded'});
    }
    [user, group] = await Promise.all([User.findById(req.user.id), Group.findById(req.params.groupId)]);

    if (!user || !group) {
      return res.status(404).json({
        message: user ? "Group not found" : "User not found",
      });
    }
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({message: 'Must be a group member to upload files'});
    }

    // Get file extension from original filename
    const fileType = req.file.originalname.split('.').pop().toLowerCase();
    // Create new document object
    const newDocument = {
      key: req.file.key,
      originalName: req.file.originalname,
      fileType,
      size: req.file.size,
      uploadedBy: req.user.id,
      username:user.username,
      description: req.body.description || '',
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      lastModified: new Date()
    };

    group.documents.push(newDocument);
    await group.save();

    res.status(200).json({
      message: 'File uploaded successfully',
      file: newDocument
    });
  } catch (error) {
    console.error('Error in uploadGroupFile:', error);
    res.status(500).json({
      message: 'Failed to upload file',
      error: error.message
    });
  }
};

// GET /api/files/group/:groupId/:fileId
const getGroupFile = async (req, res) => {
  try {
    const {groupId, fileId} = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({message: 'Group not found'});
    }

    // Check membership
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({message: 'Access denied: Not a group member'});
    }

    // Find the file in documents array
    const file = group.documents.id(fileId);
    if (!file) {
      return res.status(404).json({message: 'File not found'});
    }

    // Generate download URL
    const downloadUrl = await s3Service.getFileDownloadUrl(file.key);

    // Increment download counter
    file.downloads += 1;
    await group.save();

    res.json({
      downloadUrl,
      fileName: file.originalName,
      fileType: file.mimeType,
      uploadedBy: file.uploadedBy,
      uploadedAt: file.uploadedAt,
      downloads: file.downloads,
      description: file.description,
      tags: file.tags
    });
  } catch (error) {
    console.error('Error in getGroupFile:', error);
    res.status(500).json({
      message: 'Failed to retrieve file',
      error: error.message
    });
  }
};
module.exports = {
  uploadProfileImage,
  deleteProfileImage,
  uploadGroupFile,
  getGroupFile
};