import User from '../model/user';
import bcrypt from 'bcryptjs';

export default {
	createUser: async ({ userInput }, req) => {
		const { email, password, name } = userInput;
		const existingUser = await User.findOne({ email: email });
		if (existingUser) {
			const error = new Error('User has already existed!');
			throw error;
		}
		const hashedPw = await bcrypt.hash(password, 12);
		const user = new User({ email, password: hashedPw, name });
		const createdUser: any = await user.save();
		return { ...createdUser._doc, _id: createdUser._id.toString() };
	}
};
