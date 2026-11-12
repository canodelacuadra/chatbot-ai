# Proyecto: Chatbots web en 3 versiones

Este proyecto contiene tres ejemplos progresivos de un chatbot en una página web: desde una lógica basada en reglas hasta un chatbot conectado a un modelo de lenguaje (LLM) mediante una API.

## Archivos

- `v1-chatbot-minimo.html`: chatbot mínimo basado en reglas con `if`.
- `v2-chatbot-interfaz.html`: chatbot por reglas con interfaz tipo chat (burbujas, estilos y mejor experiencia).
- `v3-chatbot-ia.html`: chatbot con interfaz de chat conectado a un LLM a través de OpenRouter.
- `KEY.TXT`: archivo local para guardar una clave de API en tus pruebas (opcional). **No lo compartas ni lo subas a repositorios públicos.**

## Cómo ejecutar los ejemplos

1. Abre cualquiera de los archivos `.html` haciendo doble clic en tu navegador.
2. Para `v1` y `v2` no necesitas internet ni configuración adicional.
3. Para `v3` necesitas conexión a internet y una API key de OpenRouter.

> Recomendación: si al usar `v3` ves errores de red/CORS, sirve la carpeta con un servidor local y abre la página desde `http://localhost`:
>
> ```bash
> python -m http.server 8000
> ```
>
> Luego abre `http://localhost:8000/v3-chatbot-ia.html`.

## Qué es OpenRouter

