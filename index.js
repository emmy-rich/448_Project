const db = require("./database.js");

loginDriver();
// // latitude('george2', 'sup', 'hi@hi.net',66604);
//displays the different menu options for the user to choose from
function displayMainMenu() {
  console.log('\n' + "====REEL COLOSET MENU====" + '\n');
  let options = ['1) View Daily Outfit', '2) View Closet', '3) Add Item to Closet', '4) Remove Item from Closet', '5) View Laundry', '6) Wash Laundry', '7) View Profile', '8) Logout', '9) Clear console'];
  for (let i = 0; i < options.length; i++) {
    console.log(options[i]);
  }
}

//calls the login menu function and interprets the users input
function loginDriver(){
  let stop = false;
  while(stop == false){
    displayLoginMenu();
    //if option 1 is selected, the user is asked to input username and password
    let input1 = prompt("Please select an action to perform (1, 2, or 3): "); 
    if(input1 == 1){
      let username = prompt("Username: ");
      let password = prompt("Password: ");

      setTimeout(function(){ verify(username, password); }, 5000);//verify username after 5 seconds 
      stop = true;
    }
      //if option 2 is selected, the user is asked info to create their account
    else if(input1 == 2){
        let username = prompt("Username: "); 
        let password = prompt("Password: ");
        let email = prompt("Email: ");
        let zipcode = prompt("Zipcode: ");
        zipcode = parseInt(zipcode);
        latitude(username, password, email, zipcode);
    }
      //if option 3 is selected, exit the do while loop
    else if(input1 == 3){
      console.log("\nThank you for using our program!  Goodbye!");
      stop = true;
    }
      
    else{
      console.log("\nPlease enter a valid input\n");
    }
  }
  return;
}

//main driver displays the main menu and interprets the users input
function driver(user){
    let stop = false;
    let stop_out_loop = false;
     displayMainMenu();
      let input2 = prompt("\nPlease select an action to perform(1-9): ");
      //if option 1 is selected, user's daily outfit is generated
      if(input2 == 1){
        username = user.getUsername();
         user.generateOutfit(username); 
        stop = true;
      }
      //if option 2 is selected, the user's closet items are displayed
      else if(input2 == 2){
        user.getCloset();
        stop = true;
      }
      //
      else if(input2 == 3){
        console.log("Clothing Options: long_sleeve_shirt, sweater, t_shirt, tank_top, sweats, winter_skirt, jeans, skirt, jacket, coat, summer_hat, or winter_hat\n");
        let art = prompt("Which article would you like to add?: ");
        //checks for valid input
        if(art == 'long_sleeve_shirt' || art == 'sweater'|| art== 't_shirt' || art== 'tank_top'|| art== 'sweats' || art== 'winter_skirt'|| art== 'jeans' || art== 'skirt'|| art== 'jacket'|| art== 'coat'|| art== 'summer_hat' || art =='winter_hat') {
          user.add(art);
        }
        else{
          console.log("Invalid input please make sure you have typed it correctly (underscores are necessary)\n");
        }
      }
      else if(input2 == 4){
        console.log("Clothing Options: long_sleeve_shirt, sweater, t_shirt, tank_top, sweats, winter_skirt, jeans, skirt, jacket, coat, summer_hat, or winter_hat\n");
        let art = prompt("Which article would you like to remove?: ");
        if(art == 'long_sleeve_shirt' || art == 'sweater'|| art== 't_shirt' || art== 'tank_top'|| art== 'sweats' || art== 'winter_skirt'|| art== 'jeans' || art== 'skirt'|| art== 'jacket'|| art== 'coat'|| art== 'summer_hat' || art =='winter_hat') {
        user.remove(art);}
        else{
          console.log("Invalid input please make sure you have typed it correctly (underscores are necessary)\n");
        }
      }
      else if(input2 == 5){
         user.getLaundry();
      }
      else if(input2 == 6){
        user.clean();
      }
      else if(input2 == 7){
          console.log("Profile Information: ");
          console.log("Username: " + user.getUsername());
          console.log("Zipcode: " + user.getZipcode());
          console.log("Email: " + user.getEmail());
      }
      else if(input2 == 8){
        console.log("\nSuccessfully logged out!\n");
        loginDriver();
        stop_out_loop = true;
      }
      else if(input2 == 9){
        console.clear();
      }
      else{
        console.log("\nPlease enter a valid input\n")
        driver(user);
      }
    if(input2 == 1 || input2==2 ||input2==3||input2==4||input2==5 || input2==6 ||input2==7 ||input2==9){
        setTimeout(function(){ driver(user); }, 4000);
      } 
  stop = false;
}

