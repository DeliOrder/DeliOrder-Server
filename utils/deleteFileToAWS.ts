import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

interface Order {
  action: string;
  attachmentType: string;
  attachmentName: string;
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const deleteFilesFromAWS = async (orders: Order[]) => {
  try {
    const targetOrders = orders.filter(
      (order) => order.action === "생성하기" && order.attachmentType === "file",
    );

    await Promise.all(
      targetOrders.map(async (order) => {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET!,
          Key: order.attachmentName,
        });

        await s3Client.send(deleteCommand);
      }),
    );
  } catch (error) {
    console.error("S3 파일 삭제 중 오류 발생:", error);
  }
};

export default deleteFilesFromAWS;
