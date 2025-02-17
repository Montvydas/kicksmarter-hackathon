import morgan from 'morgan';
import winston from 'winston';
import { Application } from 'express';
import expressWinston from 'express-winston';

// TODO in the future log into database
// import 'winston-mongodb';

// only required to import this and setup done :)
import 'express-async-errors';

// This is how to debug if wanted.
// export DEBUG=app:startup,app:db
// export DEBUG=app:**
// export DEBUG=
import Debug from 'debug';
const debugStartup = Debug('app:startup');
const dbDebug = Debug('app:db');

export default (app: Application) => {
    winston.exitOnError = true;
    winston.add(new winston.transports.File({ filename: 'error.log', level: 'error' }));
    winston.add(new winston.transports.File({ filename: 'combined.log' }));

    winston.exceptions.handle(new winston.transports.File({ filename: 'uncaughtExceptions.log' }));
    // TODO before winston.rejections.handle(...) didn't exist, what about now? :/
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
    // winston.rejections.handle(new winston.transports.File({ filename: 'unhandledRejection.log' }));

    const consoleTransport = new winston.transports.Console({ level: 'info', format: winston.format.simple() });
    winston.add(consoleTransport);

    if (app.get('env') !== 'production') {
        app.use(expressWinston.logger({ transports: [consoleTransport] }));
        app.use(morgan('tiny'));
    }

    winston.info('Logging setup!');
};
