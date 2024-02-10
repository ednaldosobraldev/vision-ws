const { Client } = require('pg');
require("dotenv").config();
const client = new Client({
    "host": process.env.PGHOST,
    "user": process.env.PGUSER,
    "password": process.env.PGPASSWORD,
    "database":  process.env.PGDATABASE,
    "port":  process.env.PGPORT
});

client.connect();

exports.execute = (query, params = []) => {
    return new Promise((resolve, reject) => {
        client.query(query, params, (error, result, fields) => {
            if (error) {
                reject(error);
                console.error("Error executing query");
            } else {
                resolve(result);
                console.info("Executed query")
            }
        });
    })
}
exports.client = client;
