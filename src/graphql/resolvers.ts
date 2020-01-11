import User from '../model/user';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';

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
			'somesuppersecretsecret',
			{ expiresIn: '1h' }
		);
		return { token, userId: user._id.toString() };
	}
};
