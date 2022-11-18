const sqlite3 = require('sqlite3').verbose();

//Function that creates the database tables
function createTables() {
  //Creates a new database connection
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  db.serialize(() => {
    //Creates the user_info table within the database with a primary key for the user_id so that it can be connected to other tables, unique username, and text and int fields for password, email, zipcode, latitude, longitude and the local weather station.
    db.run('CREATE TABLE IF NOT EXISTS user_info (user_id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, email TEXT NOT NULL UNIQUE, zipcode INT(5) NOT NULL, lat INT, long INT, station VARCHAR(3))')

      //this allows for the use of foreign/primary keys in order to connect the user_id within all three tables
      .run('PRAGMA foreign_keys = ON;')

      //Creates a closet table within the database that holds the user_id, and a row for each clothing items supported; long-sleeve shirt, sweater, jacket, jeans, coat, tank top, sweats, summer hat, t-shirt, skirt, winter hat, and winter skirt. This table keeps track of all of the user's clothing.
      .run('CREATE TABLE IF NOT EXISTS closet (user_id INT UNIQUE, long_sleeve_shirt INT NOT NULL DEFAULT 0, sweater INT NOT NULL DEFAULT 0, jacket INT NOT NULL DEFAULT 0, jeans INT NOT NULL DEFAULT 0, coat INT NOT NULL DEFAULT 0, tank_top INT NOT NULL DEFAULT 0, sweats INT NOT NULL DEFAULT 0, summer_hat INT NOT NULL DEFAULT 0, t_shirt INT NOT NULL DEFAULT 0, skirt INT NOT NULL DEFAULT 0, winter_hat INT NOT NULL DEFAULT 0, winter_skirt INT NOT NULL DEFAULT 0, FOREIGN KEY(user_id) REFERENCES user_info(user_id))')

      //Creates a laundry table within the database that holds the user_id, and a row for each of the clothing items supported; long-sleeve shirt, sweater, jacket, jeans, coat, tank top, sweats, summer hat, t-shirt, skirt, winter hat, and winter skirt. This table keeps track of the user's clothing that has been worn previously.
      .run('CREATE TABLE IF NOT EXISTS laundry (user_id INT UNIQUE, long_sleeve_shirt INT NOT NULL DEFAULT 0, sweater INT NOT NULL DEFAULT 0, jacket INT NOT NULL DEFAULT 0, jeans INT NOT NULL DEFAULT 0, coat INT NOT NULL DEFAULT 0, tank_top INT NOT NULL DEFAULT 0, sweats INT NOT NULL DEFAULT 0, summer_hat INT NOT NULL DEFAULT 0, t_shirt INT NOT NULL DEFAULT 0, skirt INT NOT NULL DEFAULT 0, winter_hat INT NOT NULL DEFAULT 0, winter_skirt INT NOT NULL DEFAULT 0, FOREIGN KEY(user_id) REFERENCES user_info(user_id))')

  });
  //close the database connection
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}

//Function that takes an article of clothing and the username of the user, that
function wear(article, username) {
  //Creates a new database connection
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message);
    }
  });

  db.serialize(() => {
    //match and select each item in the closet table to the specific username given as a parameter
    db.each(`SELECT closet.${article} FROM closet INNER JOIN user_info ON closet.user_id = user_info.user_id WHERE user_info.username = '${username}'`, (err, row) => {
      if (err) {
        throw err;
      }
      //take the returned data row and stringify it, then transform it into an integer value 
      db.serialize(() => {
        let closetValueString = JSON.stringify(row);
        let closetValue = parseInt(closetValueString.replace(/[^0-9]*/g, ''));
        //decrement the value in the closet if possible
        if (closetValue > 0) {
          closetValue--;
          //update the value for the given article parameter within the specific user's closet table to reflect the new value calculated above
          db.run(`UPDATE closet SET ${article} = ${closetValue} WHERE user_id IN (SELECT user_id FROM user_info WHERE username = '${username}')`)
          //match and select each item in the laundry table to the specific username given as a parameter
          db.each(`SELECT laundry.${article} FROM laundry INNER JOIN user_info ON laundry.user_id = user_info.user_id WHERE user_info.username = '${username}'`, (err, row) => {
            if (err) {
              throw err;
            }
            //take the returned data row and stringify it, then transform it into an integer value and increments it by 1 to reflect the new value
            db.serialize(() => {
              let laundryValueString = JSON.stringify(row);
              let laundryValue = parseInt(laundryValueString.replace(/[^0-9]*/g, '')) + 1;
              // update the value for the given article parameter within the specific user's laundry table to reflect the new value
              db.run(`UPDATE laundry SET ${article} = ${laundryValue} WHERE user_id IN (SELECT user_id FROM user_info WHERE username = '${username}')`)
              //close the database connection 
              db.close();
            })
          })
        }
        else {
          //close the database connection if the closet value is less than 0
          db.close();
        }
      })
    })
  });
}

