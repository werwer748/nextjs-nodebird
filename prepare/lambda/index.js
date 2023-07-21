const AWS = require("aws-sdk");
const sharp = require("sharp");

const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {
  const Bucket = event.Records[0].s3.bucket.name; // hugonode.s3
  const Key = decodeURIComponent(event.Records[0].s3.object.key); // original/123123.jpg
  console.log("s3 lambda handler ====", Bucket, Key);
  const filename = Key.split("/")[Key.split("/").length - 1];
  const ext = Key.split(".")[Key.split(".").length - 1].toLowerCase();
  const requiredFormat = ext === "jpg" ? "jpeg" : ext;
  console.log("filename ====", filename, "ext ====", requiredFormat);

  try {
    const s3Object = await s3.getObject({ Bucket, Key }).promise();
    console.log("original ====", s3Object.Body.length);
    const resizedImage = await sharp(s3Object.Body)
      .resize(400, 400, {
        fit: "inside",
      })
      .toBuffer();
    await s3
      .putObject({
        Bucket,
        Key: `thumb/${filename}`,
        body: resizedImage,
      })
      .promise();
    console.log("put ====", resizedImage.length);
    return callback(null, `thumb/${filename}`);
  } catch (error) {
    console.log(error);
    return callback(error);
  }
};
