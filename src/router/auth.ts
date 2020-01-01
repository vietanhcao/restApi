import express from 'express';
import { body } from 'express-validator';
import User from '../model/user';
import { signup } from '../controllers/auth';

const router = express.Router();

router.put(
	'/signup',
	[
		body('email')
			.isEmail()
			.withMessage('Please enter a valid email')
			.custom(async (value, { req }) => {
				const userDoc = await User.findOne({ email: value });
				if (userDoc) {
					return Promise.reject('E-Mail address  already exists!');
				}
			})
			.normalizeEmail(),
		body('password').trim().isLength({ min: 5 }),
		body('name').trim().not().isEmpty()
	],
	signup
);

export default router;