//removes all articles in the laundry and adds them to the closet
function clean(article, username) {
  //creates a connection to the database
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  //gets the article from the launrdy row that is connected to the user id for the inputted username
  db.serialize(() => {
    db.each(`SELECT laundry.${article} FROM laundry INNER JOIN user_info ON laundry.user_id = user_info.user_id WHERE user_info.username = '${username}'`, (err, row) => {
      if (err) {
        throw err;
      }
      //gets the value of the article in the laundry
      db.serialize(() => {
        let laundryValueString = JSON.stringify(row);
        let laundryValue = parseInt(laundryValueString.replace(/[^0-9]*/g, ''));

        //gets the article in the closet that is assocated with the same user id 
        db.each(`SELECT closet.${article} FROM closet INNER JOIN user_info ON closet.user_id = user_info.user_id WHERE user_info.username = '${username}'`, (err, row) => {
          if (err) {
            throw err;
          }
          db.serialize(() => {
            //gets the value for the article in closet
            let closetValueString = JSON.stringify(row);
            let closetValue = parseInt(closetValueString.replace(/[^0-9]*/g, ''));
            //sets the value of closet to be its current value plus the value of the same article in laundry
            closetValue += laundryValue;
            //updates the value of the article in laundry to 0
            db.run(`UPDATE laundry SET ${article} = 0 WHERE user_id IN (SELECT user_id FROM user_info WHERE username = '${username}')`)
            //updates the value of the article in closet to be the closet and laundry values combined
            db.run(`UPDATE closet SET ${article} = ${closetValue} WHERE user_id IN (SELECT user_id FROM user_info WHERE username = '${username}')`)
            //closes the connection to the database
            db.close();
          })
        })
      })
    })
  })
}

//removes a specific article from the users closet
function remove(article, username) {
  //creates a connection to the database
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  //gets the article related to the id for the inputed username
  db.serialize(() => {
    db.each(`SELECT closet.${article} FROM closet INNER JOIN user_info ON closet.user_id = user_info.user_id WHERE user_info.username = '${username}'`, (err, row) => {
      if (err) {
        throw err;
      }
      db.serialize(() => {
        //gets the current value for the article
        let closetValueString = JSON.stringify(row);
        //decrements the value of that article by 1
        let closetValue = parseInt(closetValueString.replace(/[^0-9]*/g, '')) - 1;
        if (closetValue >= 0) {
          //updates the value for the article in the closet table
          db.run(`UPDATE closet SET ${article} = ${closetValue} WHERE user_id IN (SELECT user_id FROM user_info WHERE username = '${username}')`)
        }
      })
      //closes the connection to the database
      db.close();
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
  });
  //selects every type of article from the closet for that user
  db.serialize(() => {
    db.each(`SELECT long_sleeve_shirt, sweater, jacket, jeans, coat, tank_top, sweats, summer_hat, t_shirt, skirt, winter_hat, winter_skirt FROM closet INNER JOIN user_info ON closet.user_id = user_info.user_id WHERE user_info.username ='${username}'`, (err, row) => {
      if (err) {
        throw err;
      }
      //prints the closet data to the console
      console.log("closet: ");
      console.log(row);
    })
    //close connection to database
    db.close();
  })
}

//returns what the launrdy for that user looks like
function getLaundry(username) {
  //creates a connection to the database
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message);
    }
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
  })
}

//checks to make sure there is data for that specific articl 
function checkData(article, username) {
  //create a connection to the database
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  //creates a promise, and looks through the closet for a specific article 
  //of clothing for a specific username
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all(`SELECT ${article} FROM closet INNER JOIN user_info ON closet.user_id = user_info.user_id WHERE user_info.username = '${username}'`, (err, row) => {
        if (err) {
          reject(err);
        } //if there is no error then the amount of that article of clothing gets 
        //returned from the database
        console.log("The row is: " + row);
        let countString = JSON.stringify(row);
        console.log("This is the count of string: " + countString);
        if(countString.length != 0){
          count = parseInt(countString.replace(/[^0-9]*/g, ''));
          row = count;
          resolve(row);
        }
        else {
          console.log("uh oh");
        }
      });
      //close the connection to the database
      db.close();
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
    })
  });
}

