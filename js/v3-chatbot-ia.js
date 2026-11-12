// 1. Configuración: el "cerebro" ahora es un servicio externo (API de chat)
//    - OpenRouter ofrece modelos gratuitos, pero su disponibilidad puede cambiar.
//    - "openrouter/free" intenta elegir un modelo gratuito disponible automáticamente.
//    - La clave se introduce en la interfaz y solo se guarda en memoria mientras la página está abierta.
const CONFIG = {
  endpoint: "https://openrouter.ai/api/v1/chat/completions",
  modelo: "openrouter/free"
};

// Personalidad del bot (system prompt)
const PERSONALIDAD =
  "Eres ChatBot 3000, el asistente de una clase de desarrollo web. " +
  "Respondes siempre en español, de forma muy breve (1 o 2 frases), " +
  "con un toque de humor de programador cuando encaje.";

// Historial de conversación para que el modelo tenga contexto
const historico = [
  { role: "system", content: PERSONALIDAD }
];

// 2. Llamada al LLM con fetch
async function obtenerRespuestaIA(apiKey) {
  const mensajesRecientes = historico.slice(-11); // system + últimos 10 mensajes aprox.
  const cuerpo = {
    model: CONFIG.modelo,
    messages: [historico[0], ...mensajesRecientes.filter((m) => m.role !== "system")]
  };

  const respuesta = await fetch(CONFIG.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey
    },
    body: JSON.stringify(cuerpo)
  });

  if (!respuesta.ok) {
    let detalle = "código " + respuesta.status;
    try {
      const errorData = await respuesta.json();
      const mensajeError = errorData?.error?.message || errorData?.message;
      if (mensajeError) {
        detalle = respuesta.status + " - " + mensajeError;
      }
    } catch {
      // Si no se puede leer el cuerpo de error, usamos el código HTTP
    }
    throw new Error(detalle);
  }

  const datos = await respuesta.json();
  const contenido = datos?.choices?.[0]?.message?.content;

  if (!contenido) {
    throw new Error("la respuesta de la API no contenía texto");
  }

  return contenido;
}

// 3. Interfaz: pintar mensajes y manejar eventos
const mensajes = document.getElementById("mensajes");
const entrada = document.getElementById("entrada");
const botonEnviar = document.getElementById("enviar");
const campoApiKey = document.getElementById("api-key");

function agregarMensaje(texto, tipo = "bot") {
  const burbuja = document.createElement("div");
  burbuja.className = `mensaje ${tipo}`; // "bot", "usuario" o "error"
  burbuja.textContent = texto;
  mensajes.appendChild(burbuja);
  burbuja.scrollIntoView({ behavior: "smooth", block: "end" });
  return burbuja;
}

async function enviarMensaje() {
  const texto = entrada.value.trim();
  const apiKey = campoApiKey.value.trim();

  if (texto === "") return;

  agregarMensaje(texto, "usuario");
  entrada.value = "";

  if (!apiKey) {
    agregarMensaje("Introduce tu API key de OpenRouter en la parte superior para poder responder.", "error");
    return;
  }

  historico.push({ role: "user", content: texto });

  const escribiendo = agregarMensaje("...", "bot");
  botonEnviar.disabled = true;

  try {
    const respuesta = await obtenerRespuestaIA(apiKey);
    escribiendo.textContent = respuesta;
    escribiendo.className = "mensaje bot";
    historico.push({ role: "assistant", content: respuesta });
  } catch (error) {
    escribiendo.textContent = "No se pudo obtener respuesta de la IA: " + error.message;
    escribiendo.className = "mensaje error";
  } finally {
    botonEnviar.disabled = false;
    entrada.focus();
  }
}

botonEnviar.addEventListener("click", enviarMensaje);
entrada.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    enviarMensaje();
  }
});

agregarMensaje("¡Hola! Introduce tu API key de OpenRouter y pregúntame lo que quieras.", "bot");
