import express from "express";
import { getPosts, createPost } from '../controllers/feed';


const router = express.Router();

//get /feed/post
router.get('/posts', getPosts)
//post /feed/post
router.post('/post', createPost)




export default router;