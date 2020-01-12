import User from '../model/user';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import Post from '../model/post';

export default {
	createUser: async ({ userInput }, req) => {
		const { email, password, name } = userInput;
		const errors = [];
		if (!validator.isEmail(email)) {
			errors.push({ message: 'E-mail is invalid.' });
		}
		if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
			errors.push({ message: 'Password too short!' });
		}
		if (errors.length > 0) {
			const error = new Error('Invalid input.');
			(error as any).data = errors;
			(error as any).code = 422;
			throw error;
		}
		const existingUser = await User.findOne({ email: email });
		if (existingUser) {
			const error = new Error('User has already existed!');
			throw error;
		}
		const hashedPw = await bcrypt.hash(password, 12);
		const user = new User({ email, password: hashedPw, name });
		const createdUser: any = await user.save();
		return { ...createdUser._doc, _id: createdUser._id.toString() };
	},
	login: async ({ email, password }, req) => {
		const user: any = await User.findOne({ email });
		if (!user) {
			const error: any = new Error('User not found.');
			error.code = 401;
			throw error;
		}
		const isEqual = await bcrypt.compare(password, user.password);
		if (!isEqual) {
			const error: any = new Error('Password is incorrect.');
			error.code = 401;
			throw error;
		}
		const token = jwt.sign(
			{
				userId: user._id.toString(),
				email: user.email
			},
			'somesupersecretsecret',
			{ expiresIn: '1h' }
		);
		return { token, userId: user._id.toString() };
	},
	createPost: async ({ postInput }, req) => {
		if (!req.isAuth) {
			const error: any = new Error('Not authenticated!');
			error.code = 401;
			throw error;
		}
		const errors = [];
		const { title, content, imageUrl } = postInput;
		if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
			errors.push({ message: 'Title is invalid.' });
		}
		if (validator.isEmpty(content) || !validator.isLength(content, { min: 5 })) {
			errors.push({ message: 'Content is invalid.' });
		}
		if (validator.isEmpty(imageUrl) || !validator.isLength(imageUrl, { min: 5 })) {
			errors.push({ message: 'ImageUrl is invalid.' });
		}
		if (errors.length > 0) {
			const error = new Error('Invalid input.');
			(error as any).data = errors;
			(error as any).code = 422;
			throw error;
		}
		const user: any = await User.findById(req.userId);
		if (!user) {
			const error = new Error('Invalid user.');
			(error as any).data = errors;
			(error as any).code = 401;
			throw error;
		}
		const post = new Post({
			title,
			content,
			imageUrl,
			creator: user
		});
		const createdPost: any = await post.save();
		// Add post to user post
		user.posts.push(createdPost);
		await user.save();
		return {
			...createdPost._doc,
			_id: createdPost._id.toString(), //graphql understand object
			createdAt: createdPost.createdAt.toISOString(),
			updatedAt: createdPost.updatedAt.toISOString()
		};
	},
	posts: async (args, req) => {
		if (!req.isAuth) {
			const error: any = new Error('Not authenticated!');
			error.code = 401;
			throw error;
		}
		const totalPosts = await Post.find().countDocuments();
		const posts = await Post.find().sort({ createdAt: -1 }).populate('creator');

		return {
			posts: posts.map((p: any) => {
				return {
					...p._doc,
					_id: p._id.toString(),
					createdAt: p.createdAt.toISOString(),
					updatedAt: p.updatedAt.toISOString()
				};
			}),
			totalPosts: totalPosts
		};
	}
};
