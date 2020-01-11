import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';

export default ((req, res, next) => {
	const authHeader = req.get('Authorization');
	if (!authHeader) {
    console.log("TCL: authHeader", authHeader);
		(req as any).isAuth = false;
		return next();
	}
	const token = authHeader.split(' ')[1];
	let decodeToken;
	try {
		decodeToken = jwt.verify(token, 'somesupersecretsecret');
	} catch (error) {
    console.log("TCL: error", error);
		(req as any).isAuth = false;
		return next();
	}
	if (!decodeToken) {
    console.log("TCL: decodeToken", decodeToken);
		//can remove
		(req as any).isAuth = false;
		return next();
	}
	(req as any).userId = decodeToken.userId;
	(req as any).isAuth = true;
	next();
}) as RequestHandler;
