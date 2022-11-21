import fetch from "node-fetch";

globalThis.fetch = fetch;

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}



async function lattitude(zipcode){
	let key = "c9535543ac76565a1695989163a9416aa994ca6";
	let url= "https://api.geocod.io/v1.7/geocode?api_key=" +key +"&postal_code="+zipcode+"&format=simple";

	await fetch(url)
		.then(data => data.json())
		.then(data=> {

	console.log(data.lat);

});
}


async function office(zipcode){

	let listOfOffices = ["AKQ", "ALY", "BGM", "BOX", "BTV", "BUF", "CAE", "CAR", "CHS", "CLE", "CTP", "GSP", "GYX", "ILM", "ILN", "LWX", "MHX", "OKX", "PBZ", "PHI", "RAH", "RLX", "RNK", "ABQ", "AMA", "BMX", "BRO", "CRP", "EPZ", "EWX", "FFC", "FWD", "HGX", "HUN", "JAN", "JAX", "KEY", "LCH", "LIX", "LUB", "LZK", "MAF", "MEG", "MFL", "MLB", "MOB", "MRX", "OHX", "OUN", "SHV", "SJT", "SJU", "TAE", "TBW", "TSA", "ABR", "APX", "ARX", "BIS", "BOU", "CYS", "DDC", "DLH", "DMX", "DTX", "DVN", "EAX", "FGF", "FSD", "GID", "GJT", "GLD", "GRB", "GRR", "ICT", "ILX", "IND", "IWX", "JKL", "LBF", "LMK", "LOT", "LSX", "MKX", "MPX", "MQT", "OAX", "PAH", "PUB", "RIW", "SGF", "TOP", "UNR", "BOI", "BYZ", "EKA", "FGZ", "GGW", "HNX", "LKN", "LOX", "MFR", "MSO", "MTR", "OTX", "PDT", "PIH", "PQR", "PSR", "REV", "SEW", "SGX", "SLC", "STO", "TFX", "TWC", "VEF", "AER", "AFC", "AFG", "AJK", "ALU", "GUM", "HPA", "HFO", "PPG", "STU", "NH1", "NH2", "ONA", "ONP"];

        let closestDistance = 1000;
	let closestOffice = ''

	for (let i = 0;i<listOfOffices.length;i++){

	let url = ("https://api.weather.gov/offices/" + listOfOffices[i])

	await fetch(url)
        	.then(datas => datas.json())
        	.then(datas => {

		if (datas.status == 404)
			return 0;

		let zipCodeArray;
		let officeZipCode;
		let distance;

		let temp = null;

		temp = datas.address.postalCode;
		//console.log(listOfOffices[i]);
		if(temp.length>5)
		{
		zipCodeArray = temp.split("-");
		officeZipCode = parseInt(zipCodeArray[0]);
		}
		else
		{
		officeZipCode = temp;
		}

		distance = Math.abs(zipcode - officeZipCode);

		if (closestDistance > distance)
		{
			closestDistance = distance;
			closestOffice = listOfOffices[i];
		}
		});
	}
	console.log(closestOffice);

}


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
	let weather_windSpeed = []
	let added_windSpeed = 0;
	for (let i = 0; i<TIMEFRAME;i++){
	weather_temperature[i] = data.properties.periods[i].temperature;
	weather_forecast[i] = data.properties.periods[i].shortForecast;
	weather_windSpeed[i] = data.properties.periods[i].windSpeed;
	added_temperature = added_temperature + weather_temperature[i];
	added_windSpeed = added_windSpeed + weather_windSpeed[i];
	}
	//average temperature
	let average_weather = added_temperature/TIMEFRAME;
	average_weather  =  Math.round((average_weather + Number.EPSILON)*100)/100;

	//average wind speeed
	let average_windSpeed = weather_windSpeed[0];
	//average_windSpeed = Math.round((average_windSpeed + Number.EPSILON)*100)/100;

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
	let zipcode = 67068;
	office(zipcode);
	lattitude(zipcode);
	main(average_weather,weather_forecast_mode,average_windSpeed);
  });

//main function
function main(temp,forecast,windSpeed) {
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

  console.log("The temperature will be " + temperature + " degrees with a "+ forecast.toLowerCase() + " forecast and a "+ windSpeed+ " wind speed, wear: " + outfit + ".\n"); 
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
};
