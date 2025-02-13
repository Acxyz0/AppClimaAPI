// API KEY
const apiKey = "07264b419d408f70589c13522670d5ef";

// SELECTORES
const form = document.querySelector("form");

const weatherIconMap = {
    "01d": "sun",
    "01n": "moon",
    "02d": "sun",
    "02n": "moon",
    "03d": "cloud",
    "03n": "cloud",
    "04d": "cloud",
    "04n": "cloud",
    "09d": "cloud-rain",
    "09n": "cloud-rain",
    "10d": "cloud-rain",
    "10n": "cloud-rain",
    "11d": "cloud-lightning",
    "11n": "cloud-lightning",
    "13d": "cloud-snow",
    "13n": "cloud-snow",
    "50d": "water",
    "50n": "water",
};

// Iniciar la aplicación
runApp();

function runApp() {
    // Llama a la API al cargar la página
    document.addEventListener("DOMContentLoaded", () => {
        const cityDefault = "Guatemala";
        callAPI(cityDefault);
    });

    // Llama a la API al enviar el form
    form.addEventListener("submit", (e) => {
        const city = document.querySelector("input").value;
        e.preventDefault();
        searchWeather(city);
    });
}

function searchWeather(city) {
    if (city === "") {
        successAlert("El campo no puede estar vacío");
        return;
    }

    spinner();
    callAPI(city);
}

// FUNCIÓN PARA LLAMAR A LA API
function callAPI(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (data.cod === "404") {
                successAlert("Ciudad no Encontrada");
                return;
            }

            // MOSTRAR RESULTADO
            showWeather(data);
        });
}

function showWeather(data) {
    const location = document.querySelector(".location");
    location.textContent = data.city.name;

    const weather = document.querySelector(".weather-description");
    weather.textContent = data.list[0].weather[0].description;

    const icon = document.querySelector(".weather-icon");
    icon.className = "weather-icon";
    setTimeout(() => {
        icon.classList.add(
            "bx",
            `bx-${weatherIconMap[data.list[0].weather[0].icon]}`
        );
    }, 50);

    const temp = document.querySelector(".temperature");
    temp.textContent = `${Math.round(data.list[0].main.temp)}°C`;

    const day = document.querySelector(".date");
    day.textContent = new Date().toLocaleDateString("en", { weekday: "long" });

    const details = document.querySelector(".weather-details");
    details.innerHTML = `
        <div class="detail-item">
            Precipitation
            <span>${data.list[0].pop}%</span>
        </div>
        <div class="detail-item">
            Humidity
            <span>${data.list[0].main.humidity}%</span>
        </div>
        <div class="detail-item">
            Wind Speed
            <span>${data.list[0].wind.speed} km/h</span>
        </div>
    `;

    // Mostrar los días siguientes
    const days = document.querySelector(".forecast");

    const currentDay = new Date();
    const followDays = data.list.slice(1);

    const uniqueDays = new Set();
    let count = 0;
    days.innerHTML = "";

    for (const dayData of followDays) {
        const date = new Date(dayData.dt_txt);
        const abbrevDay = date.toLocaleDateString("en", {
            weekday: "short",
        });
        const tempDay = `${Math.round(dayData.main.temp)}°C`;
        const codIcon = dayData.weather[0].icon;

        if (
            !uniqueDays.has(abbrevDay) &&
            date.getDate() !== currentDay.getDate()
        ) {
            uniqueDays.add(abbrevDay);
            days.innerHTML += `
                <div class="forecast-day">
                    <i class='bx bx-${weatherIconMap[codIcon]}'></i>
                    <div>${abbrevDay}</div>
                    <div>${tempDay}</div>
                </div>
            `;
            count++;
        }

        if (count === 4) break;
    }
}

function successAlert(error) {
    Swal.fire({
        title: "Error!",
        text: error,
        icon: "error",
        draggable: true,
    });
}

function spinner() {
    Swal.fire({
        title: "¡Completado!",
        text: "Datos obtenidos con éxito",
        icon: "success",
    });
}
