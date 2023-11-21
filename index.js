import server from './src/server.js';
import express from "express";
import bodyparser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import expressResponseHelper from 'express-response-helper';
import compression from 'compression';

const app = express();
const port = 4000;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions))
app.use(helmet())
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(morgan('dev'))
app.use(expressResponseHelper.helper())
app.use(compression())

app.use(server);

app.get('/', (req, res) => {
    return res.respond({statuscode: 200, message: "REST API FOR RECIPE"});
})

app.listen(port, () => {
    console.log(`Is running on port ${port}`)
});