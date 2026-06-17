DOCUMENTACIÓN DE USO DE IA
PROYECTO WEB “SPORTCLUB”
BENJAMIN TABILO
------------------------------------------------------------
HERRAMIENTA UTILIZADA
ChatGPT

FECHA
01 Junio 2026



1. INTRODUCCIÓN

Durante el desarrollo del proyecto SportClub utilicé inteligencia
artificial como apoyo para resolver dudas, entender algunos
conceptos de programación y corregir errores que fueron apareciendo
mientras desarrollaba el sitio.



2. OBJETIVO DEL USO DE IA:

La inteligencia artificial la utilicé principalmente para:

- Entender mejor funciones de JavaScript.
- Aprender técnicas de CSS.
- Mejorar el diseño responsive.
- Resolver dudas puntuales durante el desarrollo.
- Comprender mejor cómo se relacionan HTML, CSS y JS.

Todo lo que obtuve desde la IA lo revisé, lo entendí y lo adapté
antes de usarlo en el proyecto.


3. USO DE IA EN CSS

La IA me ayudó a entender algunos conceptos de CSS como:

- Flexbox para organizar elementos
- Efectos hover
- Diseño responsive
- Organización visual de componentes

Ejemplo trabajado:

header{
    background: #2E1A47;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 60px;
}

Lo que entendí de esto fue:

- display: flex : organiza los elementos en fila
- justify-content: space-between : separa los elementos
- align-items: center : los centra verticalmente
- padding : da espacio interno al contenedor

Después de entenderlo, lo modifiqué y ajusté manualmente para que
quedara acorde al diseño del proyecto SportClub.


4. USO DE IA EN JAVASCRIPT:S

En JavaScript utilicé la IA principalmente para entender cómo
funcionan los eventos y cómo se conectan con el HTML.

Ejemplo trabajado:

const botones = document.querySelectorAll(".clase-card button");

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        alert("Clase reservada correctamente");
    });
});

Lo que entendí de este código fue:

- Cómo seleccionar elementos del HTML
- Cómo recorrer varios elementos
- Cómo funcionan los eventos click
- Cómo ejecutar acciones al presionar un botón

Luego el código fue modificado manualmente según lo que necesitaba
el proyecto.


5. PROMPTS UTILIZADOS

Herramienta: ChatGPT  
Prompt: Cómo diseñar tarjetas  modernas usando CSS flexbox  
Resultado: Estructura base de cards  
Modificación: Ajuste de colores, tamaños y contenido  
Justificación: Adaptación al diseño del proyecto SportClub

------------------------------------------------------------

Herramienta: COPILOT  
Prompt: Cómo hacer un botón que muestre un mensaje al hacer clic en JavaScript  
Resultado: Ejemplo con addEventListener  
Modificación: Adaptado a botones de reserva  
Justificación: Funcionalidad del sistema de clases

------------------------------------------------------------

Herramienta: ChatGPT  
Prompt: Cómo hacer una página web responsive usando CSS  
Resultado: Recomendaciones de diseño adaptable  
Modificación: Aplicación de media queries  
Justificación: Mejora de la experiencia en celulares

------------------------------------------------------------

Herramienta: ChatGPT  
Prompt: Explicación de la relación entre HTML, CSS y JavaScript  
Resultado: Explicación general  
Modificación: Aplicado al entendimiento del proyecto  
Justificación: Mejor comprensión del funcionamiento del sitio

------------------------------------------------------------
6. USO CORRECTO DE IA

El uso de inteligencia artificial fue solo como apoyo para aprender
y resolver dudas durante el desarrollo del proyecto.


7. APRENDIZAJES OBTENIDOS

- Cómo funcionan HTML, CSS y JavaScript juntos
- Manejo básico de eventos en JavaScript
- Diseño responsive
- Corrección de errores
- Organización de un proyecto web completo


8. CONCLUSIÓN

En general, la inteligencia artificial fue una ayuda útil para
entender el desarrollo web. La IA  me sirvió para resolver dudas y 
reforzar aprendizajes.

Aquí tienes la continuación de tu documentación, manteniendo la estructura, tono y formato solicitados para la parte 2 de tu evaluación.

---

# DOCUMENTACIÓN DE USO DE IA - PARTE 

9. USO DE IA EN INTEGRACIÓN DE BACKEND (API)

Durante esta fase, utilicé la IA para comprender la comunicación entre el Front End y el Back End, resolviendo errores de conexión y consumo de datos dinámicos.

Ejemplo trabajado:

```javascript
async function obtenerDatosServidor() {
    const response = await fetch("http://localhost:3000/api/auth/me", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    const resultado = await response.json();
    // ...
}

```

Lo que entendí de este código fue:

* El uso de `async/await` para manejar procesos asíncronos.
* La importancia de enviar el `Bearer Token` en los headers para la autenticación en rutas protegidas.
* Cómo capturar la respuesta del servidor en formato JSON para manipularla en el DOM.

Después de entender la lógica, ajusté el manejo de errores para que el usuario sea redirigido al login si el token no es válido o expira.

10. USO DE IA EN MANIPULACIÓN Y LIMPIEZA DE DATOS (METADATA)

La IA me ayudó a resolver un problema donde los datos de la base de datos se mostraban como código JSON crudo en la interfaz.

Ejemplo trabajado:

```javascript
let notaLimpia = "";
if (typeof metadata === "string" && !metadata.trim().startsWith("{")) {
    notaLimpia = metadata;
} else if (typeof metadata === "object" && metadata !== null) {
    notaLimpia = metadata.descripcion || metadata.notas || "";
}

```

Lo que entendí de esto fue:

* Cómo diferenciar entre un string simple y un objeto JSON.
* La necesidad de validar los datos antes de inyectarlos en el HTML para evitar visualizaciones técnicas no deseadas.
* Cómo aplicar una interfaz limpia basada en la estructura del objeto recibido.

Esta solución fue fundamental para cumplir con los estándares de UX/UI exigidos por el profesor.

11. PROMPTS UTILIZADOS (PARTE 2)

**Herramienta:** GEMINI
- Prompt: Cómo solucionar error 404 en endpoint /api/users/me usando Express y cómo obtener el usuario logueado con JWT.
- Resultado: Explicación sobre la existencia de rutas y uso de middleware de autenticación.
- Modificación: Ajuste a la ruta correcta `/api/auth/me`.
- Justificación: Resolución de problemas de conexión entre el servidor y el cliente.

---

**Herramienta:** GEMINI
- Prompt: Cómo mostrar datos dinámicos de un JSON en un formulario y limpiar la metadata de una base de datos SQLite.
- Resultado: Lógica de validación `typeof` y limpieza de objetos.
- Modificación: Adaptación a las variables de mi base de datos (`otros` vs `metadata`).
- Justificación: Mejora estética y funcional de la página de perfil.


# 12. USO CORRECTO DE IA

El uso de IA en esta etapa fue crucial para entender la **lógica de backend** aplicada al desarrollo frontend. Cada fragmento de código fue analizado para asegurar que no solo funcionara, sino que fuera comprensible para futuras modificaciones.

13. APRENDIZAJES OBTENIDOS

* Consumo de APIs protegidas con Bearer Tokens.
* Depuración de errores HTTP (404, 401).
* Manejo avanzado de objetos y JSON en JavaScript.
* Sincronización de datos entre una base de datos SQLite y el DOM.

# conclusion
La IA me ayudo a entender como funciona realmente la comunicacion entre API y mi pagina creada, asi como tambien en el apoyo de manejo y funciones con JS, que es lo que hace cada linea y comprender sus condiciones.