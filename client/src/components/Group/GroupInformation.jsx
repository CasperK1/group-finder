import React from 'react';

function GroupHeader() {
  return (
    <div className="flex items-center mb-4 just ">
      <img src="https://placehold.co/50x50" alt="Group logo" className="w-12 h-12 mr-4" />
      <div className='ml-20 spacing-2'>
        <h2 className="text-xl font-semibold mb-4">Group 1</h2>
        <p className="text-blue-500">User</p>
        <p className="text-gray-400">Software Engineering</p>
      </div>
    </div>
  );
}

function GroupLocation() {
  return (
    <div className="mb-8 items-center justify-between">
      <p className="text-gray-400 mb-2">Location</p>
      <div className="flex justify-between text-gray-400">
        <span>Year</span>
        <span>City</span>
        <span>Time</span>
      </div>
    </div>
  );
}

function GroupDescription() {
  return (
    <p className="text-gray-600 mb-4">
      It is a long established fact that a reader will be distracted by the readable content of a page when looking at
      its layout. The point of using Lorem Ipsum is that it has a more-or-less normal.
    </p>
  );
}

function GroupFooter() {
  return (
    <div className="absolute bottom-0 flex justify-between items-center w-full mb-4">
      <span className="text-gray-400">28 March 2021</span>
      <button className="bg-black text-white px-4 py-2 rounded">Join</button>
<div className="flex space-x-4">
  <i className="fas fa-ban text-black"></i>
  <i className="fas fa-bookmark text-black"></i>
</div>
    </div>
  );
}

function GroupInformation() {
  return (
    <div className="bg-white w-full max-w-4xl min-h-[500px] p-8 rounded-lg shadow-md relative">
      <GroupHeader />
      <GroupLocation />
      <GroupDescription />
      <GroupFooter />
    </div>
  );
}

export default GroupInformation;
