import path from 'path';
import express, { ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import feedRoutes from './router/feed';
import mongoose from 'mongoose';
import multer from 'multer';

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
	}).single('image')
);
app.use('/src/images', express.static(path.join(__dirname, 'images'))); // __dirname =>> src

app.use((req, res, next) => {
	//access CROS
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});
app.use('/feed', feedRoutes);

app.use(((error, req, res, next) => {
	console.log('TCL: error', error);
	const { statusCode, message } = error;
	res.status(statusCode || 500).json({
		message
	});
}) as ErrorRequestHandler);

mongoose
	.connect('mongodb+srv://vietanhcao1994:sao14111@cluster0-ardsb.mongodb.net/message?retryWrites=true&w=majority') //create db message
	.then((result) => {
		app.listen(8080);
	})
	.catch((err) => console.log(err));
