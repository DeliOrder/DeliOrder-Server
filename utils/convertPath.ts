import os from "os";
import path from "path";

const normalizePath = (filePath: string) => {
  const currentOS = os.platform();

  if (currentOS === "darwin") {
    return filePath.split("\\").join("/");
  }
  return filePath.split("/").join("\\");
};

const convertPath = (targetPath: string) => {
  const platform = os.platform();
  const homeDir = os.homedir();

  const onlyInMacOs = "../../Library";
  const onlyInWindows = "AppData";

  if (
    (targetPath.startsWith(onlyInMacOs) && platform !== "darwin") ||
    (targetPath.startsWith(onlyInWindows) && platform !== "win32")
  )
    return { error: true };

  let convertedPath;
  switch (platform) {
    case "win32":
      if (targetPath.startsWith("../../Applications/")) {
        convertedPath = targetPath.replace(
          "../../Applications/",
          "..\\..\\Program Files\\",
        );
      } else {
        convertedPath = path.join(homeDir, targetPath);
      }
      break;

    case "darwin":
      if (targetPath.startsWith("..\\..\\Program Files\\")) {
        convertedPath = targetPath.replace(
          "..\\..\\Program Files\\",
          "../../Applications/",
        );
      } else if (targetPath.startsWith("..\\..\\Program Files (x86)\\")) {
        convertedPath = targetPath.replace(
          "..\\..\\Program Files (x86)\\",
          "../../Applications/",
        );
      } else {
        convertedPath = path.join(homeDir, targetPath);
      }
      break;

    default:
      convertedPath = path.join(homeDir, targetPath);
  }

  const normalizedPath = normalizePath(convertedPath);

  return normalizedPath;
};

export default convertPath;
