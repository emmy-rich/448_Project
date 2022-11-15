const sqlite3 = require('sqlite3').verbose();

function createTables() {
  // open database in memory
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
  db.serialize(() => {
    // Queries scheduled here will be serialized.
    db.run('CREATE TABLE IF NOT EXISTS user_info (user_id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, email TEXT NOT NULL UNIQUE, zipcode INT(5) NOT NULL, lat INT, long INT, station VARCHAR(3))')

      .run('PRAGMA foreign_keys = ON;')

      .run('CREATE TABLE IF NOT EXISTS closet (user_id INT UNIQUE, long_sleeve_shirt INT NOT NULL DEFAULT 0, sweater INT NOT NULL DEFAULT 0, jacket INT NOT NULL DEFAULT 0, jeans INT NOT NULL DEFAULT 0, coat INT NOT NULL DEFAULT 0, tank_top INT NOT NULL DEFAULT 0, sweats INT NOT NULL DEFAULT 0, summer_hat INT NOT NULL DEFAULT 0, t_shirt INT NOT NULL DEFAULT 0, skirt INT NOT NULL DEFAULT 0, winter_hat INT NOT NULL DEFAULT 0, winter_skirt INT NOT NULL DEFAULT 0, FOREIGN KEY(user_id) REFERENCES user_info(user_id))')

      .run('CREATE TABLE IF NOT EXISTS laundry (user_id INT UNIQUE, long_sleeve_shirt INT NOT NULL DEFAULT 0, sweater INT NOT NULL DEFAULT 0, jacket INT NOT NULL DEFAULT 0, jeans INT NOT NULL DEFAULT 0, coat INT NOT NULL DEFAULT 0, tank_top INT NOT NULL DEFAULT 0, sweats INT NOT NULL DEFAULT 0, summer_hat INT NOT NULL DEFAULT 0, t_shirt INT NOT NULL DEFAULT 0, skirt INT NOT NULL DEFAULT 0, winter_hat INT NOT NULL DEFAULT 0, winter_skirt INT NOT NULL DEFAULT 0, FOREIGN KEY(user_id) REFERENCES user_info(user_id))')

      .run(`INSERT INTO user_info (username, password, email, zipcode, lat, long, station)
              VALUES('testUsername1', 'testPass', 'test1@email.com', 66044, 95, 43, 'TOP')`)
      .run(`INSERT INTO closet(user_id)
              VALUES(1)`)
      .run(`INSERT INTO laundry(user_id)
              VALUES(1)`)

      .each('SELECT * FROM user_info', (err, row) => {
        if (err) {
          throw err;
        }
        console.log("user info: ");
        console.log(row);
      })
      .each('SELECT * FROM closet', (err, row) => {
        if (err) {
          throw err;
        }
        console.log("closet: ");
        console.log(row);
      })
      .each('SELECT * FROM laundry', (err, row) => {
        if (err) {
          throw err;
        }
        console.log("landry: ");
        console.log(row);
      })
  });
  // close the database connection
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Closed the database connection.');
  });
}



module.exports = { createTables };