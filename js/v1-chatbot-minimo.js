const chat = document.getElementById("chat");
const entrada = document.getElementById("entrada");
const botonEnviar = document.getElementById("enviar");

function enviarMensaje() {
  const textoUsuario = entrada.value.trim();
  if (textoUsuario === "") return;

  // 1. Leer lo que escribió el usuario (en minúsculas para comparar)
  const mensajeLower = textoUsuario.toLowerCase();

  // 2. Decidir la respuesta con condiciones simples
  let respuesta = "Mmm... no entiendo. Prueba con: hola, hora, chiste, adiós";

  if (mensajeLower.includes("hola")) {
    respuesta = "¡Hola! Soy tu primer chatbot.";
  }
  if (mensajeLower.includes("hora")) {
    respuesta = "Son las " + new Date().toLocaleTimeString("es-ES");
  }
  if (mensajeLower.includes("chiste")) {
    respuesta = "¿Por qué los programadores confunden Halloween con Navidad? Porque OCT 31 == DEC 25";
  }
  if (mensajeLower.includes("adios") || mensajeLower.includes("adiós")) {
    respuesta = "¡Hasta luego!";
  }

  // 3. Añadir la conversación a la pantalla
  chat.innerHTML += "<p><strong>Tú:</strong> " + textoUsuario + "</p>" +
                    "<p><strong>Bot:</strong> " + respuesta + "</p>";

  // 4. Limpiar la caja de texto y hacer scroll
  entrada.value = "";
  chat.scrollTop = chat.scrollHeight;
}

botonEnviar.addEventListener("click", enviarMensaje);
entrada.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    enviarMensaje();
  }
});