//adds a new user with their given input to be stored in the database
function addUser(username, password, email, zipcode, lat, long, station) {
  //connects to the database
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message + "error here at 271");
    }
  });
  //Inserts all of the users information into the user information table, which makes a new user
  db.serialize(() => {
    db.run(`INSERT INTO user_info(username, password, email, zipcode, lat, long, station) VALUES('${username}', '${password}', '${email}', ${zipcode}, ${lat}, ${long}, '${station}')`)
    //gets the user id correlating with the username
    // try{
    db.each(`SELECT user_id FROM user_info WHERE username = '${username}'`, (err, row) => {
      if (err) {
        return console.error("Username or email is already taken. Try again \n");
      }
      else {
        db.serialize(() => {
        let id = JSON.stringify(row);
        id = parseInt(id.replace(/[^0-9]*/g, ''));
        db.run(`INSERT INTO closet(user_id)
              VALUES(${id})`)
        db.run(`INSERT INTO laundry(user_id)
              VALUES(${id})`)
        //closes the connection to the database
        db.close();
      })
    }
      })
      //creates a tables for the closet and laundry to be associated with the new user id
      
    // }
    // catch(err){
    //   console.log("Username or email is already taken. Try again \n");
    // }
  })
}



// function addUser2(username, password, email, zipcode, lat, long, station) {
//   //connects to the database
//   let db = new sqlite3.Database('reelcoloset', (err) => {
//     if (err) {
//       return console.error(err.message);
//     }
//   });
//   //Inserts all of the users information into the user information table, which makes a new user
//   db.serialize(() => {
//     db.run(`INSERT INTO user_info(username, password, email, zipcode, lat, long, station) VALUES('${username}', '${password}', '${email}', ${zipcode}, ${lat}, ${long}, '${station}')`)
//     //gets the user id correlating with the username
//     db.each(`SELECT user_id FROM user_info WHERE username = '${username}'`, (err, row) => {
//       if (err) {
//         throw err;
//       }
//       //creates a tables for the closet and laundry to be associated with the new user id
//       db.serialize(() => {
//         let id = JSON.stringify(row);
//         id = parseInt(id.replace(/[^0-9]*/g, ''));
//         db.run(`INSERT INTO closet(user_id)
//               VALUES(${id})`)
//         db.run(`INSERT INTO laundry(user_id)
//               VALUES(${id})`)
//         //closes the connection to the database
//         db.close();
//       })
//     })
    
//   })
// }




//returns 0 if username and password combo is not in database 
//and 1 if username and password combo is in database
function validateLogin(username, password) {
  //create a connection to the database
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message);
    }
  });

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      //returns the number of users with the username and password entered in by the user
      db.all(`SELECT COUNT(*) FROM user_info WHERE user_id IN (SELECT user_id FROM user_info WHERE username = '${username}' AND password = '${password}')`, (err, row) => {
        if (err) {
          reject(err);
        }
        //turn the output into a string and parse the integer from it
        let countString = JSON.stringify(row);
        count = parseInt(countString.replace(/[^0-9]*/g, ''));
        row = count;
        //return either 0 or 1
        resolve(row);
      });
      //close the connection to the database
      db.close();
    })
  })

}

function getInfo(username, info) {
  //create a connection to the database
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message);
    }
  });

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      //returns the number of users with the username and password entered in by the user
      db.each(`SELECT ${info} FROM user_info WHERE username = '${username}'`, (err, row) => {

        if (err) {
          reject(err);
        }
        //turn the output into a string
        row = JSON.stringify(row);
        resolve(row);
      });
      //close the connection to the database
      db.close();
    })
  })

}

function getArticle(username, article) {
  //create a connection to the database
  let db = new sqlite3.Database('reelcoloset', (err) => {
    if (err) {
      return console.error(err.message);
    }
  });

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      //returns the number of users with the username and password entered in by the user
      db.each(`SELECT ${article} FROM closet INNER JOIN user_info ON closet.user_id = user_info.user_id WHERE user_info.username = '${username}'`, (err, row) => {

        if (err) {
          reject(err);
        }
        //turn the output into a string
        row = JSON.stringify(row);
        resolve(row);
        console.log(row);
      });
      //close the connection to the database
      db.close();
    })
  })

}

module.exports = { createTables, wear, clean, add, remove, getCloset, getLaundry, addUser, validateLogin, checkData, getInfo, getArticle };