//displays the login or create account options to the user
function displayLoginMenu(){
  displayLogo();
  console.log('1) Login');
  console.log('2) Create New User');
  console.log('3) Quit \n');
}

//clears the console and displays the 'reelcoloset' logo to the console
function displayLogo() {
  console.log(`

                                                              __
  _____  ______ ______ _         _____ ____                 _|__|_
 |  __ \\|  ____|  ____| |       / ____/ __ \\                 / _)
 | |__) | |__  | |__  | |      | |   | |  | |       _/\\/\\/\\_/ /
 |  _  /|  __| |  __| | |      | |   | |  | |     _|         /
 | | \\ \\| |____| |____| |____  | |___| |__| |   _|  (  | (  |
 |_|  \\_\\______|______|______|  \\_____\\____/   /__.-'|_|--|_| `);


console.log(`
  / _ \\/ __/ __/ /    / ___/ __ \\/ /  / __ \\/ __/ __/_  __/
 / , _/ _// _// /__  / /__/ /_/ / /__/ /_/ /\\ \\/ _/  / /   
/_/|_/___/___/____/  \\___/\\____/____/\\____/___/___/ /_/    
                                                        `);
}

//gets promise from database and passes results to login function
function verify (username, password) {
  let promise = db.validateLogin(username, password)
  .then((results) => {
    logIn(results, username, password);
  })
}

//checks if a login was sucessful
//1 = yes, 0 = no
function logIn (num, username, password) {
  if (num == 1) {
    console.log("\nLogin Successful!");
    emailFormat(username, password);
  }
  else {
    console.clear();
    console.log("\nInvalid username or password.\n");
    loginDriver();
  }
}

//formats the user's email address
function emailFormat(username, password){
  
  let promise = db.getInfo(username, 'email')
  .then((results) => {
      email = results.replace('{"email":"', "");
      email = email.replace('"}', "");
      zipFormat(username, password, email)
  })
}

//formats the user's zipcode, by turning it into an integer
function zipFormat(username, password, email) {
  let promise = db.getInfo(username, 'zipcode')
  .then((results) => {
    zipcode = parseFloat(results.replace(/[^0-9]*/g, ''));
    latFormat(username, password, email, zipcode);
  })
}

//formats the user's latitude, by turning it into an integer
function latFormat(username, password, email, zipcode) {
  let promise = db.getInfo(username, 'lat')
  .then((results) => {
      lat = parseFloat(results.replace(/[^0-9]*/g, ''));
      longFormat(username, password, email, zipcode, lat);
  })
}

//formats the user's longitude, by turning it into an integer
function longFormat(username, password, email, zipcode, lat) {
  let promise = db.getInfo(username, 'long')
  .then((results) => {
      long = parseFloat(results.replace(/[^0-9]*/g, ''));
      stationFormat(username, password, email, zipcode, lat, long);
  })
}

//formats the user's station id 
function stationFormat(username, password, email, zipcode, lat, long) {
  let promise = db.getInfo(username, 'station')
    .then((results) => {
      station = results.replace('{"station":"', "");
      station = station.replace('"}', "");
      let user = new User(password, email, username, lat, long, zipcode, station);
      driver(user);
  })
}
//create a global variable that will be adjusted after each api call
var apiCounter =0;