[OpenRouter](https://openrouter.ai/) es una plataforma que proporciona una API unificada para acceder a distintos modelos de lenguaje (LLM) de varios proveedores (por ejemplo, modelos de Google, Meta, NVIDIA, etc.) usando un mismo formato de peticiones.

Características relevantes para este proyecto:

- **API compatible con el formato de OpenAI Chat Completions**: se envía una petición `POST` a un endpoint con una lista de `messages` (`system`, `user`, `assistant`) y se recibe una respuesta con el texto generado.
- **Un único endpoint**: `https://openrouter.ai/api/v1/chat/completions`.
- **Selección de modelo por nombre/ID**: en la petición se indica el campo `model` (por ejemplo, un modelo concreto o el router `openrouter/free`).
- **Modelos gratuitos (según disponibilidad)**: OpenRouter ofrece modelos con sufijo `:free` y el router `openrouter/free`, cuya disponibilidad y límites pueden variar con el tiempo.
- **Autenticación mediante API key**: las peticiones se autorizan con un token en la cabecera `Authorization: Bearer <TU_API_KEY>`.

## Cómo obtener una API key en OpenRouter

1. **Crea una cuenta**
   - Entra en [https://openrouter.ai/](https://openrouter.ai/) y regístrate o inicia sesión.

2. **Genera una API key**
   - Ve a la página de claves: [https://openrouter.ai/keys](https://openrouter.ai/keys).
   - Crea una nueva clave (API key).
   - Copia la clave en el momento en que se muestre. Las claves de OpenRouter suelen tener el formato `sk-or-v1-...`.

3. **Usa la clave en este proyecto (`v3`)**
   - Abre `v3-chatbot-ia.html` en el navegador.
   - Pega la clave en el campo **"API key de OpenRouter"** de la parte superior.
   - Escribe un mensaje y pulsa **Enviar**.
   - La clave se utiliza solo en el navegador (en memoria) mientras la página está abierta; no se guarda en el archivo HTML.

4. **Revisa límites y disponibilidad**
   - Los modelos gratuitos pueden tener límites de uso (peticiones por minuto/día), saturación temporal (error 429) o dejar de estar disponibles (error 404 en un modelo `:free` concreto).
   - Puedes consultar los modelos disponibles en [https://openrouter.ai/models](https://openrouter.ai/models).

> **Importante (seguridad):** nunca publiques tu API key ni la compartas. Si crees que se ha expuesto, revócala y genera una nueva en [https://openrouter.ai/keys](https://openrouter.ai/keys). En aplicaciones reales, la clave no debe ir en el frontend: las llamadas a la API se realizan desde un backend.

## Cómo funciona cada versión

### Versión 1: Chatbot mínimo (`v1-chatbot-minimo.html`)
- **Entrada**: lee el texto del usuario desde un campo de entrada.
- **Procesamiento**: convierte el mensaje a minúsculas y decide la respuesta con condiciones (`if` + `includes`) para palabras clave como `hola`, `hora`, `chiste` o `adiós`.
- **Salida**: muestra la conversación en pantalla y devuelve una respuesta por defecto si no reconoce el mensaje.

### Versión 2: Chatbot con interfaz (`v2-chatbot-interfaz.html`)
- **Interfaz de chat**: estructura visual con cabecera, área de mensajes y zona de entrada; mensajes renderizados como burbujas de usuario y bot.
- **Reglas del bot**: un array `REGLAS` asocia palabras clave (`claves`) con posibles respuestas (`respuestas`).
- **Lógica (`pensarRespuesta`)**: gestiona casos especiales (`ayuda`, `hora`), busca coincidencias en las reglas, elige una respuesta aleatoria y usa un mensaje por defecto si no entiende.
- **Comportamiento de UI**: crea mensajes con `textContent` (evita inyección HTML), simula escritura con un retardo breve y permite enviar con botón o tecla Enter.

### Versión 3: Chatbot con IA (`v3-chatbot-ia.html`)
- **Configuración de la API**:
  - Endpoint: `https://openrouter.ai/api/v1/chat/completions`
  - Modelo por defecto: `openrouter/free` (intenta enrutar a un modelo gratuito disponible)
  - API key introducida por el usuario en la interfaz
- **Contexto de conversación**:
  - Define una personalidad con un mensaje `system`.
  - Mantiene un `historico` con mensajes de usuario y asistente.
  - Envía el mensaje del sistema y los mensajes recientes en cada petición para conservar contexto.
- **Petición al LLM (`fetch`)**:
  - Realiza una petición `POST` con cabeceras `Content-Type: application/json` y `Authorization: Bearer <API_KEY>`.
  - Envía `model` y `messages` en el cuerpo JSON.
  - Comprueba `response.ok`, intenta extraer el mensaje de error de la API y obtiene la respuesta desde `choices[0].message.content`.
- **Interfaz y estados**: muestra "..." mientras espera, maneja errores con `try/catch`, muestra avisos si falta la clave y deshabilita el botón durante la petición.

## Problemas comunes y cómo solucionarlos

### 1. "No funciona la API key"
- **Causa frecuente:** el problema no suele ser la clave, sino el **modelo** configurado.
- Ejemplo: un modelo con sufijo `:free` puede dejar de estar disponible y la API devuelve **404** (aunque la key sea válida).
- **Solución:** usar `openrouter/free` o elegir un modelo gratuito disponible en [https://openrouter.ai/models?max_price=0](https://openrouter.ai/models?max_price=0) y actualizar `CONFIG.modelo` en `v3-chatbot-ia.html`.

### 2. Error 401 (Unauthorized)
- La clave es incorrecta, está incompleta o fue revocada.
- Genera una nueva clave y vuelve a pegarla.

### 3. Error 429 (Rate limited)
- Has hecho demasiadas peticiones en poco tiempo o el proveedor gratuito está saturado.
- Espera unos segundos/minutos y vuelve a intentarlo, o prueba con otro modelo.

### 4. Errores de red o CORS
- Abre la página desde un servidor local (`http://localhost`) en lugar de `file://`.
- Revisa la pestaña **Network** y la **Consola** del navegador para ver el detalle del error.

### 5. Seguridad de la clave
- No publiques tu API key en repositorios, capturas o archivos compartidos.
- En aplicaciones reales, las llamadas a APIs con claves privadas deben hacerse desde un **servidor/backend**, no desde el navegador.

## Ideas para ampliar
- Añadir más reglas y respuestas en `v1`/`v2`.
- Mejorar la detección de intenciones (por ejemplo, con expresiones regulares o normalización de texto).
- Permitir cambiar el modelo desde la interfaz en `v3`.
- Mostrar el nombre del modelo que respondió (útil si se usa `openrouter/free`).
- Guardar el historial en `localStorage` (con cuidado de no guardar claves sensibles).
- Añadir streaming de respuestas para ver el texto aparecer en tiempo real.
