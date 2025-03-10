// Simple Document Preview component that uses iframes
export const DocumentPreview = ({ document }) => {
  if (!document || !document.uri) return null;

  const fileExtension = document.fileName?.split('.').pop().toLowerCase();
  const officeExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

  if (officeExtensions.includes(fileExtension)) {
    // Use Microsoft Office Online Viewer for Office documents
    const encodedUrl = encodeURIComponent(document.uri);
    return (
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`}
        width="100%"
        height="100%"
        style={{border: 'none'}}
        title={document.fileName}
      />
    );
  }
  // PDF separate handling to prevent preview downloading without opening file first
  if (fileExtension === 'pdf') {
    window.open(document.uri, '_blank');
    return;
  }
  // For all other files  use direct iframe
  return (
    <iframe
      src={document.uri}
      width="100%"
      height="100%"
      style={{border: 'none'}}
      title={document.fileName}
    />
  );
};
