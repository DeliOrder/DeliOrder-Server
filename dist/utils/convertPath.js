"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const normalizePath = (filePath) => {
    const currentOS = os_1.default.platform();
    if (currentOS === "darwin") {
        return filePath.split("\\").join("/");
    }
    return filePath.split("/").join("\\");
};
const convertPath = (targetPath) => {
    const platform = os_1.default.platform();
    const homeDir = os_1.default.homedir();
    const onlyInMacOs = "../../Library";
    const onlyInWindows = "AppData";
    if ((targetPath.startsWith(onlyInMacOs) && platform !== "darwin") ||
        (targetPath.startsWith(onlyInWindows) && platform !== "win32"))
        return { error: true };
    let convertedPath;
    switch (platform) {
        case "win32":
            if (targetPath.startsWith("../../Applications/")) {
                convertedPath = targetPath.replace("../../Applications/", "..\\..\\Program Files\\");
            }
            else {
                convertedPath = path_1.default.join(homeDir, targetPath);
            }
            break;
        case "darwin":
            if (targetPath.startsWith("..\\..\\Program Files\\")) {
                convertedPath = targetPath.replace("..\\..\\Program Files\\", "../../Applications/");
            }
            else if (targetPath.startsWith("..\\..\\Program Files (x86)\\")) {
                convertedPath = targetPath.replace("..\\..\\Program Files (x86)\\", "../../Applications/");
            }
            else {
                convertedPath = path_1.default.join(homeDir, targetPath);
            }
            break;
        default:
            convertedPath = path_1.default.join(homeDir, targetPath);
    }
    const normalizedPath = normalizePath(convertedPath);
    return normalizedPath;
};
exports.default = convertPath;
