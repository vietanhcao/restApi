import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';


export const getPosts: RequestHandler = (req, res, next) => {
	res.status(200).json({
		posts: [
			{
				_id: '1',
				title: 'First Post',
				content: 'This is the first post!',
				imageUrl: 'images/16174449_1120050004771102_6238590716381029991_n.jpg',
				creator: {
					name: 'viet anh'
				},
				createdAt: new Date()
			}
		]
	});
};
export const createPost: RequestHandler = (req, res, next) => {
	const errors = validationResult(req);

	if(!errors.isEmpty()){
		res.status(422).json({
			message: 'validation failed, entered data is incorrect.',
			errors: errors.array()
		})
	}
	const { title, content } = req.body;
	// Create post in db
	res.status(201).json({
		message: 'Post created successfully!',
		post: {
			_id: new Date().toISOString(),
			title,
			content,
			creator: {
				name: 'viet anh'
			},
			createdAt: new Date()
		}
	});
};
