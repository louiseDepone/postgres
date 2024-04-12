

const Pool = require("pg").Pool;
const db = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});


// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to PostgreSQL", err);
//   } else {
//     console.log("PostgreSQL connected successfully");

//   }
// });


// process.on("exit", () => {
//   db.end();
// });


module.exports = { db };
