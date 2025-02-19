import mongoose from "mongoose";
import convertPath from "./convertPath";

export interface ActionObject {
  action: string;
  attachmentName?: string;
  attachmentType?: string;
  attachmentUrl?: string;
  sourcePath?: string;
  executionPath: string;
  editingName?: string;
  useVscode: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const isDuplicate = (
  targetObject: ActionObject | mongoose.Types.ObjectId,
  bookmarkedObject: ActionObject,
): boolean => {
  if (targetObject instanceof mongoose.Types.ObjectId) {
    return false;
  }

  return (
    targetObject.action === bookmarkedObject.action &&
    targetObject.attachmentName === bookmarkedObject.attachmentName &&
    convertPath(targetObject.sourcePath as string) ===
      convertPath(bookmarkedObject.sourcePath as string) &&
    convertPath(targetObject.executionPath) ===
      convertPath(bookmarkedObject.executionPath) &&
    targetObject.editingName === bookmarkedObject.editingName
  );
};

export default isDuplicate;