//gets the latitude for a zipcode using an API
async function latitude(username, password, email, zipcode){
  const key  = process.env['apiKey'];
  let url= "https://api.geocod.io/v1.7/geocode?api_key=" +key +"&postal_code="+zipcode+"&format=simple";

    await fetch(url)
            .then(data => data.json())
            .then(data=> {
                  if (apiCounter == 3)
                  {
                    console.log("\nFailed after three attempts. Closing.../n");
                  }
              //console.log("apiCounter for latitude: " + apiCounter);
              
              //api function calls itself if api call fails and api counter is less than 3
              if ((data.lat === undefined)&&(apiCounter<3)){
                //increment apiCounter
               apiCounter = apiCounter+1;
                latitude(username, password, email, zipcode);
              }
              else{
                //reset apiCounter
                //console.log("apiCounter after entering Succesful branch (latitude): "+ apiCounter);
                apiCounter = 0;
                //console.log("apiCounter after reinitisializing to 0 (latitude): "+ apiCounter);
                let latitude_ = (data.lat);
                longitude(username, password, email, zipcode, latitude_);
              }
            });
}

//gets longitude for a zipcode using an API
async function longitude(username, password, email, zipcode, latitude){
  const key  = process.env['apiKey'];
  let url= "https://api.geocod.io/v1.7/geocode?api_key=" +key +"&postal_code="+zipcode+"&format=simple";

    await fetch(url)
            .then(data => data.json())
            .then(data=> {
                  if (apiCounter == 3)
                  {
                    console.log("\nFailed after three attempts. Closing...\n");
                  }
              //console.log("apiCounter for longitude: " + apiCounter);
              
              //api function calls itself if api call fails and api counter is less than 3
              if ((data.lng === undefined)&&(apiCounter<3)){
                //increment apiCounter
                apiCounter = apiCounter+1;
                longitude(username, password, email, zipcode);
              }
              else{
                //reset apiCounter
                //console.log("apiCounter after entering Succesful branch (longitude): "+ apiCounter);
                apiCounter = 0;
                //console.log("apiCounter after reinitisializing to 0 (longitude): "+ apiCounter);
                let longitude_ = (data.lng);
                station(username, password, email, zipcode, latitude, longitude_);
              }
  });
}

//gets the station of a zipcode using an API
async function station(username, password, email, zipcode, latitude, longitude){
  let url = "https://api.weather.gov/points/"+latitude+"%2C"+longitude;
  await fetch(url)
        .then(data => data.json())
        .then(data=> {
              
              //console.log("apiCounter for station: " + apiCounter);
                  if (apiCounter == 3)
                  {
                    console.log("\nFailed after three attempts. Closing...\n");
                  }       
          //api function calls itself if api call fails and api counter is less than 3
          if ((data.status >=400)&&(apiCounter<3)){
            //increment apiCounter
            apiCounter = apiCounter+1;
            station(username, password, email, zipcode, latitude, longitude);
          }
          else{
            //reset apiCounter
                //console.log("apiCounter after entering Succesful branch (station): "+ apiCounter);
                apiCounter = 0;
                //console.log("apiCounter after reinitisializing to 0 (station): "+ apiCounter);
            let gridX = (data.properties.gridX);
            let gridY = (data.properties.gridY);
            let station = (data.properties.gridId);
            db.addUser(username, password, email, zipcode, gridX, gridY, station);
          }
        });
}

