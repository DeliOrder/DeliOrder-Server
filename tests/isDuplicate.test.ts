import mongoose from "mongoose";
import isDuplicate, { ActionObject } from "../utils/isDuplicate";

jest.mock("../utils/convertPath", () => jest.fn((path) => path));

describe("isDuplicate 함수 테스트", () => {
  const baseAction: ActionObject = {
    action: "테스트하기",
    attachmentName: "테스트.test",
    attachmentType: "test",
    attachmentUrl: "http://test.test/test.test",
    sourcePath: "/test/test",
    executionPath: "/test",
    editingName: "document",
    useVscode: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("동일한 객체일 경우 true를 반환해야 한다", () => {
    const result = isDuplicate(baseAction, baseAction);
    expect(result).toBe(true);
  });

  it("액션 값이 다르면 false를 반환해야 한다", () => {
    const modifiedAction = { ...baseAction, action: "delete" };
    const result = isDuplicate(baseAction, modifiedAction);
    expect(result).toBe(false);
  });

  it("executionPath 값이 다르면 false를 반환해야 한다", () => {
    const modifiedAction = { ...baseAction, executionPath: "/different/path" };
    const result = isDuplicate(baseAction, modifiedAction);
    expect(result).toBe(false);
  });

  it("sourcePath 값이 다르면 false를 반환해야 한다", () => {
    const modifiedAction = { ...baseAction, sourcePath: "/another/path" };
    const result = isDuplicate(baseAction, modifiedAction);
    expect(result).toBe(false);
  });

  it("targetObject가 ObjectId 타입이면 false를 반환해야 한다", () => {
    const objectId = new mongoose.Types.ObjectId();
    const result = isDuplicate(objectId, baseAction);
    expect(result).toBe(false);
  });
});
