const fs = require("fs");
const path = require("path");

/**
 * Delete files from the uploads directory
 * @param {Array} files - Array of file objects with url property
 */
const deleteFiles = (files) => {
  if (!files || !Array.isArray(files)) {
    return;
  }

  files.forEach((file) => {
    if (file.url) {
      // Extract filename from URL (remove leading slash)
      const filename = file.url.startsWith("/uploads/") 
        ? file.url.replace("/uploads/", "") 
        : file.url;
      
      const filePath = path.join(__dirname, "../uploads", filename);
      
      // Check if file exists before attempting to delete
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
          // File exists, delete it
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error(`Error deleting file ${filePath}:`, unlinkErr);
            } else {
              console.log(`Successfully deleted file: ${filename}`);
            }
          });
        } else {
          console.log(`File not found, skipping deletion: ${filename}`);
        }
      });
    }
  });
};

/**
 * Delete a single file from the uploads directory
 * @param {string} fileUrl - URL of the file to delete
 */
const deleteFile = (fileUrl) => {
  if (!fileUrl) {
    return;
  }

  const filename = fileUrl.startsWith("/uploads/") 
    ? fileUrl.replace("/uploads/", "") 
    : fileUrl;
  
  const filePath = path.join(__dirname, "../uploads", filename);
  
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(`Error deleting file ${filePath}:`, unlinkErr);
        } else {
          console.log(`Successfully deleted file: ${filename}`);
        }
      });
    } else {
      console.log(`File not found, skipping deletion: ${filename}`);
    }
  });
};

module.exports = {
  deleteFiles,
  deleteFile,
};