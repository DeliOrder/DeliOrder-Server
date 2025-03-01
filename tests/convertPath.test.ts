import os from "os";
import path from "path";
import convertPath from "../utils/convertPath";

jest.mock("os");

describe("convertPath 함수 테스트", () => {
  const mockHomeDir = "/Users/test";

  beforeEach(() => {
    (os.homedir as jest.Mock).mockReturnValue(mockHomeDir);
  });

  it("macOS 전용 경로가 Windows에서 변환되지 않아야 한다", () => {
    (os.platform as jest.Mock).mockReturnValue("win32");

    const result = convertPath("../../Library/Application Support");
    expect(result).toEqual({ error: true });
  });

  it("Windows 전용 경로가 macOS에서 변환되지 않아야 한다", () => {
    (os.platform as jest.Mock).mockReturnValue("darwin");

    const result = convertPath("AppData/Roaming");
    expect(result).toEqual({ error: true });
  });

  it("Windows의 'Program Files' 경로가 macOS의 'Applications'로 변환되어야 한다", () => {
    (os.platform as jest.Mock).mockReturnValue("darwin");

    const result = convertPath("..\\..\\Program Files\\MyApp");
    expect(result).toBe("../../Applications/MyApp");
  });

  it("Windows의 'Program Files (x86)' 경로가 macOS의 'Applications'로 변환되어야 한다", () => {
    (os.platform as jest.Mock).mockReturnValue("darwin");

    const result = convertPath("..\\..\\Program Files (x86)\\MyApp");
    expect(result).toBe("../../Applications/MyApp");
  });

  it("macOS의 'Applications' 경로가 Windows의 'Program Files'로 변환되어야 한다", () => {
    (os.platform as jest.Mock).mockReturnValue("win32");

    const result = convertPath("../../Applications/MyApp");
    expect(result).toBe("..\\..\\Program Files\\MyApp");
  });

  it("Windows 환경에서 홈 디렉토리를 기준으로 경로가 변환되어야 한다", () => {
    (os.platform as jest.Mock).mockReturnValue("win32");

    const result = convertPath("Documents/MyFile.txt");
    expect(result).toBe(
      path.join(mockHomeDir, "Documents/MyFile.txt").split("/").join("\\"),
    );
  });

  it("macOS 환경에서 홈 디렉토리를 기준으로 경로가 변환되어야 한다", () => {
    (os.platform as jest.Mock).mockReturnValue("darwin");

    const result = convertPath("Documents/MyFile.txt");
    expect(result).toBe(path.join(mockHomeDir, "Documents/MyFile.txt"));
  });
});
