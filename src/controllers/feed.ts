import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import Post from '../model/post';

export const getPosts: RequestHandler = async (req, res, next) => {
	try {
		const posts = await Post.find();

		res.status(200).json({
			posts,
			message: 'Fetched posts successfully.'
		});
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500;
		}
		next(error);
	}
};
export const createPost: RequestHandler = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let error = new Error('Validation failed, entered data is incorrect.');
			(error as any).statusCode = 422;
			throw error;
		}
		const { title, content } = req.body;
		// Create post in db
		const post = new Post({
			title,
			content,
			imageUrl: 'images/16174449_1120050004771102_6238590716381029991_n.jpg',
			creator: {
				name: 'viet anh'
			}
		});
		const result = await post.save();

		res.status(201).json({
			message: 'Post created successfully!',
			post: result
		});
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500;
		}
		next(error);
	}
};
export const getPost: RequestHandler = async (req, res, next) => {
	try {
		const { postId } = req.params;
		const post = await Post.findById(postId);
		if (!post) {
			const error = new Error('Could not find post.');
			(error as any).statusCode = 404;
			throw error;
		}
		res.status(200).json({ message: 'post fetched', post });
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500;
		}
		next(error);
	}
};
