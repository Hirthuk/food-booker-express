import express from 'express';
import { LoginUser, registerUser } from '../controllers/User.js';

const UserRoute = express.Router();

UserRoute.post('/registeruser', registerUser);
UserRoute.post('/login', LoginUser);

export default UserRoute;