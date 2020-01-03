import User from '../model/user';
import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup: RequestHandler = async (req, res, next) => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			const error = new Error('Validation failed.');
			(error as any).statusCode = 422;
			(error as any).data = errors.array();
			throw error;
		}
		const { email, name, password } = req.body;
		const hashedPw = await bcrypt.hash(password, 12);
		const user = new User({
			email,
			name,
			password: hashedPw
		});
		const result = await user.save();
		res.status(201).json({ message: 'User created!', userId: result._id });
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500;
		}
		next(error);
	}
};

export const login: RequestHandler = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email: email });
		if (!user) {
			const error = new Error('A user with this email could be found.');
			(error as any).statusCode = 401;
			throw error;
		}
		const isEqual = await bcrypt.compare(password, (user as any).password);
		if (!isEqual) {
			const error = new Error('Wrong password!');
			(error as any).statusCode = 401;
			throw error;
		}
		const token = jwt.sign(
			{ email: (user as any).email, userId: (user as any)._id.toString() },
			'somesupersecretsecret',
			{ expiresIn: '1h' }
		);
		res.status(200).json({ token: token, userId: (user as any)._id.toString() });
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500;
		}
		next(error);
	}
};
