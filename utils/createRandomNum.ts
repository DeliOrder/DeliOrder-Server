import { Package } from "../model/Package";

const createRandomSerialNumber = (): string => {
  const randomNumber = Math.floor(Math.random() * 1000000);
  return String(randomNumber).padStart(6, "0");
};

const generateUniqueSerialNumber = async (): Promise<string> => {
  const serialNumber = createRandomSerialNumber();
  const isDuplicate = await Package.exists({ serialNumber });

  if (isDuplicate) {
    return generateUniqueSerialNumber();
  }

  return serialNumber;
};

export default generateUniqueSerialNumber;
