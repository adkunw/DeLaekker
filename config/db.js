const mysql = require("mysql");

// const dbConfig = {
//   host: "sql12.freesqldatabase.com",
//   user: "sql12670296",
//   password: "fDqaDhat9X",
//   database: "sql12670296",
//   port: 3306,
// };
const dbConfig = {
  host: "db.blzckgsggxoyzgjglaeg.supabase.co",
  user: "postgres",
  password: "HBocl1t5XboJf1EG",
  database: "postgres",
  port: 5432,
};

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error("Koneksi ke database gagal: " + err.stack);
    return;
  }
  console.log("Terhubung ke database MySQL dengan ID " + db.threadId);
});

module.exports = db;