//fetches the weather forecast for a specific user from the api using the longitude, latitude, and local station
async function checkWeather(username, gridX, gridY, station) {
  let xGrid = gridX.toString();
  let yGrid = gridY.toString();
  let url = "https://api.weather.gov/gridpoints/"+station+"/"+xGrid+","+yGrid+"/forecast/hourly";
  await fetch(url)
  .then(data => data.json())
  .then(data => {       
    if (apiCounter == 3)
    {
      console.log("\nFailed after three attempts. Closing...\n");
    }
    //if for some reason the api does not fully process, it instead calls itself again to try and force the api to properly load
		if ((data.status >= 400)&&(apiCounter<3)){
      //increment apiCounter
      apiCounter = apiCounter+1;
			checkWeather(username,gridX,gridY,station);
    }
    //if the weather api finally returns something the program continues
	  else{
    //reset apiCounter
      apiCounter = 0;
    //time frame has been agreed to be 9
    let TIMEFRAME = 9;
    //temerature of location array
  	let weather_temperature = [];
    //forecast of location array
  	let weather_forecast = [];
    //initialising added_temperature that will sum up all temperatures in the array 
  	let added_temperature = 0;
    //array of multiple windspeeds
  	let weather_windSpeed = [];
    //initialising added_windSpeed that will sum up all temperatures in the array
  	let added_windSpeed = 0;
  	for (let i = 0; i<TIMEFRAME;i++){
      //pushing weather temperature at hour i into array at index i
    	weather_temperature[i] = data.properties.periods[i].temperature;
      //pushing weather forecast at hour i into array at index i
  	  weather_forecast[i] = data.properties.periods[i].shortForecast;
      //pushing windspeed at hour i into array at index i
  	  weather_windSpeed[i] = data.properties.periods[i].windSpeed;
      //summing temperature every increment by the hour
  	  added_temperature = added_temperature + weather_temperature[i];
      //summing windspeed by every increment by the hour
  	  //added_windSpeed = added_windSpeed + weather_windSpeed[i];
  	}
  	//average temperature
  	let average_weather = added_temperature/TIMEFRAME;
    average_weather  =  Math.round((average_weather + Number.EPSILON)*100)/100;
    console.log(`\nThe average weather is: ${average_weather} \n`);
  
  	//average wind speeed
    for (let i =0; i<TIMEFRAME; i++)
    {
      //iterating to replace all windspeeds to be a string number and not have the mph at the end
    weather_windSpeed[i] = weather_windSpeed[i].replace(" mph",""); 
    }
    for (let i =0; i<TIMEFRAME; i++)
    {
      //adding all the windspeeds together and forcing the string to act as an integer
    added_windSpeed = added_windSpeed + (weather_windSpeed[i] * 1); 
    }
    //averaging the sum of the total windSpeed
  	let average_windSpeed = added_windSpeed/TIMEFRAME;
    //rounding to two decimal places
  	average_windSpeed = Math.round((average_windSpeed + Number.EPSILON)*100)/100;
    console.log(`\nThe average wind speed is: ${average_windSpeed} mph`);

  //bit forecast part to determine average forecast
    //weather forecast 
  	let weather_forecast_count= [];
  	let weather_forecast_mode = '';
  	let count_mostest = 0;
  	for (let i = 0;i< TIMEFRAME; i++){
  		let count = 0;
      //this for loop determines if the weather forecast that is in index i has already been counted and accounted for by the weather_forecast_count array
  		for(let j = 0 ;j< weather_forecast_count.length;j++){
  			if (weather_forecast[i] == weather_forecast_count[j]){
  			count =1;
  			}
  		}
      //if the for loop above did not detect the identified forecast as a forecast that has been accounted for it goes through registration and count process
  		if (count != 1){
        //count mode just sums the specific forecast at index i over the entire array
  			let count_mode = 0;
  			for (let j = i ; j < TIMEFRAME;j++){
          //so if 
  				if (weather_forecast[i] == weather_forecast[j]){
  				count_mode++;
  				}
  			}
        //if there is more then 0 of the index found at i it is pushed on the weather_forecast_count array for next loop of parent for loop
  			if (count_mode>0){
  				weather_forecast_count.push(weather_forecast[i]);
  			}
        //if there is a bigger count of another forecast initilise weather_forecast_mode with new forecast
  			if (count_mostest < count_mode){
  				count_mostest = count_mode;
  				weather_forecast_mode = weather_forecast[i];
  			}
  		}
  	}
	  generateArticles(average_weather,weather_forecast_mode,average_windSpeed, username);
    }
  });
}

