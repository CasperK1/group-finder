export const ProfileSection = ({ profilePicture, handleFileChange, fileInputRef, handleChoosePicture }) => {
  return (
    <div className="bg-base-100 p-8 shadow-2xl rounded-lg flex flex-col items-center">
      <div className="w-32 h-32 bg-base-300 rounded-full overflow-hidden mb-4 border-4 border-base-300">
        <img
          src={profilePicture ? profilePicture : process.env.REACT_APP_DEFAULT_AVATAR_URL}
          alt={profilePicture ? `profilePicture's profile` : 'Default Avatar'}
          className="w-full h-full object-cover"
        />
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      <button
        onClick={handleChoosePicture}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
      >
        Choose Picture
      </button>

      <h3 className="text-2xl font-semibold text-base-content mt-6">Edit Profile</h3>
    </div>
  );
};