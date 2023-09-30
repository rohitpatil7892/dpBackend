var { Client } = require('pg');
const Path = require('path');
const _ = require('lodash');
const Fs = require("graceful-fs");
const dotenv = require('dotenv');
dotenv.config();

let dbConfiguration = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    ssl: process.env.PG_SSL || false,
}

async function executeQuery(query, values) {
    let client = await connectDB()
    let result = await client.query(query, values);
    return result['rows'];
}

async function connectDB() {
    try {
        let client = new Client(dbConfiguration);
        await client.connect()
        return client;
    } catch (error) {
        if (error.code === '3D000') {
            console.log(`database "${dbConfiguration.database}" does not exist`);
            let defaultConfiguration = { ...dbConfiguration }
            defaultConfiguration.database = 'postgres';
            try {
                //Create database using default connection
                let tempClient = new Client(defaultConfiguration);
                await tempClient.connect()
                console.log(`Seeding database: ${dbConfiguration.database}`);
                await tempClient.query(`CREATE DATABASE "${dbConfiguration.database}"`);
                console.log(`Database created.`);
            } catch (error) {
                connectDB()
            }
            //Connect to new database
            client = new Client(dbConfiguration);
            await client.connect()
            await importDBSchema(client);
            return client;
        }
        throw error

    }
}

async function importDBSchema(client) {
    try {
        let sqlFilePath = Path.join(__dirname, '../db-schema', 'importSchema.sql');
        let sqlQueriesString = await Fs.readFileSync(sqlFilePath, 'utf-8');
        sqlQueriesString = sqlQueriesString.replace(/\n/gm, '');
        let sqlQueries = sqlQueriesString.split(';');
        //Remove empty values
        sqlQueries = _.compact(sqlQueries);
        //Execute all queries sequentially 
        for (let queryIndex = 0; queryIndex < sqlQueries.length; queryIndex++) {
            await client.query(sqlQueries[queryIndex]);
        }
        console.log(`Database schema imported.`);
    } catch (error) {
        throw error;
    }

}

module.exports = {
    executeQuery: executeQuery,
    connectDB: connectDB
}