//generates clothing articles randomly based on the average weather
async function generateArticles(averageWeather, weatherForecastMode, averageWindSpeed, username){ 
  //sets the arrays for different types of articles one can wear in different seasons
  let winter_tops = ["long_sleeve_shirt", "sweater"];
  let summer_tops = ["t_shirt", "tank_top"];
  let winter_bottoms = ["sweats", "winter_skirt", "jeans"];
  let summer_bottoms = ["jeans", "skirt"];
  let extra_layer = ["jacket", "coat"];
  let summer_accessories =["summer_hat"];
  let winter_accessories = ["winter_hat"];
  let random_summer_accessory = "";
  let random_winter_accessory = "";
  let random_extra_layer = "";  
  //checks the forecast weather against different temperatures and selects a random item from the array for that clothing article 
  let random_top = "";
  let random_bottom = "";
  if(averageWeather <32){
    random_top = random_item(winter_tops);
    random_bottom = random_item(winter_bottoms);
    random_accessory = random_item(winter_accessories);
    random_extra_layer = random_item(extra_layer);}
  else if(averageWeather<=55){
    random_top = random_item(winter_tops);
    random_bottom = random_item(winter_bottoms);
    random_accessory = "no hat today";
    random_extra_layer = random_item(extra_layer);}
  else if(averageWeather<=75){
    random_top = random_item(summer_tops);
    random_bottom = random_item(winter_bottoms);
    random_accessory = "no accessories today";
    random_extra_layer = random_item(extra_layer);}
  else if(averageWeather<=100){
    random_top = random_item(summer_tops);
    random_bottom = random_item(summer_bottoms);
    random_summer_accessory = random_item(summer_accessories);
    random_extra_layer = "no extra layer today";}
  else if(averageWeather>100){
    random_top = random_item(summer_tops);
    random_bottom = random_item(summer_bottoms);
    random_accessory = random_item(summer_accessories);
    random_extra_layer = "no extra layer, it's way too hot!";}

  makeOutfit(averageWeather, username, random_top, random_bottom, random_accessory, random_extra_layer);   
}

