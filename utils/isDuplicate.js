const { convertPath } = require("./convertPath");

const isDuplicate = (targetObject, bookmarkedObject) => {
  if (
    targetObject.action === bookmarkedObject.action &&
    targetObject.attachmentName === bookmarkedObject.attachmentName &&
    convertPath(targetObject.sourcePath) ===
      convertPath(bookmarkedObject.sourcePath) &&
    convertPath(targetObject.executionPath) ===
      convertPath(bookmarkedObject.executionPath) &&
    targetObject.editingName === bookmarkedObject.editingName
  ) {
    return true;
  }
  return false;
};

module.exports = { isDuplicate };
