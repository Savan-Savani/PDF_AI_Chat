import AWS from "aws-sdk";
import fs from "fs";

export async function downloadFromS3(file_key: string) {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_KEY,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET,
    });
    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
      },
      region: "us-east-2",
    });

    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET!,
      Key: file_key,
    };

    const obj = await s3.getObject(params).promise();
    console.log("obj", obj);
    const file_name = `/tmp/pdf-${Date.now()}.pdf}`;
    fs.writeFileSync(file_name, obj.Body as Buffer);

    return file_name;
  } catch (error) {
    console.log(error);
    return null;
  }
}
