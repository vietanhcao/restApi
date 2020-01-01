import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';

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
		if (!req.file) {
			const error = new Error('No image provided.');
			(error as any).statusCode = 422;
			throw error;
		}
		const imageUrl = req.file.path;

		const { title, content } = req.body;
		// Create post in db
		const post = new Post({
			title,
			content,
			imageUrl,
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
export const updatePost: RequestHandler = async (req, res, next) => {
	try {
		const { postId } = req.params;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let error = new Error('Validation failed, entered data is incorrect.');
			(error as any).statusCode = 422;
			throw error;
		}
		const { title, content } = req.body;
		let imageUrl = req.body.image;
		if (req.file) {
			imageUrl = req.file.path;
		}
		if (!imageUrl) {
			const error = new Error('No file picked.');
			(error as any).statusCode = 422;
			throw error;
		}
		const post = await Post.findById(postId);
		if (!post) {
			const error = new Error('Could not find post.');
			(error as any).statusCode = 404;
			throw error;
		}
		if (imageUrl !== (post as any).imageUrl) {
			clearImage((post as any).imageUrl); //remove old file
		}
		(post as any).title = title;
		(post as any).imageUrl = imageUrl;
		(post as any).content = content;
		const result = await post.save();

		res.status(200).json({ message: 'post updated', post: result });
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500;
		}
		next(error);
	}
};
const clearImage = (filePath) => {
	filePath = path.join(__dirname, '..', '..', filePath); //go to root file
	fs.unlink(filePath, (err) => console.log(err));
};
