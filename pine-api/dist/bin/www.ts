import { Promise } from "bluebird";
import config from 'config';
import { LogService } from "@xdgame-studio/log-service";
import { createServer } from 'http';
import { AddressInfo } from 'net';
import { initApp } from '../app';

interface LogConfig {
    name: string;
    path: string;
}

const logConfig: LogConfig = config.get('logger');
const logger = LogService.createLogger(logConfig.name, logConfig.path);

const port: number | string = config.get('app.port');

let serverAddress: string | AddressInfo | null;

/**
 * 
 * @param {Error} error The error that was thrown
 */
function onError(error: any) {
    if (error.syscall !== 'listen') throw error;

    const bind = `${typeof port === 'string' ? 'Pipe' : 'Port'} port`;

    switch (error.code) {
        case 'EACCES':
            logger.fatal(`${bind} require elevated privileges`);
            break;
        case 'EADINUSE':
            logger.fatal(`${bind} is already in use`);
            break;
        default:
            throw error;
    }

    process.exit(1);
}

function onListening() {
    const address = serverAddress;
    const portIsString: boolean = typeof port === 'string';

    let newAddress: string | number = 0;
    if (typeof address === 'string') {
        newAddress = address;
    } else if (address != null) {
        newAddress = address.port;
    }

    const bind: string = `${portIsString ? 'Pipe' : 'Port'} ${newAddress}`;

    logger.info('Listening on ' + bind);
}

async function main() {
    global.Promise = Promise;

    const app = await initApp(logger);
    const server = createServer(app.callback());

    server.listen(3000);
    serverAddress = server.address();

    server.on('error', onError);
    server.on('listening', onListening);
}

main();
