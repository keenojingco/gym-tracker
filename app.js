import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import bb from 'express-busboy';

// import routes
import config from './config/config'
import todoRoutes from './routes/todo';
import userRoutes from './routes/user';
import SourceMapSupport from 'source-map-support';

// define our app using express
const app = express();

// express-busboy to parse multipart/form-data
bb.extend(app);

// allow-cors
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

// configure app
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname, 'public')));

// set the port
const port = config.PORT;

// connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mern-todo-app', {
    useMongoClient: true,
});

// add Source Map Support
SourceMapSupport.install();

//map routes
app.use('/api/todo', todoRoutes);
app.use('/api/user', userRoutes);
app.get('/', (req,res) => {
    return res.end('Api working');
})

// catch 404
app.use((req, res, next) => {
    res.status(404).send('<h2 align=center>Page Not Found!</h2>');
});

// start the server
app.listen(port,() => {
  console.log(`App Server Listening at ${port}`);
});