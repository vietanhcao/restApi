import express from 'express';
import { getPosts, createPost, getPost } from '../controllers/feed';
import { body } from 'express-validator';

const router = express.Router();

//get /feed/posts
router.get('/posts', getPosts);
//post /feed/post
router.post(
	'/post',
	[
		body('title').trim().isLength({
			min: 7
		}),
		body('content').trim().isLength({
			min: 5
		})
	],
	createPost
);

router.get('/post/:postId', getPost);

export default router;