//creates an outfit for the user given the weather forecast and the articles generated in the generateArticles function
async function makeOutfit(averageWeather, username, random_top, random_bottom, random_accessory, random_extra_layer){ 
  let outfit="";
  accessory_num = Math.floor(Math.random()*3);
  extra_layer_num = Math.floor(Math.random()*3); 
  if(averageWeather <32){
    if(accessory_num ==0 && extra_layer_num==0) {
      outfit = "a " + random_top + " and " + random_bottom;
      checkOutfit(outfit, averageWeather);
        outfit=toString(outfit);
       db.getArticle(username, random_bottom);
      db.getArticle(username, random_top);
      }
      else if(accessory_num>0 && extra_layer_num==0) {
        outfit = "a " + random_top + " and " + random_bottom + " with " + random_accessory;
        
        checkOutfit(outfit, averageWeather);
        outfit=toString(outfit);
        db.getArticle(username, random_bottom);
      db.getArticle(username, random_top);
        db.getArticle(username, random_accessory);
      }
      else if(accessory_num>0 && extra_layer_num >0){
        outfit = random_top + " and " + random_bottom + " with " + random_accessory + " and " + random_extra_layer;
      checkOutfit(outfit, averageWeather);
        outfit=toString(outfit);
        
        db.getArticle(username, random_bottom);
      db.getArticle(username, random_top);
        db.getArticle(username, random_accessory);
        db.getArticle(username, random_extra_layer);
      }
      else if(accessory_num==0 && extra_layer_num >0){
        outfit = random_top + " and " + random_bottom + " with " + random_extra_layer;
       
      checkOutfit(outfit, averageWeather);
         outfit=toString(outfit);
        db.getArticle(username, random_bottom);
      db.getArticle(username, random_top);
        db.getArticle(username, random_extra_layer);
      }
     
      }
    else if(averageWeather<=55){
      if(extra_layer_num==0) {
        outfit = "a " + random_top + " and " + random_bottom;
        
      checkOutfit(outfit, averageWeather);
        outfit=toString(outfit);
        db.getArticle(username, random_bottom);
      db.getArticle(username, random_top);
      }
      else if (extra_layer_num>0) {
        outfit = "a " + random_top + " and " + random_bottom + " with " + random_extra_layer;
        
        checkOutfit(outfit, averageWeather);
        outfit=toString(outfit);
        db.getArticle(username, random_bottom);
      db.getArticle(username, random_top);
        db.getArticle(username, random_extra_layer);
      } 
    }
    else if(averageWeather<=75){
      outfit = "a " + random_top + " and " + random_bottom;
      checkOutfit(outfit, averageWeather);
      outfit=toString(outfit);
       db.getArticle(username, random_bottom);
      db.getArticle(username, random_top);
    }
    else if(averageWeather<=100){
      if(accessory_num == 0){
        outfit = "a " + random_top + " and " + random_bottom;
        checkOutfit(outfit, averageWeather);
        outfit=toString(outfit);
         db.getArticle(username, random_bottom);
      db.getArticle(username, random_top);
      }
      else if(accessory_num > 0){
        outfit = "a " + random_top + " and " + random_bottom + " with " + random_accessory;}
      
      checkOutfit(outfit, averageWeather);
      outfit=toString(outfit);
      db.getArticle(username, random_bottom);
      db.getArticle(username, random_top);
        db.getArticle(username, random_accessory);
        
      }
    else if(averageWeather>100){
      if(accessory_num == 0){
        outfit = random_top + " and " + random_bottom;
        
        checkOutfit(outfit, averageWeather);
        outfit=toString(outfit);
        db.getArticle(username, random_bottom);
      db.getArticle(username, random_top);
      }
      else if(accessory_num > 0){
        outfit = random_top + " and " + random_bottom + " with " + random_accessory;
        
        checkOutfit(outfit, averageWeather);
        outfit=toString(outfit);
        db.getArticle(username, random_bottom);
      db.getArticle(username, random_top);
        db.getArticle(username, random_accessory); 
      }
    }
    // willWear(username, outfit);
    setTimeout(function(){ willWear(outfit, username, random_top, random_bottom, random_extra_layer, random_accessory); }, 2000);//this will delay 4 seconds and then runs willWear
}

function checkOutfit(outfit, averageWeather, username){

    let outfit_spaces = ""; 
    //else if(outfit.length>0){
      outfit_spaces = outfit.replaceAll("_", " ");
        console.log("\nBased on an average daily temperature of " + averageWeather + " degrees Farenheight, you should wear: " + outfit_spaces + '\n'); 
      printClothesArt(outfit, username);
     // }
}

function willWear(outfit, username, random_top, random_bottom, random_extra_layer, random_accessory) {
  let willUserWear = prompt('Will you wear this outfit? (yes or no)');
  willUserWear = willUserWear.toLowerCase();
  if (willUserWear == 'yes' || willUserWear == 'y') {
      db.wear(random_bottom, username);
      db.wear(random_top, username);
      db.wear(random_extra_layer, username);
      db.wear(random_accessory, username);
  }
  else if (willUserWear == 'no' || willUserWear == 'n') {
    // makeOutfit();
    console.log("Try 1) View Daily Outfit again to get a different outfit.\n");
  }
  else {
    console.log('Please input a valid choice, yes or no.\n');
  }
}

//returns the count of a specific article of clothing in the closet
// async function checkDB(article, username) {
//   let promise = db.checkData(article, username)
//   .then((results) => {
//     print(results);
//   })
// }

// ////checks if you can actually wear an item or if there aren't any of that item in the closet
// function print(numInCloset){
// if (numInCloset >= 1) {
//     console.log("You can wear it");
//   }
//   else {
//     console.log("None in closet");
//   }
// }
      
