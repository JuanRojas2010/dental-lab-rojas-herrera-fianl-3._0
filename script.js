
"use strict";

let dientes = [];
let preguntaActual = 0;
let puntuacion = 0;
let respondida = false;

const preguntas = [
    {
        pregunta: "¿Qué dientes sirven principalmente para cortar los alimentos?",
        opciones: ["Incisivos", "Caninos", "Molares", "Premolares"],
        correcta: 0,
        explicacion: "Los incisivos tienen bordes diseñados para cortar los alimentos."
    },
    {
        pregunta: "¿Cuál es la función principal de los caninos?",
        opciones: ["Cortar", "Desgarrar", "Moler", "Ninguna"],
        correcta: 1,
        explicacion: "Los caninos ayudan a desgarrar los alimentos."
    },
    {
        pregunta: "¿Qué dientes se encargan principalmente de triturar y moler?",
        opciones: ["Incisivos", "Caninos", "Molares", "Solo los incisivos"],
        correcta: 2,
        explicacion: "Los molares tienen superficies amplias que ayudan a moler los alimentos."
    },
    {
        pregunta: "¿Cómo se conocen comúnmente los terceros molares?",
        opciones: ["Dientes de leche", "Dientes frontales", "Colmillos", "Muelas del juicio"],
        correcta: 3,
        explicacion: "Los terceros molares reciben el nombre común de muelas del juicio."
    },
    {
        pregunta: "¿Cuál es el orden general de los dientes desde el centro hacia atrás?",
        opciones: [
            "Molares, incisivos, caninos y premolares",
            "Incisivos, caninos, premolares y molares",
            "Caninos, molares, incisivos y premolares",
            "Premolares, incisivos, molares y caninos"
        ],
        correcta: 1,
        explicacion: "Desde el centro de la boca hacia atrás encontramos incisivos, caninos, premolares y molares."
    }
];

const $ = (id) => document.getElementById(id);

function obtenerImagen(tipo) {
    const imagenes = {
        Incisivo: "imagenes/incisivo.png",
        Canino: "imagenes/canino.png",
        Premolar: "imagenes/premolar.png",
        Molar: "imagenes/molar.png"
    };

    return imagenes[tipo] || "imagenes/incisivo.png";
}

async function iniciarSimulador() {
    try {
        const respuesta = await fetch("datos.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar datos.json");
        }

        dientes = await respuesta.json();

        document.querySelectorAll(".tooth").forEach((boton) => {
            boton.addEventListener("click", () => {
                mostrarDiente(boton.dataset.id, boton);
            });
        });

        $("btnAbrirQuiz").addEventListener("click", abrirQuiz);
        $("btnSiguiente").addEventListener("click", siguientePregunta);
        $("btnReiniciar").addEventListener("click", reiniciarQuiz);

        document.querySelectorAll(".opcion-quiz").forEach((boton) => {
            boton.addEventListener("click", () => {
                responderPregunta(Number(boton.dataset.opcion));
            });
        });

    } catch (error) {
        console.error("Error al iniciar el simulador:", error);
        $("mensaje-inicial").textContent =
            "No se pudieron cargar los datos. Abre el proyecto con Live Server y comprueba que datos.json esté en la carpeta principal.";
    }
}

function mostrarDiente(numero, botonSeleccionado) {
    const diente = dientes.find(
        (item) => String(item.numero) === String(numero)
    );

    if (!diente) {
        $("mensaje-inicial").textContent =
            "No se encontró la información de este diente en datos.json.";
        return;
    }

    document.querySelectorAll(".tooth").forEach((boton) => {
        boton.classList.remove("seleccionado");
    });

    botonSeleccionado.classList.add("seleccionado");

    $("mensaje-inicial").textContent = "Información del diente seleccionado:";
    $("tituloDiente").textContent = `Diente número ${diente.numero}`;
    $("nombreDiente").textContent = diente.nombre;
    $("numeroDiente").textContent = diente.numero;
    $("tipoDiente").textContent = diente.tipo;
    $("descripcionDiente").textContent = diente.descripcion;
    $("funcionDiente").textContent = diente.funcion;
    $("ubicacionDiente").textContent = diente.ubicacion;
    $("cantidadDiente").textContent = `${diente.cantidad} en la dentición permanente`;

    $("imagenDiente").src = obtenerImagen(diente.tipo);
    $("imagenDiente").alt = diente.nombre;
}

