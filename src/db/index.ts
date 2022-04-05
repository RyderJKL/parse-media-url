import mysql, {Connection} from 'mysql';
import config from '../config';
import logger from "../logger";

let connection: Connection;

export const getBDInstance = () => {
    if (connection) return connection;

    //@ts-ignore
    connection = mysql.createConnection(config.db);

    connection.connect((error) => {
        if (error) {
            logger.error(`Database connetct error: ${error}`);
            throw 'Database connetct error'
        }

        console.log(`Database connected successed id: ${connection.threadId}`);
    })

    return connection;
}

export const db = getBDInstance();
export default db
