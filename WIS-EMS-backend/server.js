import express from 'express';
import { APP_PORT, DB_URL } from './config';
import { errorHandler } from './middlewares';
const app = express();
import routes from './routes';
import mongoose from 'mongoose';
import path from 'path';

// Database connection
mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error...'));
db.once('open', () => { console.log('DB connected...'); });

const cors = require("cors");
app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
 });

global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', routes);

app.use(errorHandler);
app.listen(APP_PORT, () => console.log(`Listening on port ${APP_PORT}`))