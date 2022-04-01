import mysql from 'mysql';
import config from '../config';

//@ts-ignore
const connection = mysql.createConnection(config.db);

connection.connect((error) => {
    if (error) {
        console.error(`connect faild:${error.stack}`);
       return;
    }

    console.log(`connected id: ${connection.threadId}`);
})

export default connection
