import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';

export default ((req, res, next) => {
	const authHeader = req.get('Authorization');
	if (!authHeader) {
		const error = new Error('Not authenticated.');
		(error as any).statusCode = 401;
		throw error;
	}
	const token = authHeader.split(' ')[1];
	let decodeToken;
	try {
		decodeToken = jwt.verify(token, 'somesupersecretsecret');
	} catch (error) {
		(error as any).statusCode = 500;
		throw error;
	}
	if (!decodeToken) {
		//can remove
		const error = new Error('Not authenticated.');
		(error as any).statusCode = 401;
		throw error;
	}
	(req as any).userId = decodeToken.userId;
	next();
}) as RequestHandler;
