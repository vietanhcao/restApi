import express from 'express';
import { getPosts, createPost, getPost, updatePost, deletePost } from '../controllers/feed';
import { body } from 'express-validator';

const router = express.Router();

//get /feed/posts
router.get('/posts', getPosts);
//post /feed/post
router.post(
	'/post',
	[
		body('title').trim().isLength({
			min: 5
		}),
		body('content').trim().isLength({
			min: 5
		})
	],
	createPost
);

router.get('/post/:postId', getPost);

router.put(
	'/post/:postId',
	[
		body('title').trim().isLength({
			min: 5
		}),
		body('content').trim().isLength({
			min: 5
		})
	],
	updatePost
);
router.delete('/post/:postId', deletePost);

export default router;
