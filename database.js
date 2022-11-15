const sqlite3 = require('sqlite3').verbose();

// Function that creates the database tables
function createTables() {
  // Creates a new database connection
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
  db.serialize(() => {
    // Creates the user_info table within the database with a primary key for the user_id so that it can be connected to other tables, unique username, and text and int fields for password, email, zipcode, latitude, longitude and the local weather station.
    db.run('CREATE TABLE IF NOT EXISTS user_info (user_id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, email TEXT NOT NULL UNIQUE, zipcode INT(5) NOT NULL, lat INT, long INT, station VARCHAR(3))')

      // this allows for the use of foreign/primary keys in order to connect the user_id within all three tables
      .run('PRAGMA foreign_keys = ON;')

      // Creates a closet table within the database that holds the user_id, and a row for each clothing items supported; long-sleeve shirt, sweater, jacket, jeans, coat, tank top, sweats, summer hat, t-shirt, skirt, winter hat, and winter skirt. This table keeps track of all of the user's clothing.
      .run('CREATE TABLE IF NOT EXISTS closet (user_id INT UNIQUE, long_sleeve_shirt INT NOT NULL DEFAULT 0, sweater INT NOT NULL DEFAULT 0, jacket INT NOT NULL DEFAULT 0, jeans INT NOT NULL DEFAULT 0, coat INT NOT NULL DEFAULT 0, tank_top INT NOT NULL DEFAULT 0, sweats INT NOT NULL DEFAULT 0, summer_hat INT NOT NULL DEFAULT 0, t_shirt INT NOT NULL DEFAULT 0, skirt INT NOT NULL DEFAULT 0, winter_hat INT NOT NULL DEFAULT 0, winter_skirt INT NOT NULL DEFAULT 0, FOREIGN KEY(user_id) REFERENCES user_info(user_id))')

      // Creates a laundry table within the database that holds the user_id, and a row for each of the clothing items supported; long-sleeve shirt, sweater, jacket, jeans, coat, tank top, sweats, summer hat, t-shirt, skirt, winter hat, and winter skirt. This table keeps track of the user's clothing that has been worn previously.
      .run('CREATE TABLE IF NOT EXISTS laundry (user_id INT UNIQUE, long_sleeve_shirt INT NOT NULL DEFAULT 0, sweater INT NOT NULL DEFAULT 0, jacket INT NOT NULL DEFAULT 0, jeans INT NOT NULL DEFAULT 0, coat INT NOT NULL DEFAULT 0, tank_top INT NOT NULL DEFAULT 0, sweats INT NOT NULL DEFAULT 0, summer_hat INT NOT NULL DEFAULT 0, t_shirt INT NOT NULL DEFAULT 0, skirt INT NOT NULL DEFAULT 0, winter_hat INT NOT NULL DEFAULT 0, winter_skirt INT NOT NULL DEFAULT 0, FOREIGN KEY(user_id) REFERENCES user_info(user_id))')

  });
  // close the database connection
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Closed the database connection.');
  });
}

// Function that takes an article of clothing and the username of the user, that
function wear(article, username) {
  // Creates a new database connection
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

  db.serialize(() => {
    // for each article item in the closet table 
    db.each(`SELECT closet.${article} FROM closet INNER JOIN user_info ON closet.user_id = user_info.user_id WHERE user_info.username = '${username}'`, (err, row) => {
      if (err) {
        throw err;
      }
      db.serialize(() => {
        let closetValueString = JSON.stringify(row);
        let closetValue = parseInt(closetValueString.replace(/[^0-9]*/g, ''));
        if(closetValue > 0)
        {
          closetValue--;
          db.run(`UPDATE closet SET ${article} = ${closetValue} WHERE user_id IN (SELECT user_id FROM user_info WHERE username = '${username}')`)
          db.each(`SELECT laundry.${article} FROM laundry INNER JOIN user_info ON laundry.user_id = user_info.user_id WHERE user_info.username = '${username}'`, (err, row) => {
            if (err) {
              throw err;
            }
            db.serialize(() => {
              let laundryValueString = JSON.stringify(row);
              let laundryValue = parseInt(laundryValueString.replace(/[^0-9]*/g, '')) + 1;
              db.run(`UPDATE laundry SET ${article} = ${laundryValue} WHERE user_id IN (SELECT user_id FROM user_info WHERE username = '${username}')`)
              db.close();
              console.log('Closed the database connection.');
            })
          })
        }
        else{
          db.close();
          console.log('Closed the database connection.');
        }
      })
    })
  });
}


function clean(article, username) {
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
  //get value in laundry
  db.serialize(() => {
    db.each(`SELECT laundry.${article} FROM laundry INNER JOIN user_info ON laundry.user_id = user_info.user_id WHERE user_info.username = '${username}'`, (err, row) => {
      if (err) {
        throw err;
      }
      db.serialize(() => {
        let laundryValueString = JSON.stringify(row);
        let laundryValue = parseInt(laundryValueString.replace(/[^0-9]*/g, ''));

        //get value in closet 
        db.each(`SELECT closet.${article} FROM closet INNER JOIN user_info ON closet.user_id = user_info.user_id WHERE user_info.username = '${username}'`, (err, row) => {
          if (err) {
            throw err;
          }
          db.serialize(() => {
            let closetValueString = JSON.stringify(row);
            let closetValue = parseInt(closetValueString.replace(/[^0-9]*/g, ''));
            closetValue += laundryValue;
            db.run(`UPDATE laundry SET ${article} = 0 WHERE user_id IN (SELECT user_id FROM user_info WHERE username = '${username}')`)
            db.run(`UPDATE closet SET ${article} = ${closetValue} WHERE user_id IN (SELECT user_id FROM user_info WHERE username = '${username}')`)
            db.close();
            console.log('Closed the database connection.');
          })
        })
      })
    })
  })
}

