import fetch from "node-fetch";

globalThis.fetch = fetch;

console.log("============== API Functions: =============");
fetch('https://api.weather.gov/gridpoints/TOP/95,43/forecast/hourly')
  .then(data => data.json())
  .then(data => {
/*    const weather_data = data
      .properties
      .periods[1].temperature;
    main(weather_data);*/
	let TIMEFRAME = 9;
	let weather_temperature = [];
	let weather_forecast = [];
	let added_temperature = 0;
	for (let i = 0; i<TIMEFRAME;i++){
	weather_temperature[i] = data.properties.periods[i].temperature;
	weather_forecast[i] = data.properties.periods[i].shortForecast;
	added_temperature = added_temperature + weather_temperature[i];
	}
	let average_weather = added_temperature/TIMEFRAME;
	average_weather  =  Math.round((average_weather + Number.EPSILON)*100)/100;


	//let weather_forecast = ["h","h","h","h","i","i","i","j","o"];

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
				if (weather_forecast[i] == weather_forecast[j]){
				count_mode++;
				}
			}
			if (count_mode>0){
				weather_forecast_count.push(weather_forecast[i]);
			}
			if (count_mostest < count_mode){
				count_mostest = count_mode;
				weather_forecast_mode = weather_forecast[i];
			}
		}
	}
	main(average_weather,weather_forecast_mode);
  });
//main function 
function main(temp,forecast,alt) {
  let winter_tops = ["a long sleeve shirt", "a sweater"];
  let extra_layer = ["a jacket", "a coat"];
  let summer_tops = ["a t-shirt", "a tank top"];
  let summer_accessories =["a summer hat"];
  let winter_accessories = ["a winter hat"];
  let winter_bottoms = ["pants", "a winter skirt"];
  let summer_bottoms = ["shorts", "pants", "a summer skirt"];
//daily outfit generator function
  function daily_outfit(temperature){
    let outfit =[];
    if(temperature <32){
      outfit = random_winter_top + " and " + random_winter_bottom;}
    else if(temperature<=55){
      outfit = random_winter_top + " and " + random_winter_bottom;}
    else if(temperature<=75){
      outfit = random_summer_top + " and " + random_winter_bottom;}
    else if(temperature<=100){
      outfit = random_summer_top + " and " + random_summer_bottom;}
    else if(temperature>100){
      outfit = random_summer_top + " and " + random_summer_bottom;}

  console.log("The temperature is " + temperature + " degrees, wear: " + outfit + ".\n"); 
  }
//picks clothes for the outfit
  function random_item(arr){
    return arr[Math.floor(Math.random()*arr.length)]
  }

  let random_winter_top = random_item(winter_tops);
  let random_extra_layer = random_item(extra_layer);
  let random_summer_top = random_item(summer_tops);
  let random_summer_accessory = random_item(summer_accessories);
  let random_winter_accessory = random_item(winter_accessories);
  let random_winter_bottom = random_item(winter_bottoms);
  let random_summer_bottom = random_item(summer_bottoms);

//weather reminder function
  function reminders(temperature){
    console.log("============= Helpful Weather Reminders: =============")
    console.log("\nBe kind!\n")
    if (temperature >= 40){
    console.log("Don't Forget Your SUNSCREEN\n");
    }
    if(temperature >= 70) {
      console.log("It's getting toasty, remember to HYDRATE! \n");
    }
    if(temperature <= 32){
      console.log("Stay warm, it's below freezing!\n")
    }
    if(temperature >=90) {
      console.log("HEAT ADVISORY: It's above 90 degrees, try to stay inside!\n")
    }

  }
//calling the functinos 
  console.log("\n========= Outfit Reccomendation: ==========\n");
  daily_outfit(temp);
  reminders(temp);
  console.log("The forecast will mostly be: " + forecast);
};
