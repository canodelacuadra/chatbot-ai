// 1. Reglas del bot: palabras clave -> posibles respuestas
const REGLAS = [
  {
    claves: ["hola", "buenas", "hey", "buenos dias", "buenos días"],
    respuestas: [
      "¡Hola! ¿En qué puedo ayudarte?",
      "¡Buenas! Si no sabes qué preguntar, escribe \"ayuda\"."
    ]
  },
  {
    claves: ["como estas", "cómo estás", "que tal", "qué tal"],
    respuestas: [
      "Muy bien, no puedo quejarme: soy puro JavaScript.",
      "Genial, esperando tus preguntas."
    ]
  },
  {
    claves: ["nombre", "quien eres", "quién eres"],
    respuestas: [
      "Soy ChatBot 3000, un bot de práctica hecho en una clase de desarrollo web."
    ]
  },
  {
    claves: ["chiste"],
    respuestas: [
      "¿Por qué los programadores confunden Halloween con Navidad? Porque OCT 31 == DEC 25.",
      "¿Cuántos programadores hacen falta para cambiar una bombilla? Ninguno: es un problema de hardware.",
      "Mi código no tiene errores, tiene características sorpresa."
    ]
  },
  {
    claves: ["gracias"],
    respuestas: [
      "¡De nada!",
      "Para eso estoy. Un placer."
    ]
  },
  {
    claves: ["adios", "adiós", "chao", "chau", "hasta luego"],
    respuestas: [
      "¡Hasta luego! Vuelve cuando quieras.",
      "¡Adiós! Y recuerda: comenta tu código."
    ]
  }
];

const RESPUESTA_POR_DEFECTO =
  "Mmm... eso no lo tengo en mi lista. Escribe \"ayuda\" y te digo qué sé responder.";

// 2. Lógica: elegir una respuesta según el mensaje
function elegirAleatoria(opciones) {
  const indice = Math.floor(Math.random() * opciones.length);
  return opciones[indice];
}

function pensarRespuesta(mensaje) {
  const texto = mensaje.toLowerCase();

  if (texto.includes("ayuda")) {
    return "Sé hablar de: saludos, cómo estoy, mi nombre, chistes, la hora y despedidas. Prueba con \"chiste\".";
  }

  if (texto.includes("hora")) {
    return "Son las " + new Date().toLocaleTimeString("es-ES");
  }

  for (const regla of REGLAS) {
    const coincide = regla.claves.some((clave) => texto.includes(clave));
    if (coincide) {
      return elegirAleatoria(regla.respuestas);
    }
  }

  return RESPUESTA_POR_DEFECTO;
}

// 3. Interfaz: pintar mensajes y manejar eventos
const mensajes = document.getElementById("mensajes");
const entrada = document.getElementById("entrada");
const botonEnviar = document.getElementById("enviar");

function agregarMensaje(texto, emisor) {
  const burbuja = document.createElement("div");
  burbuja.className = `mensaje ${emisor}`; // "bot" o "usuario"
  burbuja.textContent = texto; // evita inyección de HTML
  mensajes.appendChild(burbuja);
  burbuja.scrollIntoView({ behavior: "smooth", block: "end" });
  return burbuja;
}

function enviarMensaje() {
  const texto = entrada.value.trim();
  if (texto === "") return;

  agregarMensaje(texto, "usuario");
  entrada.value = "";

  const escribiendo = agregarMensaje("...", "bot");
  setTimeout(() => {
    escribiendo.textContent = pensarRespuesta(texto);
  }, 700);
}

botonEnviar.addEventListener("click", enviarMensaje);
entrada.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    enviarMensaje();
  }
});

agregarMensaje("¡Hola! Soy ChatBot 3000. Escribe \"ayuda\" para ver qué sé hacer.", "bot");
