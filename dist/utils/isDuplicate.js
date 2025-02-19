"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const convertPath_1 = __importDefault(require("./convertPath"));
const isDuplicate = (targetObject, bookmarkedObject) => {
    if (targetObject instanceof mongoose_1.default.Types.ObjectId) {
        return false;
    }
    return (targetObject.action === bookmarkedObject.action &&
        targetObject.attachmentName === bookmarkedObject.attachmentName &&
        (0, convertPath_1.default)(targetObject.sourcePath) ===
            (0, convertPath_1.default)(bookmarkedObject.sourcePath) &&
        (0, convertPath_1.default)(targetObject.executionPath) ===
            (0, convertPath_1.default)(bookmarkedObject.executionPath) &&
        targetObject.editingName === bookmarkedObject.editingName);
};
exports.default = isDuplicate;
