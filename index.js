const db = require("./database.js");

 db.createTables();

//skeletons for all classes 
class DailyOutfit {
  constructor(outfit) {
    this.outfit = outfit;
  }
  generateOutfit() {
    
  }
}

class Article {
  constructor(type, season, status, color) {
    this.type = type;
    this.season = season;
    this.status = status;
    this.color = color;
  }
  getType() {
    
  }
  getSeason() {
    
  }
  getStatus() {
    
  }
  getColor() {
    
  }
  setType(type) {
    
  }
  setSeason(season) {
    
  }
  setStatus(status) {
    
  }
  setColor(color) {
    
  }
}

class Closet {
  constructor(clothing) {
    this.clothing = clothing;
  }
  add(article) {
    
  }
  delete(article) {
    
  }
  getClothing() {
    
  }
  edit() {
    
  }
}

class Weather {
  constructor(temperature, windSpeed, humidity, rain, snow) {
    this.temperature = temperature;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.rain = rain;
    this.snow = snow;
  }
  getTemperature() {
    return temperature;
  }
  getWindSpeed() {
    return windSpeed;
  }
  getHumidity() {
    return humidity;
  }
  getRain() {
    return rain;
  }
  getSnow() {
    return snow;
  }
  setTemperature(temperature) {
    
  }
  setWindSpeed(windSpeed) {
    this.windSpeed = windSpeed;
  }
  setHumidity(humidity) {
    
  }
  setRain(rain) {
    
  }
  setSnow(snow) {
    
  }
  accessAPI() {
    
  }
}

class User {
  constructor(password, email, username, location, closet, laundry) {
    this.password = password;
    this.email = email;
    this.username = username;
    this.location = location;
    this.closet = closet;
    this.laundry = laundry;
  }
  wear(article) {
    
  }
  clean() {
    
  }
  getPassword() {
    
  }
  getEmail() {
    
  }
  getUsername() {
    
  }
  getLocation() {
    
  }
  getCloset() {
    
  }
  getLaundry() {
    
  }
  setPassword(password) {
    
  }
  setEmail(email) {
    
  }
  setUsername(username) {
    
  }
  setLocation(location) {
    
  }
}

class RCServer {
  constructor(allUsers) {
    this.allUsers = allUsers;
  }
  validateLogin() {
    
  }
  addUser(User) {
    
  }
  removeUser(User) {
    
  }
  editUser(User) {
    
  }
  operation() {
    
  }
  executeQuery(query) {
    
  }
  receiveQuery() {
    
  }
  validateQuery() {
    
  }
  generateHTML() {
    
  }
}

class Laundry {
  constructor(dirty) {
    this.dirty = dirty;
  }
  getLaundry() {
    
  }
  add(article) {
    
  }
  delete(article) {
    
  }
}