import User from '../model/user';
import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

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
