// API KEY
const apiKey = "07264b419d408f70589c13522670d5ef";

// SELECTORES
const formulario = document.querySelector("#formulario");

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
}

function alertaError(error) {
    Swal.fire({
        title: "Error!",
        text: error,
        icon: "error",
        draggable: true,
    });
}
