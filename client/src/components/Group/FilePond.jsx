import {FilePond, registerPlugin} from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Import FilePond plugins
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImageValidateSize from 'filepond-plugin-image-validate-size';
import {apiService} from "../../services/api/apiService.js";
import React from "react";

// Register plugins
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginImageValidateSize
);

export const FilePondComponent = ({jwt, groupId, files, setGroupFiles}) => {
  const acceptedFileTypes = [
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.presentation',
    'application/rtf',
    'text/plain',
    'text/csv',

    // Code files
    'text/x-python',
    'text/x-java',
    'text/x-c',
    'text/x-c++',
    'text/x-csharp',
    'application/javascript',
    'application/json',
    'text/css',
    'text/html',
    'application/x-php',
    'text/x-ruby',
    'text/x-swift',
    'text/x-go',
    'text/x-rust',
    'text/x-typescript',
    'text/markdown',
    'application/x-yaml',
    'text/yaml',
    'application/x-perl',
    'application/x-sh',

    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',

    // Archives
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/x-tar',
    'application/gzip'
  ];

  const filepondServer = {
    process: (fieldName, file, metadata, load, error, progress, abort) => {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      const uploadData = {
        token: jwt,
        id: groupId,
        formData: formData
      };

      // Use your API service to upload
      apiService.file.uploadGroupFile(uploadData)
        .then(response => {
          // Success
          load(response);
          console.log('File uploaded successfully:', response);

          // Refresh the file list after a delay to ensure server processing is complete
          setTimeout(() => {
            // Refresh the document list
            const fetchGroupFiles = async () => {
              try {
                const response = await apiService.group.getGroupFiles({token: jwt, id: groupId});
                if (response) {
                  setGroupFiles(response.files);
                }
              } catch (error) {
                console.error('Error refreshing files:', error);
              }
            };
            fetchGroupFiles();
          }, 1000);
        })
        .catch(err => {
          // Error
          error('Upload failed');
          console.error('Upload error:', err);
        });

      // Return abort controller
      return {
        abort: () => {
          abort();
          console.log('Upload cancelled');
        }
      };
    }
  };

  return (
    <div className="mb-6 p-4 bg-base-200 rounded-lg">
      <FilePond
        files={files}
        allowImagePreview={true}
        allowFileTypeValidation={true}
        acceptedFileTypes={acceptedFileTypes}
        allowFileSizeValidation={true}
        maxFileSize="10MB"
        allowMultiple={true}
        maxFiles={10}
        instantUpload={false}
        server={filepondServer}
        name="file"
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        labelFileTypeNotAllowed="Invalid file type"
        labelMaxFileSizeExceeded="File is too large"
        labelMaxFileSize="Maximum file size is 3MB"
        className="w-full"
      />
      <p className="text-sm text-gray-500 mt-1">
        Supported formats: PDF, Word, Excel, PowerPoint, images, archives and code files. Max size: 3MB.
      </p>
    </div>
  );
};