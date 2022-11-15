const db = require("./database.js");

function displayMenu() {
  
}

db.createTables();
latitude('filthywench', 'y0urm0m', 'filthywench@gmail.com', 68007);

function displayLogo() {
  console.clear();
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

//displayLogo();
//db.createTables();
//db.wear('jacket', 'testUsername5');
//db.wear('sweater','testUsername7');
//db.add('t_shirt', 'testUsername8');
//db.remove('skirt', 'testUsername8');
//db.getCloset('testUsername12');
//latitude('testUsername13', 'testPass', 'email4@test.com', 66044);
//checkDB('sweater', 'testUsername7');
//checkWeather('testUsername13', 97, 46, 'TOP');
//gets promise from database and passes results to login function

function verify (username, password) {
  let promise = db.validateLogin(username, password)
  .then((results) => {
    logIn(results);
  })
}

//checks if a login was sucessful
//1 = yes, 0 = no
function logIn (num) {
  if (num == 1) {
    console.log("You're logged in.");
  }
  else {
    console.log("Invalid username or password.");
  }
}

//gets the latitude for a zipcode using an API
async function latitude(username, password, email, zipcode){
  const key  = process.env['apiKey'];
  let url= "https://api.geocod.io/v1.7/geocode?api_key=" +key +"&postal_code="+zipcode+"&format=simple";

    await fetch(url)
            .then(data => data.json())
            .then(data=> {
             let latitude_ = (data.lat);
              longitude(username, password, email, zipcode, latitude_);
            });
}

//gets longitude for a zipcode using an API
async function longitude(username, password, email, zipcode, latitude){
  const key  = process.env['apiKey'];
  let url= "https://api.geocod.io/v1.7/geocode?api_key=" +key +"&postal_code="+zipcode+"&format=simple";

    await fetch(url)
            .then(data => data.json())
            .then(data=> {

        let longitude_ = (data.lng);
        station(username, password, email, zipcode, latitude, longitude_);

  });
}

//gets the station of a zipcode using an API
async function station(username, password, email, zipcode, latitude, longitude){
  let url = "https://api.weather.gov/points/"+latitude+"%2C"+longitude;
  await fetch(url)
        .then(data => data.json())
        .then(data=> {
          let station = (data.properties.gridId);
          let gridX = (data.properties.gridX);
          let gridY = (data.properties.gridY);
           db.addUser(username, password, email, zipcode, gridX, gridY, station);
        });
}
async function checkWeather(username, gridX, gridY, station) {
  await fetch(`https://api.weather.gov/gridpoints/${station}/${gridX},${gridY}/forecast/hourly`)
  .then(data => data.json())
  .then(data => {

    //time frame has been agreed to be 9
	  let TIMEFRAME = 9;
    //temerature of location array
  	let weather_temperature = [];
    //forecast of location array
  	let weather_forecast = [];
    //initialising added_temperature that will sum up all temperatures in the array 
  	let added_temperature = 0;
    //array of multiple windspeeds
  	let weather_windSpeed = []
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
  	  added_windSpeed = added_windSpeed + weather_windSpeed[i];
  	}
  	//average temperature
  	let average_weather = added_temperature/TIMEFRAME;
    average_weather  =  Math.round((average_weather + Number.EPSILON)*100)/100;
    console.log(`The average weather is: ${average_weather}`);
  
  	//average wind speeed
  	let average_windSpeed = weather_windSpeed[0];
    console.log(`The average wind speed is: ${average_windSpeed}`);
  	//average_windSpeed = Math.round((average_windSpeed + Number.EPSILON)*100)/100;
  
  	//let weather_forecast = ["h","h","h","h","i","i","i","j","o"];
  
  //bit forecast part to determine average forecast
    //weather forecast 
  	let weather_forecast_count= [];
  	let weather_forecast_mode = '';
  	let count_mostest = 0;
  	for (let i = 0;i< TIMEFRAME; i++){
  		let count = 0;
  		for(let j = 0 ;j< weather_forecast_count.length;j++){
  			if (weather_forecast[i] == weather_forecast_count[j]){
  			count =1;
  			}
  		}
  		if (count != 1){
  			let count_mode = 0;
  			for (let j = i ; j < TIMEFRAME;j++){
          //so if 
  				if (weather_forecast[i] == weather_forecast[j]){
  				count_mode++;
  				}
  			}
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
  });

}

// generates an outfit based on the temprature inputted
async function generateArticles(averageWeather, weatherForecastMode, averageWindSpeed, username){ 
  //sets the arrays for different types of articles one can wear in different seasons
  let winter_tops = ["a long sleeve shirt", "a sweater"];
  let extra_layer = ["a jacket", "a coat"];
  let summer_tops = ["a t-shirt", "a tank top"];
  let summer_accessories =["a summer hat"];
  let winter_accessories = ["a winter hat"];
  let winter_bottoms = ["pants", "a winter skirt"];
  let summer_bottoms = ["jeans", "a summer skirt"];
    //selects a random article from the array to put in an outfit
    let random_winter_top = random_item(winter_tops);
    let random_extra_layer = random_item(extra_layer);
    let random_summer_top = random_item(summer_tops);
    let random_summer_accessory = random_item(summer_accessories);
    let random_winter_accessory = random_item(winter_accessories);
    let random_winter_bottom = random_item(winter_bottoms);
    let random_summer_bottom = random_item(summer_bottoms);

  checked_winter_top = checkDB(random_winter_top, username);
  checked_summer_top = checkDB(random_summer_top, username);
  checked_extra_layer = checkDB(random_extra_layer, username);
  checked_winter_accessory = checkDB(random_summer_accessory, username)
  checked_summer_accessory = checkDB(random_summer_accessory, username);
  checked_winter_bottom = checkDB(random_winter_bottom, username);
  checked_summer_bottom = checkDB(random_summer_bottom, username)
  //if
  //an array to store the outfit
  let outfit =[];
    if(averageWeather <32){
      let random_winter_top = random_item(winter_tops);
      let random_winter_bottom = random_item(winter_bottoms);
      outfit = random_winter_top + " and " + random_winter_bottom;}
    else if(averageWeather<=55){
      outfit = random_winter_top + " and " + random_winter_bottom;}
    else if(averageWeather<=75){
      outfit = random_summer_top + " and " + random_winter_bottom;}
    else if(averageWeather<=100){
      outfit = random_summer_top + " and " + random_summer_bottom;}
    else if(averageWeather>100){
      outfit = random_summer_top + " and " + random_summer_bottom;}
  
    console.log("Based on an average daily temperature of " + averageWeather + " degrees Farenheight, you should wear: " + outfit);
}

async function generateOutfit(averageWeather, weatherForecastMode, averageWindSpeed, username){ 
    if(averageWeather <32){
      let random_winter_top = random_item(winter_tops);
      let random_winter_bottom = random_item(winter_bottoms);
      outfit = random_winter_top + " and " + random_winter_bottom;}
    else if(averageWeather<=55){
      outfit = random_winter_top + " and " + random_winter_bottom;}
    else if(averageWeather<=75){
      outfit = random_summer_top + " and " + random_winter_bottom;}
    else if(averageWeather<=100){
      outfit = random_summer_top + " and " + random_summer_bottom;}
    else if(averageWeather>100){
      outfit = random_summer_top + " and " + random_summer_bottom;}
}

async function checkDB(article, username) {
  let promise = db.checkData(article, username)
  .then((results) => {
    print(results);
  })
}
function print(numInCloset){
if (numInCloset >= 1) {
    console.log("You can wear it");
  }
  else {
    console.log("None in closet");
  }
}
//select a random item from an array
function random_item(arr){
  if (arr.length == 0) {
    
  }
  else {
      return arr[Math.floor(Math.random()*arr.length)] 
  }
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
    //constructor that sets the password, email, username, latitude, longitude, zipcode, station, closet, and laundry to the inputted values
  constructor(password, email, username, latitude, longitude, zipcode, station, closet, laundry) {
    this.password = password;
    this.email = email;
    this.username = username;
    this.latitude = latitude;
    this.longitude = longitude;
    this.zipcode = zipcode;
    this.station = station;
    this.closet = closet;
    this.laundry = laundry;
  }
   //increment laundry's value of that article by 1, decrement closet's value for that article by 1
  wear(article) {
    db.wear(article, username);
  }
  //all laundry values set to 0, closet increment by amount that was in laundry, do this for each type of article
  clean() {
    const clothes = ['long_sleeve_shirt','sweater','jacket','jeans','coat','tank_top', 'sweats', 'summer_hat','t_shirt','skirt', 'winter_hat', 'winter_skirt'];
    for(let i = 0; i < clothes.length; i++)
      {db.clean(clothes[i], username);}
  }
  //will generate an outfit to recommend based on what is in their closet and what the weather is
  generateOutfit(){
    //use checkDB
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
    return username;
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
    db.getCloset(username);
  }
  //return status of laundry from database
  getLaundry() {
    db.getLaundry(username);
  }
  //increment inputted article's value in the closet for that user by 1
  add(article) {
    db.add(article, username);
  }
  //decrement inputted article's value in the closet for that user by 1
  remove(article) {
    db.remove(article, username);
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