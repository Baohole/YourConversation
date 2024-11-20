const cloudinary = require('cloudinary').v2
//const { assign } = require('nodemailer/lib/shared');
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SCERECT // Click 'View Credentials' below to copy your API secret
});


const streamUpload = (file) => {
    // console.log(file);
    return new Promise((resolve, reject) => {
        const format = file.name.split('.').pop(); // Get the file extension
        const rawname = file.name.slice(0, file.name.lastIndexOf('.')) || file.name; // Get the file name without extension

        let stream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                format: format,
                public_id: rawname, // Set the public ID to the file name without extension
                use_filename: true,
                unique_filename: false
            },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
    });
}
module.exports = async (file) => {
    const result = await streamUpload(file);
    return result.secure_url;
}