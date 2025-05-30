import express from 'express';
import { LoginUser, registerUser, LogoutUser, getUserProfile } from '../controllers/User.js';

const UserRoute = express.Router();

UserRoute.post('/registeruser', registerUser);
UserRoute.post('/login', LoginUser);
UserRoute.post('/logout', LogoutUser);
UserRoute.get('/profile', getUserProfile);

export default UserRoute;