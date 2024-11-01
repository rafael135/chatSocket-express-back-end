require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

/*
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
  }
}
*/

module.exports = {
  development: {
    username: "root",
    password: "3541",
    database: "chatWs",
    host: "localhost",
    port: 5306,
    dialect: "mysql"
  },
  test: {
    username: "root",
    password: "3541",
    database: "chatWs",
    host: "localhost",
    port: 5306,
    dialect: "mysql"
  },
  production: {
    username: "root",
    password: "3541",
    database: "chatWs",
    host: "localhost",
    port: 5306,
    dialect: "mysql"
  }
}
