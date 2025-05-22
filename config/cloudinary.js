import {v2 as cloudinary} from 'cloudinary';

const connectCloudinary = async () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_secret: process.env.API_SECRET,
            api_key: process.env.CLOUD_API_KEY
        })
    } catch (error) {
        console.log(error.message)
    }
}

export default connectCloudinary;