import express from 'express';
import bodyParser from 'body-parser';
import feedRoutes from './router/feed';
import mongoose from "mongoose";

const app = express();

// app.use(bodyParser.urlencoded())// x-www-form-urlencoded use form

app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
	//access CROS
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});
app.use('/feed', feedRoutes);

mongoose.connect('mongodb+srv://vietanhcao1994:sao14111@cluster0-ardsb.mongodb.net/test?retryWrites=true&w=majority').then(result => {
	app.listen(8080);
}).catch(err => console.log(err))


