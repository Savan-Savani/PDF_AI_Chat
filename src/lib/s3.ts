import AWS from "aws-sdk";

export async function uploadToS3(file: File) {
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
    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET!,
      Key: file_key,
      Body: file,
    };
    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        console.log(
          "uploading to s3",
          parseInt(((evt.loaded * 100) / evt.total).toString()) + "%"
        );
      })
      .promise();

    await upload.then((data) => {
      console.log("successfully uploaded to s3", file_key);
    });

    return Promise.resolve({
      file_key,
      file_name: file.name,
    });
  } catch (error) {}
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET}.s3.us-east-2.amazonaws.com/${file_key}`;
  return url;
}
