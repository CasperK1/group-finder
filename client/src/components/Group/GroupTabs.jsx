import React, {useEffect, useState, useRef} from 'react';
import {apiService} from '../../services/api/apiService';
import {ChatApp} from '../ChatApp/ChatApp';
import {DocumentPreview} from './DocumentPreview.jsx';
import {FilePondComponent} from './FilePond.jsx';

export function GroupTabs({
                            groupData,
                            groupUsers,
                            groupId,
                            activeTab,
                            setActiveTab,
                            toggleChatModal,
                            isChatOpen,
                            isJoined,
                          }) {
  const [groupFiles, setGroupFiles] = useState([]);
  const [userProfilePictures, setUserProfilePictures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const modalRef = useRef(null);

  const jwt = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchGroupUserProfilePicture = async () => {
      try {
        const groupMemberIds = groupData.members.map((member) => member._id);
        const response = await apiService.file.getMultipleProfilePictures({token: jwt, userIds: groupMemberIds});
        if (response) {
          setUserProfilePictures(response);
        } else {
          console.log('No data received');
        }
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };
    fetchGroupUserProfilePicture();
  }, [groupData, jwt]);

  useEffect(() => {
    if (isJoined && activeTab === 'Documents') {
      const fetchGroupFiles = async () => {
        setIsLoading(true);
        try {
          const response = await apiService.group.getGroupFiles({token: jwt, id: groupId});
          if (response) {
            setGroupFiles(response.files);
          } else {
            console.log('No files received');
          }
        } catch (error) {
          console.error('Error fetching group files:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchGroupFiles();
    }
  }, [isJoined, groupId, jwt, activeTab]);

  // Function to handle document download
  const handleDownload = async (doc) => {
    try {
      const response = await apiService.file.downloadGroupFile({
        groupId: groupData._id,
        fileId: doc.id,
        token: jwt
      });
      if (response && response.downloadUrl) {
        window.open(response.downloadUrl, '_blank');
      } else {
        console.log('No download URL received in the response');
      }
    } catch (error) {
      console.error('Error fetching group files:', error);
    }
  };

  // Function to handle document preview
  const handlePreview = async (doc) => {
    try {
      const response = await apiService.file.downloadGroupFile({
        groupId: groupData._id,
        fileId: doc.id,
        token: jwt
      });

      if (response && response.downloadUrl) {
        setSelectedDoc({
          ...doc,
          uri: response.downloadUrl
        });
        setIsPreviewModalOpen(true);
      } else {
        console.log('No download URL received in the response');
      }
    } catch (error) {
      console.error('Error getting file preview URL:', error);
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsPreviewModalOpen(false);
      }
    };

    if (isPreviewModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPreviewModalOpen]);

  const filterPhoto = (user) => userProfilePictures.filter((userPic) => userPic.userId === user._id);


  return (
    <div className="mb-4">
      {/* DaisyUI Buttons for Tabs */}
      <div className="flex justify-center gap-2 mb-2">
        <div className="flex">
          {[
            {name: 'Documents', label: 'Documents'},
            {name: 'Members', label: 'Members'},
            {name: 'Meetings', label: 'Upcoming meetings'},
          ].map((tab) => (
            <button
              key={tab.name}
              className={`btn mx-2 ${activeTab === tab.name ? 'btn-active' : ''}`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          className="btn btn-primary btn-circle"
          onClick={toggleChatModal}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
               stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </button>
      </div>

      <div className="mt-4 p-4 bg-white rounded-b-lg shadow-sm">
        {activeTab === 'Documents' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Group Documents</h3>
              <button
                onClick={() => setShowUploader(!showUploader)}
                className={`btn ${showUploader ? 'btn-error' : 'btn-primary'}`}
              >
                {showUploader ? 'Close Upload' : 'Upload New File'}
              </button>
            </div>

            {showUploader && (
              <FilePondComponent
                jwt={jwt}
                groupId={groupId}
                setGroupFiles={setGroupFiles}
              />
            )}

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : groupFiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupFiles.map((doc, index) => (
                  <div key={index} className="border rounded-lg p-3 flex items-start space-x-2">
                    <div className="w-10 h-10 flex-shrink-0 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none"
                           viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{doc.fileName || 'Untitled Document'}</h3>
                      <p className="text-xs text-gray-500">
                        {groupData.members.find(member => member._id === doc.uploadedBy)?.username || 'Unknown user'} • {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                      <div className="flex space-x-4 mt-1">
                        <a
                          href="#"
                          className="text-xs text-blue-500 hover:underline inline-block"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePreview(doc);
                          }}
                        >
                          Preview
                        </a>
                        <a
                          href="#"
                          className="text-xs text-blue-500 hover:underline inline-block"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDownload(doc);
                          }}
                        >
                          Download
                        </a>
                                                <a
                          href="#"
                          className="text-xs text-blue-500 hover:underline inline-block"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(doc);
                          }}
                        >
                          Delete
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No documents available in this group yet.</p>
            )}
          </div>
        )}
        {activeTab === 'Members' &&
          groupUsers.map((user, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <div className="avatar">
                <div className="w-12 rounded-full">
                  <img
                    src={
                      userProfilePictures.length > 0
                        ? filterPhoto(user)[0]?.photoUrl || process.env.REACT_APP_DEFAULT_AVATAR_URL
                        : process.env.REACT_APP_DEFAULT_AVATAR_URL
                    }
                    alt={user.username}
                  />
                </div>
              </div>
              <p className="text-gray-500">{user.username}</p>
            </div>
          ))}
        {activeTab === 'Meetings' && <p className="text-gray-500">Upcoming meetings schedule...</p>}
      </div>

      <div>
        {isChatOpen && (
          <ChatApp
            userProfilePictures={userProfilePictures}
            toggleChatModal={toggleChatModal}
            groupId={groupId}
            groupData={groupData}
          />
        )}
      </div>

      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div ref={modalRef} className="bg-white rounded-lg w-full max-w-4xl h-5/6 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">
                {selectedDoc?.fileName || 'Document Preview'}
              </h3>
              <button
                className="btn btn-sm btn-circle"
                onClick={() => setIsPreviewModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="flex-grow overflow-auto p-4">
              {selectedDoc && <DocumentPreview document={selectedDoc}/>}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                className="btn btn-primary"
                onClick={() => window.open(selectedDoc?.uri, '_blank')}
              >
                Download
              </button>
              <button
                className="btn btn-outline ml-2"
                onClick={() => setIsPreviewModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}