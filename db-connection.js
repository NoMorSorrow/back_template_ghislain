// access to process.env
require("dotenv").config();
const mysql = require("mysql2");

function getEnv(variable) {
  const value = process.env[variable];
  if (typeof value === "undefined") {
    console.warn(`Seems like the variable "${variable}" is not set in the environment. 
    Did you forget to execute "cp .env.sample .env" and adjust variables in the .env file to match your own environment ?`);
  }
  return value;
}

const inTestEnv = getEnv("NODE_ENV") === "test";
const DB_NAME = process.env.DB_NAME_TEST;

let config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true,
};

if (process.env.NODE_ENV === "test") {
  config = {
    host: process.env.DB_HOST_TEST,
    port: process.env.DB_PORT_TEST,
    user: process.env.DB_USER_TEST,
    password: process.env.DB_PASS_TEST,
    database: process.env.DB_NAME_TEST,
    multipleStatements: true,
  };
}

const connection = mysql.createConnection(config);

const query = (...args) => {
  return new Promise((resolve, reject) => {
    connection.query(...args, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

const deleteAllDBData = async () => {
  const tableNames = (
    await query(
      `SELECT table_name FROM information_schema.tables where LOWER(table_schema) = '${DB_NAME}' AND table_name != 'migrations'`
    )
  ).map((row) => row.table_name || row.TABLE_NAME);
  if (inTestEnv) {
    await query("SET FOREIGN_KEY_CHECKS=0;");
    tableNames.forEach(async (name) => {
      await query(`TRUNCATE ${name};`);
    });
    await query("SET FOREIGN_KEY_CHECKS=1;");
  }
};

const closeConnection = () => {
  return new Promise((resolve, reject) => {
    if (connection) {
      connection.end((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};

module.exports = {
  connection,
  closeConnection,
  query,
  deleteAllDBData,
};
