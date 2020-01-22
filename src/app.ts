import path from 'path';
import fs from 'fs';
import express, { ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import mongoose, { model } from 'mongoose';
import multer from 'multer';
import graphqlHttp from 'express-graphql';
import schema from './graphql/schema';
import resolvers from './graphql/resolvers';
import auth from './middleware/auth';
const app = express();

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'src/images');
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString() + '-' + file.originalname);
	}
});
const fileFilter = (red, file, cb) => {
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

// app.use(bodyParser.urlencoded())// x-www-form-urlencoded use form

app.use(bodyParser.json()); // application/json
app.use(
	multer({
		storage: fileStorage,
		fileFilter
	}).single('image') // single image <==>  formData.append('image', postData.image);
);
app.use('/src/images', express.static(path.join(__dirname, 'images'))); // __dirname =>> src

app.use((req, res, next) => {
	//access CROS
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200); // fix error 405
	}
	next();
});
app.use(auth);
app.put('/post-image', (req, res, next) => {
	if(!(req as any).isAuth) {
		throw new Error('not Authenticated!');
	}
	if(!req.file){
		return res.status(200).json({message: 'No file provided!'})
	}
	if(req.body.oldPath){
		clearImage(req.body.oldPath);
	}
	return res.status(201).json({message: 'File stored.', filePath: req.file.path})
});

app.use(
	'/graphql',
	graphqlHttp({
		schema: schema,
		rootValue: resolvers,
		graphiql: true,
		customFormatErrorFn(err) {
			if (!err.originalError) {
				// err you create
				console.log('TCL: formatError -> err.originalError', err.originalError);
				return err;
			}
			const { data } = err.originalError as any;
			const code = (err.originalError as any).code || 500;
			const message = err.message || 'An error occurred';
			return { message, status: code, data };
		}
	})
);

app.use(((error, req, res, next) => {
	console.log('TCL: error', error);
	const { statusCode, message, data } = error;

	res.status(statusCode || 500).json({
		message,
		data
	});
}) as ErrorRequestHandler);

mongoose
	.connect('mongodb+srv://vietanhcao1994:sao14111@cluster0-ardsb.mongodb.net/message?retryWrites=true&w=majority') //create db message
	.then((result) => {
		app.listen(8080);
	})
	.catch((err) => console.log(err));

const clearImage = (filePath) => {
	filePath = path.join(__dirname, '..', filePath); //go to root file
	fs.unlink(filePath, (err) => console.log(err));
};