function remove(article, username) {
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

  db.serialize(() => {
    db.each(`SELECT closet.${article} FROM closet INNER JOIN user_info ON closet.user_id = user_info.user_id WHERE user_info.username = '${username}'`, (err, row) => {
      if (err) {
        throw err;
      }
      db.serialize(() => {
        let closetValueString = JSON.stringify(row);
        let closetValue = parseInt(closetValueString.replace(/[^0-9]*/g, '')) - 1;
        if (closetValue >= 0) {
          db.run(`UPDATE closet SET ${article} = ${closetValue} WHERE user_id IN (SELECT user_id FROM user_info WHERE username = '${username}')`)
        }
      })
      db.close();
      console.log('Closed the database connection.');
    })
  });
}

//returns what is in the closet for the inputed user
function getCloset(username) {
  //creates a connection to the database
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
  //selects e
  db.serialize(() => {
    db.each(`SELECT long_sleeve_shirt, sweater, jacket, jeans, coat, tank_top, sweats, summer_hat, t_shirt, skirt, winter_hat, winter_skirt FROM closet INNER JOIN user_info ON closet.user_id = user_info.user_id WHERE user_info.username ='${username}'`, (err, row) => {
      if (err) {
        throw err;
      }
      console.log("closet: ");
      console.log(row);
    })
  });
}

//returns what the launrdy for that user looks like
function getLaundry(username) {
  //creates a connection to the database
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
  //selects every type of article in the laundry 
  db.serialize(() => {
    db.each(`SELECT long_sleeve_shirt, sweater, jacket, jeans, coat, tank_top, sweats, summer_hat, t_shirt, skirt, winter_hat, winter_skirt FROM laundry INNER JOIN user_info ON laundry.user_id = user_info.user_id WHERE user_info.username ='${username}'`, (err, row) => {
      if (err) {
        throw err;
      }
      //prints the laundry information to the console
      console.log("laundry: ");
      console.log(row);
    })
    //closes the connection to the database
    db.close();
    console.log('Closed the database connection.');
  })
}

function checkData(article, username){
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all(`SELECT closet.${article} FROM closet INNER JOIN user_info ON closet.user_id = user_info.user_id WHERE user_info.username = '${username}'`, (err, row) => {
      if (err) {
        reject(err);
      }
      let countString = JSON.stringify(row);
      count = parseInt(countString.replace(/[^0-9]*/g, ''));
      row = count;
      resolve(row);
  });
      db.close();
      console.log('Closed the database connection.');
    })
  })
}

//adds an article to a specific user's closet
function add(article, username) {
  //creates connection to the database
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

  //gets the article from the closet associated with the id for the user
  db.serialize(() => {
    db.each(`SELECT closet.${article} FROM closet INNER JOIN user_info ON closet.user_id = user_info.user_id WHERE user_info.username = '${username}'`, (err, row) => {
      if (err) {
        throw err;
      }
      //gets the current value for the article
      db.serialize(() => {
        let closetValueString = JSON.stringify(row);
        let closetValue = parseInt(closetValueString.replace(/[^0-9]*/g, '')) + 1;
        //makes sure there is at least 0 or more articles and updates the articles value by 1
        if (closetValue >= 0) {
          db.run(`UPDATE closet SET ${article} = ${closetValue} WHERE user_id IN (SELECT user_id FROM user_info WHERE username = '${username}')`)
        }
      })
      //closes the connection to the database
      db.close();
      console.log('Closed the database connection.');
    })
  });
}

//adds a new user with their given input to be stored in the database
function addUser(username, password, email, zipcode, lat, long, station) {
  //connects to the database
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
  //Inserts all of the users information into the user information table, which makes a new user
  db.serialize(() => {
    db.run(`INSERT INTO user_info(username, password, email, zipcode, lat, long, station) VALUES('${username}', '${password}', '${email}', ${zipcode}, ${lat}, ${long}, '${station}')`)
    //gets the user id correlating with the username
    db.each(`SELECT user_id FROM user_info WHERE username = '${username}'`, (err, row) => {
      if (err) {
        throw err;
      }
      //creates a tables for the closet and laundry to be associated with the new user id
      db.serialize(() => {
        let id = JSON.stringify(row);
        id = parseInt(id.replace(/[^0-9]*/g, ''));
        db.run(`INSERT INTO closet(user_id)
              VALUES(${id})`)
        db.run(`INSERT INTO laundry(user_id)
              VALUES(${id})`)
        //closes the connection to the database
        db.close();
        console.log('Closed the database connection.');
      })
    })
  })
}

 function validateLogin(username, password) {   
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all(`SELECT COUNT(*) FROM user_info WHERE user_id IN (SELECT user_id FROM user_info WHERE username = '${username}' AND password = '${password}')`, (err, row) => {
      if (err) {
        reject(err);
      }
      let countString = JSON.stringify(row);
      count = parseInt(countString.replace(/[^0-9]*/g, ''));
      row = count;
      resolve(row);
  });
      db.close();
      console.log('Closed the database connection.');
    })
  })
  
}

module.exports = { createTables, wear, clean, add, remove, getCloset, getLaundry, addUser, validateLogin, checkData };
