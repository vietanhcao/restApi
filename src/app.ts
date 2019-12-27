import express from 'express';
import feedRoutes from "./router/feed";
const app = express();

app.use('/feed',feedRoutes)


app.listen(8080);