function abrirQuiz() {
    $("quiz").hidden = false;
    $("quiz").scrollIntoView({ behavior: "smooth", block: "start" });

    preguntaActual = 0;
    puntuacion = 0;

    mostrarPregunta();
}

function mostrarPregunta() {
    respondida = false;

    const pregunta = preguntas[preguntaActual];

    $("progresoQuiz").textContent =
        `Pregunta ${preguntaActual + 1} de ${preguntas.length}`;

    $("progresoBarra").style.width =
        `${(preguntaActual / preguntas.length) * 100}%`;

    $("preguntaQuiz").textContent = pregunta.pregunta;
    $("resultadoQuiz").textContent = "";
    $("puntuacionQuiz").textContent = `Puntos: ${puntuacion}`;
    $("btnSiguiente").hidden = true;
    $("btnReiniciar").hidden = true;

    const contenedor = $("opcionesQuiz");
    contenedor.innerHTML = "";

    pregunta.opciones.forEach((opcion, indice) => {
        const boton = document.createElement("button");

        boton.type = "button";
        boton.className = "opcion-quiz";
        boton.textContent = opcion;

        boton.addEventListener("click", () => {
            responderPregunta(indice);
        });

        contenedor.appendChild(boton);
    });
}

function responderPregunta(indiceElegido) {
    if (respondida) return;

    respondida = true;

    const pregunta = preguntas[preguntaActual];
    const botones = document.querySelectorAll(
        "#opcionesQuiz .opcion-quiz"
    );

    botones.forEach((boton, indice) => {
        boton.disabled = true;

        if (indice === pregunta.correcta) {
            boton.classList.add("correcta");
        }

        if (indice === indiceElegido && indice !== pregunta.correcta) {
            boton.classList.add("incorrecta");
        }
    });

    if (indiceElegido === pregunta.correcta) {
        puntuacion++;
        $("resultadoQuiz").textContent =
            `¡Correcto! ${pregunta.explicacion}`;
    } else {
        $("resultadoQuiz").textContent =
            `Respuesta incorrecta. ${pregunta.explicacion}`;
    }

    $("puntuacionQuiz").textContent =
        `Puntuación: ${puntuacion} de ${preguntas.length}`;

    $("progresoBarra").style.width =
        `${((preguntaActual + 1) / preguntas.length) * 100}%`;

    if (preguntaActual < preguntas.length - 1) {
        $("btnSiguiente").hidden = false;
        $("btnSiguiente").textContent =
            preguntaActual === preguntas.length - 2
                ? "VER RESULTADO"
                : "SIGUIENTE PREGUNTA";
    } else {
        $("preguntaQuiz").textContent = "¡Has terminado el quiz!";
        $("resultadoQuiz").textContent =
            `Obtuviste ${puntuacion} de ${preguntas.length} puntos.`;

        $("progresoQuiz").textContent = "Cuestionario completado";
        $("btnReiniciar").hidden = false;
    }
}

function siguientePregunta() {
    if (!respondida) return;

    if (preguntaActual < preguntas.length - 1) {
        preguntaActual++;
        mostrarPregunta();
    }
}

function reiniciarQuiz() {
    preguntaActual = 0;
    puntuacion = 0;
    mostrarPregunta();

    $("quiz").scrollIntoView({ behavior: "smooth", block: "start" });
}

document.addEventListener("DOMContentLoaded", iniciarSimulador);
