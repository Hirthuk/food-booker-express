import { v2 as cloudinary } from 'cloudinary';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { sql } from '../config/connectDb.js';

config();

const createCloudinaryURL = async (req, res) => {
    try {
        const { stall_number } = req.body;
        const image1 = req.files.image1 && req.files.image1[0]

        if (!image1) {
            return res.status(400).json({ message: "Image is not provided" });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(image1.path, { resource_type: "image" });

        // Update the shop's image in the database
        await sql`UPDATE shops SET shop_image = ${result.secure_url} WHERE stall_number = ${stall_number}`;

        return res.status(200).json({
            message: "Image uploaded and shop updated successfully",
            imageUrl: result.secure_url
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getShopoverview = async (req,res) => {
   try{
    let result = await sql`Select * from shops`;
    res.status(200).json({
        result
    })
   }
   catch(error){
    res.status(500).json({
        success: false,
        message: error.message
    })
   }
}

const getShopItems = async (req,res) => {
    try{
        let result = await sql`select * from shopitems`
        res.status(200).json({
            success: true,
            result
        })
    }

    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export { createCloudinaryURL, getShopoverview, getShopItems };