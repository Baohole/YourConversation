const cloudinary = require('cloudinary').v2
//const { assign } = require('nodemailer/lib/shared');
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SCERECT // Click 'View Credentials' below to copy your API secret
});


const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
}

module.exports = async (buffer) => {
    const result = await streamUpload(buffer);
    return result.secure_url;
}