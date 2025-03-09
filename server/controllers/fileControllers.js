const User = require('../models/User');
const Group = require('../models/Group');
const s3Service = require('../services/s3Service');
const mongoose = require("mongoose");


// GET /api/files/profile-picture/:userId
const getProfilePicture = async (req, res) => {
  try {
    const {userId} = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({message: "Invalid user ID"});
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    if (!user.profile.photo) {
      return res.status(404).json({message: 'No profile picture found'});
    }
    // Generate a signed URL
    const signedUrl = await s3Service.getFileDownloadUrl(user.profile.photo, 3600);

    res.setHeader('Cache-Control', 'private, max-age=3600');
    res.json({
      userId: user._id,
      photoUrl: signedUrl,
      expiresAt: new Date(Date.now() + 3600000) // 1 hours in millisecond
    });
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    res.status(500).json({
      message: 'Failed to fetch profile picture',
      error: error.message
    });
  }
};

// GET /api/files/profile-pictures?userIds=id1,id2,id3 ...
const getMultipleProfilePictures = async (req, res) => {
  try {
    // Get array of user IDs from query parameter
    const userIds = req.query.userIds?.split(',') || [];

    if (!userIds.length) {
      return res.status(400).json({message: 'No user IDs provided'});
    }
    // Find all users and get their profile photo keys. $ne: not equal
    const users = await User.find({
      _id: {$in: userIds},
      'profile.photo': {$ne: null}
    });

    // Generate signed URLs for all photos in parallel
    const profilePictures = await Promise.all(
      users.map(async (user) => {
        let signedUrl = null;
        try {
          signedUrl = await s3Service.getFileDownloadUrl(user.profile.photo, 3600);
        } catch (error) {
          console.error(`Error generating URL for user ${user._id}:`, error);
        }
        return {
          userId: user._id,
          photoUrl: signedUrl,
          // Include expiration time so frontend knows when to refresh
          expiresAt: new Date(Date.now() + 3600000)// 1 hours in millisecond
        };
      })
    );
    res.setHeader('Cache-Control', 'private, max-age=3600');
    res.json(profilePictures);
  } catch (error) {
    console.error('Error fetching profile pictures:', error);
    res.status(500).json({
      message: 'Failed to fetch profile pictures',
      error: error.message
    });
  }
};

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
    const signedUrl = await s3Service.getFileDownloadUrl(req.file.key, 3600);

    res.setHeader('Cache-Control', 'private, max-age=3600');
    res.json({
      userId: user._id,
      photoUrl: signedUrl,
      expiresAt: new Date(Date.now() + 3600000) // 1 hours in millisecond
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
  if (!mongoose.Types.ObjectId.isValid(req.params.groupId)) {
    return res.status(400).json({message: "Invalid group ID"});
  }
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
      username: user.username,
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

// GET /api/files/group/:groupId
const getGroupFiles = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.groupId)) {
    return res.status(400).json({message: "Invalid group ID"});
  }
  try {
    const {groupId} = req.params;

    // Find the group and check if it exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({message: 'Group not found'});
    }

    // Check if user is a member of the group
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({message: 'Access denied: Not a group member'});
    }

    // Get all files from the group
    const files = group.documents.map(doc => ({
      id: doc.id,
      fileName: doc.originalName,
      fileType: doc.fileType,
      size: doc.size,
      uploadedBy: doc.uploadedBy,
      uploadedAt: doc.uploadedAt,
      lastModified: doc.lastModified,
      description: doc.description,
      tags: doc.tags,
      downloads: doc.downloads,
      isArchived: doc.isArchived
    }));

    res.status(200).json({
      count: files.length,
      files: files
    });

  } catch (error) {
    console.error('Error in getGroupFiles:', error);
    res.status(500).json({
      message: 'Failed to retrieve group files',
      error: error.message
    });
  }
};

// GET /api/files/group/:groupId/:fileId
const downloadGroupFile = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.groupId)) {
    return res.status(400).json({message: "Invalid group ID"});
  }
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
    res.setHeader('Cache-Control', 'private, max-age=900');
    res.json({
      downloadUrl,
      fileName: file.originalName,
      fileType: file.mimeType,
      uploadedBy: file.uploadedBy,
      uploadedAt: file.uploadedAt,
      downloads: file.downloads,
      description: file.description,
      tags: file.tags,
      expiresAt: new Date(Date.now() + 900000) // 15 minutes in milliseconds
    });
  } catch (error) {
    console.error('Error in getGroupFile:', error);
    res.status(500).json({
      message: 'Failed to retrieve file',
      error: error.message
    });
  }
};


// DELETE /api/files/group/:groupId/:fileId
const deleteGroupFile = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.groupId) ||
    !mongoose.Types.ObjectId.isValid(req.params.fileId)) {
    return res.status(400).json({message: "Invalid ID format"});
  }

  try {
    const [user, group] = await Promise.all([
      User.findById(req.user.id),
      Group.findById(req.params.groupId)
    ]);

    if (!user || !group) {
      return res.status(404).json({
        message: user ? "Group not found" : "User not found",
      });
    }

    // Find file in group's documents array
    const file = group.documents.id(req.params.fileId);
    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }
    const fileKey = file.key;

    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({message: 'Must be a group member to delete files!'});
    }

    // Only file uploader or moderator/owner can delete
    const isOwner = group.owner.toString() === req.user.id;
    const isModerator = group.moderators.some(id => id.toString() === req.user.id);
    const isUploader = file.uploadedBy.toString() === req.user.id;

    if (!isOwner && !isModerator && !isUploader) {
      return res.status(403).json({
        message: 'You do not have permission to delete this file',
        fileOwner: isOwner,
        fileModerator: isModerator,
        fileUploader: isUploader
      });
    }

    // Delete from S3
    await s3Service.deleteFile(fileKey);

    // Remove the file from the group's documents array
    group.documents.pull(req.params.fileId);

    // Save the updated group
    await group.save();

    res.status(200).json({
      message: 'File deleted successfully',
      fileId: req.params.fileId
    });
  } catch (error) {
    console.error('Error in deleteGroupFile:', error);
    res.status(500).json({
      message: 'Failed to delete file',
      error: error.message
    });
  }
};

module.exports = {
  uploadProfileImage,
  deleteProfileImage,
  getProfilePicture,
  getMultipleProfilePictures,
  uploadGroupFile,
  getGroupFiles,
  downloadGroupFile,
  deleteGroupFile
};