//select a random item from an array
function random_item(arr){
  if (arr.length == 0) {
  }
  else {
      return arr[Math.floor(Math.random()*arr.length)] 
  }
}

//ascii art for the clothes in the outfit
async function printClothesArt(outfit, username){
    if (outfit.includes("summer_hat")) {
    console.log(`
                       _____
                    .-'     '-.
                   /           \\
                  |-.           |
                  |  \\          |
                  [__|__________|_______ 
    `);
  }
  if (outfit.includes("winter_hat")) {
    console.log(`
                     .--------.
                    /          '.
                   |         .-. \\
                   |         |  '.|
                   |_________|   /|\\
                  (___________)  |||
    `);  
  }
   if (outfit.includes("jacket") || outfit.includes("coat")) {
    console.log(`
                      __   __    
                     /  \\\-// \\   
                    / |  |. | \\  
                   / /|  |. |\\ \\ 
                  /_/ |  |. | \\_\\
                      |__|__|
    `);
  }
  if (outfit.includes("long_sleeve_shirt")) {
    console.log(`
                      __   __    
                     /  '-'  \\   
                    / |     | \\  
                   / /|     |\\ \\
                  /_/ |     | \\_\\
                      |_____|
    `);
  }
  if (outfit.includes("sweater")) {
    console.log(`
                    .-//||\\\\-.
                   / ,      , \\
                  /  ;      ;  \\
                 /, /|      |\ .\\
                 \\\  \\|      |/ /
                  \\  \\      /  /
                   \\_/||||||\\_/
                     \\"===="//                       
    `);
  }

 
 if (outfit.includes("t_shirt")) {
    console.log(`
                      __   __  
                     /  '-'  \\ 
                    /_|     |_\\
                      |     |  
                      |     |  
                      |_____|         
    `);
  }
  if (outfit.includes("tank_top")) {
    console.log(`
                      __   __  
                     |  '-'  |
                      |     |
                      |     |  
                      |     |  
                      |_____|
    `);
  }
  if (outfit.includes("jeans") || outfit.includes("sweats")) {
    console.log(`
                      ,==c==,
                      |_/|\\_|
                      |  |  |
                      |  |  |
                      |  |  |
                      |__|__|
    `);
  }
 
  if (outfit.includes("skirt")) {
    console.log(`
                      =+===
                     / |.  \\
                    |  |.   |
                    |  |.   |
                    |  |.   |
                    |_/_\\___|
    `);
  }
  if (outfit.includes("winter_skirt")) {
    console.log(`
                       =+===
                      / |.  \\
                     |  |.   |
                     |  |.   |
                     |  |.   |
                     |  |.   |
                     |  |.   |
                     |_/_\\___|
    `);
  }
  console.log("\nCheck to see if the outfit is in your closet. If it's not, generate a new outfit, do your laundry, or wear day-old clothes and be stinky.\n Here's how many you have of each article in the outfit: ");
}

//class to represent an article of clothing
//type is a string that represents what type of clothing item it is (e.g. shirt, pants...)
//season is a string that represents when one would wear this article(e.g. summer, fall..)
class Article {
  //constructor that sets the type and season to the inputted values
  constructor(type, season) {
    this.type = type;
    this.season = season;
  }
  //returns type of article
  getType() {
    return type;
  }
  //returns the season of the article
  getSeason() {
    return season;
  }
  //sets the type to the new inputted type
  setType(type) {
    this.type = type;
  }
  //sets the season to the new inputted season
  setSeason(season) {
    this.season = season;
  }
}

