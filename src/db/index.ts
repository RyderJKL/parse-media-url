import mysql from 'mysql';
import config from './config';

const connection = mysql.createConnection(config);

connection.connect((error) => {
    if (error) {
        console.error(`connect faild:${error.stack}`);
       return; 
    }

    console.log(`connected id: ${connection.threadId}`);
})

connection.query('SELECT * FROM `cnews`.`reddit_post` LIMIT 0,1000', (error, results, fields) => {
    if (error) throw error;
    console.log(fields);
    console.log('result is', results[0]);
})

export default connection
// connection.end()