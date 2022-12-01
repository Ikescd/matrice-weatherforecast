const API_WEATHER_KEY = '635b06eb24fcdfe5fcca158cc06bec4e';
const API_CITY_KEY = '541dde06439a49f3928fd2ad88f0c814';

/**
 * Le tableau commence à Dimanche pour être compatible avec la fonction getDay()
 */
const week = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
];

let city = {
	name: '',
	lat: '',
	lng: '',
	weather: {
		main: '',
		description: '',
		icon: '',
	},
};

/**
 * On récupère toutes les éléments du DOM dont on aura besoin.
 * @variable submit
 * @variable inputCity
 * @variable resultDay
 * @variable resultWeek
 */
const submit = document.getElementById('submit');
const submitWeek = document.getElementById('submit-week');
const inputCity = document.getElementById('input-city');
const result = document.querySelector('.weather__results');

/**
 * Fonction asynchrone qui permet de récupérer les coordonnées de la ville entrée par l'utilisateur.
 * @param cityName : la ville entrée par l'utilisateur
 * @fetch de l'API Geocode
 * @returns les données de la ville ou une erreur
 */
async function getCityCoordonates(cityName) {
	const url = `https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=${API_CITY_KEY}`;

	await fetch(url)
		.then((response) => response.json())
		.then((data) => {
			city.lat = data.results[0].geometry.lat;
			city.lng = data.results[0].geometry.lng;
			//console.log(data.results[0]);
		})
		.catch((error) => console.error(error));
}

/**
 * Fonction asynchrone qui permet de récupérer les données métérologiques de la ville entrée par l'utilisateur
 * Les paramètres cityLat & cityLng sont préalablement fournis par getCityCoordonnates
 * @param cityLat : Latitude de la ville
 * @param cityLng : Longitude de la ville
 */
async function getWeather(cityLat, cityLng, __dayOrWeek) {
	const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLng}&exclude=minutely&units=metric&lang=en&appid=${API_WEATHER_KEY}`;
	console.log(url);
	await fetch(url)
		.then((res) => res.json())
		.then((data) => {
			if (__dayOrWeek == 'day') displayDayWeather(data.daily[0].weather[0]);
			else displayWeekWeather(data.daily);
		})
		.catch((error) => console.error(error));
}

function displayDayWeather(todayWeather) {
	const day = new Date().getDay();
	return (result.innerHTML = `<div>
        <p>${week[day]}</p>
        <img src="http://openweathermap.org/img/wn/${todayWeather.icon}@2x.png" alt="${todayWeather.description}"/>
      </div>`);
}

function displayWeekWeather(weeklyWeather) {
	let weatherWeek = [];
	weeklyWeather.forEach((el) => {
		weatherWeek.push(el.weather[0]);
	});

	const day = new Date().getDay();
	let content = '';
	for (let i = 0; i < weatherWeek.length - 1; i++) {
		console.log(weatherWeek[i]);
		content += `<div>
		  <p>${week[(day + i) % 7]}</p>
		  <img src="http://openweathermap.org/img/wn/${
				weatherWeek[i].icon
			}@2x.png" alt="${weatherWeek[i].description}"/>
		</div>`;
	}
	return (result.innerHTML = content);
}

/**
 * Fonction asynchrone qui permet de lancer les fonctions "getCityCoordonates" et "getWeather" avant d'afficher le résultat dans l'UI.
 * @param __city : objet contenant les données nécessaires de la ville
 * @awaitFunction getCityCoordonates()
 * @awaitFunction getWeather()
 */
async function displayWeather(__city, dayOrWeek) {
	await getCityCoordonates(__city.name);
	await getWeather(__city.lat, __city.lng, dayOrWeek);
}

function dayAndNightTheme() {
	const iconTitle = document.querySelector('.header__title');
	let currentHour = new Date().getHours();
	let bgColorTheme = document.querySelectorAll('.theme__bgColor');
	const body = document.querySelector('body');

	if (currentHour < 6 && currentHour > 18) {
		body.style.backgroundImage = "url('./assets/night-theme.jpg')";

		bgColorTheme.forEach((el) => {
			el.classList.add('theme-dark');
			el.classList.remove('theme-light');
		});

		iconTitle.innerHTML = `
      <span class="fa-solid fa-moon"></span>
      Weather App
      <span class="fa-solid fa-moon"></span>
    `;
	}
}
dayAndNightTheme();

submit.addEventListener('click', (el) => {
	el.preventDefault();

	if (inputCity.value == undefined || inputCity.value == '') {
		alert('Please, enter a existing city.');
		location.reload();
	} else {
		city.name = inputCity.value;
		displayWeather(city, 'day');
	}
});

submitWeek.addEventListener('click', (el) => {
	console.log('test');
	el.preventDefault();

	if (inputCity.value == undefined || inputCity.value == '') {
		alert('Please, enter a existing city.');
		location.reload();
	} else {
		city.name = inputCity.value;
		displayWeather(city, 'week');
	}
});