//class to represent and store the weather of a current place
//rain and snow are booleans represeting if it is raining/snowing
//temperature, windspeed, and humidity are int's
class Weather {
    //constructor that sets the temperature, windSpeed, humidity, rain, and snow to the inputted values
  constructor(temperature, windSpeed, humidity, rain, snow) {
    this.temperature = temperature;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.rain = rain;
    this.snow = snow;
  }
  //return temprature value
  getTemperature() {
    return temperature;
  }
  //return wind speed value
  getWindSpeed() {
    return windSpeed;
  }
  //return humidity value
  getHumidity() {
    return humidity;
  }
  //return rain boolean
  getRain() {
    return rain;
  }
  //return snow boolean
  getSnow() {
    return snow;
  }
  //set temperature to inputted value
  setTemperature(temperature) {
    this.temperature = temperature
  }
  //set wind speed to inputted value
  setWindSpeed(windSpeed) {
    this.windSpeed = windSpeed;
  }
  //set humidity to inputted value
  setHumidity(humidity) {
    this.humidity = humidity;
  }
  //set rain to inputted value
  setRain(rain) {
    this.rain = rain;
  }
  //set snow to inputted value
  setSnow(snow) {
    this.snow = snow;
  }
}

//Class to represent a user and store their personal data
//password, email, station and username are strings
//latitude, longitude, and zipcode are ints
//Closet and Laundry refer to the spaces storing article information in the database
class User {
    //constructor that sets the password, email, username, latitude, longitude, zipcode, and station to the inputted values
  constructor(password, email, username, lat, long, zipcode, station) {
    this.password = password;
    this.email = email;
    this.username = username;
    this.lat = lat;
    this.long = long;
    this.zipcode = zipcode;
    this.station = station;
  }
   //increment laundry's value of that article by 1, decrement closet's value for that article by 1
  wear(article) {
    db.wear(article, this.username);
  }
  //all laundry values set to 0, closet increment by amount that was in laundry, do this for each type of article
  clean() {
    const clothes = ['long_sleeve_shirt','sweater','jacket','jeans','coat','tank_top', 'sweats', 'summer_hat','t_shirt','skirt', 'winter_hat', 'winter_skirt'];
    for(let i = 0; i < clothes.length; i++)
      {db.clean(clothes[i], this.username);}
  }
  //will generate an outfit to recommend based on what is in their closet and what the weather is
  generateOutfit(username){
    username = this.username;
    
    //console.log(this.lat);
    //console.log(this.long);
    //console.log(this.station);
    checkWeather(username, this.lat, this.long, this.station);
  }
  //return password value
  getPassword() {
    return password;
  }
  //return email value
  getEmail() {
    return email;
  }
  //username value
  getUsername() {
    return this.username;
  }
  //return longitude value
  getLongitude() {
    return longitude;
  }
  //return latitude value
  getLatitude() {
    return latitude;
  }
  //return zipocode value
  getZipcode() {
    return zipcode;
  }
  //return staion value
  getStation() {
    return station;
  }
  //return status of closet from database
  getCloset() {
    db.getCloset(this.username);
  }
  //return status of laundry from database
  getLaundry() {
    db.getLaundry(this.username);
  }
  //increment inputted article's value in the closet for that user by 1
  add(article) {
    db.add(article, this.username);
  }
  //decrement inputted article's value in the closet for that user by 1
  remove(article) {
    db.remove(article, this.username);
  }
  //set password to inputted value
  setPassword(password) {
    this.password = password;
  }
  //set email to inputted value
  setEmail(email) {
    this.email = email;
  }
  //set username to inputted value
  setUsername(username) {
    this.username = username;
  }
  //set latitude to inputted value
  setLatitude(latitude) {
    this.latitude = latitude;
  }
  //set longitude to inputted value
  setLongitude(longitude) {
    this.longitude = longitude;
  }
  //set zipcode to inputted value
  setZipcode(zipcode) {
    this.zipcode = zipcode;
  }
  //set station to inputted value
  setStation(station) {
    this.station = station;
  }
}

//Class to handle user interactions
class RCServer {
  //empty constructor
  constructor() {
  }
  //check if inputted user name and password match stored username and password
  validateLogin(inputUser, inputPassword) {
    verify(inputUser, inputPassword);
  }
  //adds a new user with their inputted data
  addUser(username, password, email, zipcode) {    
    latitude(username, password, email, zipcode);
  }
}

