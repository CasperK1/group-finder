
export const ProfileSection = ({userProfile, handleFileChange,fileInputRef, handleChoosePicture }) => {
    return (
        <div className="bg-white p-8 shadow-2xl rounded-lg flex flex-col items-center">
        <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden mb-4 border-4 border-gray-400">
          <img
            src={userProfile ? userProfile.photoUrl : process.env.REACT_APP_DEFAULT_AVATAR_URL}
            alt={userProfile ? `${userProfile.name}'s profile` : 'Default Avatar'}
            className="w-full h-full object-cover"
          />
        </div>
        <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
        <button onClick={handleChoosePicture}  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
          Choose Picture
        </button>

        <h3 className="text-2xl font-semibold text-gray-900 mt-6">Edit Profile</h3>
        {/* <form className="w-full mt-4 space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <textarea
            placeholder="Bio"
            className="w-full p-3 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-600 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition font-semibold"
          >
            Save Changes
          </button>
        </form> */}
      </div>
    )
}