// API KEY
const apiKey = "07264b419d408f70589c13522670d5ef";

// SELECTORES
const formulario = document.querySelector("#formulario");

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

IniciarApp();

function IniciarApp() {
    document.addEventListener("DOMContentLoaded", () => {
        const paisDefault = "Guatemala";
        consultarAPI(paisDefault);
    });

    formulario.addEventListener("submit", (e) => {
        const pais = document.querySelector("#pais").value;
        e.preventDefault();
        buscarClima(pais);
    });
}

function buscarClima(pais) {
    if (pais === "") {
        alertaError("El campo no puede estar vacío");
        return;
    }

    consultarAPI(pais);
}

// FUNCIÓN PARA LLAMAR A LA API
function consultarAPI(pais) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${pais}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then((respuesta) => respuesta.json())
        .then((datos) => {
            if (datos.cod === "404") {
                alertaError("Ciudad no Encontrada");
                return;
            }

            // MOSTRAR RESULTADO
            mostrarClima(datos);
        });
}

function mostrarClima(datos) {
    const ubicacion = document.querySelector(".location");
    ubicacion.textContent = datos.city.name;

    const clima = document.querySelector(".weather-description");
    clima.textContent = datos.list[0].weather[0].description;

    const icono = document.querySelector(".weather-icon");
    icono.className = "weather-icon";
    setTimeout(() => {
        icono.classList.add(
            "bx",
            `bx-${weatherIconMap[datos.list[0].weather[0].icon]}`
        );
    }, 50);

    const temperatura = document.querySelector(".temperature");
    temperatura.textContent = `${Math.round(datos.list[0].main.temp)}°C`;

    const dia = document.querySelector(".date");
    dia.textContent = new Date().toLocaleDateString("en", { weekday: "long" });

    const detalles = document.querySelector(".weather-details");
    detalles.innerHTML = `
        <div class="detail-item">
            Precipitation
            <span>${datos.list[0].pop}%</span>
        </div>
        <div class="detail-item">
            Humidity
            <span>${datos.list[0].main.humidity}%</span>
        </div>
        <div class="detail-item">
            Wind Speed
            <span>${datos.list[0].wind.speed} km/h</span>
        </div>
    `;

    // Mostrar los días siguientes
    const dias = document.querySelector(".forecast");

    const diaActual = new Date();
    const diasSiguientes = datos.list.slice(1);

    const diasUnicos = new Set();
    let contador = 0;
    dias.innerHTML = "";

    for (const diaDatos of diasSiguientes) {
        const fecha = new Date(diaDatos.dt_txt);
        const diaAbreviado = fecha.toLocaleDateString("en", {
            weekday: "short",
        });
        const temperaturaDia = `${Math.round(diaDatos.main.temp)}°C`;
        const codigoIcono = diaDatos.weather[0].icon;

        if (
            !diasUnicos.has(diaAbreviado) &&
            fecha.getDate() !== diaActual.getDate()
        ) {
            diasUnicos.add(diaAbreviado);
            dias.innerHTML += `
                <div class="forecast-day">
                    <i class='bx bx-${weatherIconMap[codigoIcono]}'></i>
                    <div>${diaAbreviado}</div>
                    <div>${temperaturaDia}</div>
                </div>
            `;
            contador++;
        }

        if (contador === 4) break;
    }
}

function alertaError(error) {
    Swal.fire({
        title: "Error!",
        text: error,
        icon: "error",
        draggable: true,
    });
}
