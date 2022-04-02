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
            logger.error(`数据库连接失败: ${error}`);
            throw '数据库连接失败'
        }

        console.log(`数据库链接成功 connect id: ${connection.threadId}`);
    })

    return connection;
}

export const db = getBDInstance();
export default db
