const Pool = require("pg").Pool;

const pool = new Pool({
    user: "pablomandryk",
    host: "localhost",
    port: "5432",
    database: "jwtauth"
});

module.exports = pool;