import express from 'express';
import bodyParser from 'body-parser';
import feedRoutes from './router/feed';

const app = express();

// app.use(bodyParser.urlencoded())// x-www-form-urlencoded use form

app.use(bodyParser.json()); // application/json
app.use('/feed', feedRoutes);

app.listen(8080);
