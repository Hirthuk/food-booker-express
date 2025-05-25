import express from 'express'
import { createCloudinaryURL, getShopItems, getShopoverview } from '../controllers/Shop.js'
import upload from '../middleware/multer.js'

const ShopRoutes = express.Router();

ShopRoutes.post('/addShopImage', upload.fields([{name: "image1", maxCount: 1}]), createCloudinaryURL);
ShopRoutes.get('/getShopoverview', getShopoverview);
ShopRoutes.get('/getShopItems', getShopItems);

export default ShopRoutes;