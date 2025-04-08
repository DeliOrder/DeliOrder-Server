import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface Order {
  action: string;
  attachmentType: string;
  attachmentName: string;
  attachmentUrl?: string;
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const uploadFileToS3AndGetUrl = async (
  file: Express.Multer.File,
  key: string,
): Promise<string> => {
  const uploadCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET!,
    Key: key,
    Body: file.buffer,
    ACL: "public-read",
  });
  await s3Client.send(uploadCommand);

  const getCommand = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET!,
    Key: key,
  });

  return getSignedUrl(s3Client, getCommand, { expiresIn: 1800 });
};

const processOrdersWithFiles = async (
  orders: Order[],
  files: Express.Multer.File[],
): Promise<Order[]> => {
  return Promise.all(
    orders.map(async (order) => {
      if (order.attachmentType === "file") {
        const matchedFile = files.find(
          (file) =>
            Buffer.from(file.originalname, "latin1").toString("utf8") ===
            order.attachmentName,
        );

        if (!matchedFile) {
          throw new Error(`파일 ${order.attachmentName}을 찾을 수 없습니다.`);
        }

        const signedUrl = await uploadFileToS3AndGetUrl(
          matchedFile,
          order.attachmentName,
        );
        return { ...order, attachmentUrl: signedUrl };
      }
      return order;
    }),
  );
};

export default processOrdersWithFiles;
