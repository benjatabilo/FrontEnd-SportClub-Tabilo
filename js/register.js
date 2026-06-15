const form =
document.getElementById("registerForm");

const mensajeError =
document.querySelectorAll(".mensaje-error");

const mensajeExito =
document.querySelector(".mensaje-exito");

form.addEventListener(
"submit",
async function (e) {

e.preventDefault();

ocultarMensajes();

const nombre =
document
.getElementById("nombre")
.value
.trim();

const correo =
document
.getElementById("correo")
.value
.trim();

const password =
document
.getElementById("password")
.value;

const confirmPassword =
document
.getElementById("confirmPassword")
.value;

const fecha =
document
.getElementById("fechaNacimiento")
.value;

const actividad =
document
.getElementById("actividad")
.value;


// VALIDACIONES

if (
!nombre ||
!correo ||
!password ||
!confirmPassword
) {

mostrarError(
"Complete todos los campos obligatorios"
);

return;

}

const emailRegex =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (
!emailRegex.test(correo)
) {

mostrarError(
"Correo inválido"
);

return;

}

if (
password.length < 8
) {

mostrarError(
"La contraseña debe tener mínimo 8 caracteres"
);

return;

}

const segura =
/^(?=.*[A-Za-z])(?=.*\d)/;

if (
!segura.test(password)
) {

mostrarError(
"Debe contener letras y números"
);

return;

}

if (
password !==
confirmPassword
) {

mostrarError(
"Las contraseñas no coinciden"
);

return;

}


// ENVÍO

try {

const response =
await fetch(
"http://localhost:3000/api/auth/register",
{

method:
"POST",

headers: {

"Content-Type":
"application/json"

},

body:
JSON.stringify({

full_name:
nombre,

email:
correo,

password:
password,

role:
"user",

must_change_password:
false,

birth_date:
fecha || null,

metadata: {

sports: [

{

name:
actividad || "general",

frequency_per_week:
3

}

]

}

})

}

);

const result =
await response.json();

console.log(result);

if (
!response.ok ||
!result.ok
) {

mostrarError(
result.message ||
"No se pudo registrar"
);

return;

}

mensajeExito.style.display =
"block";

mensajeExito.textContent =
"Usuario registrado correctamente";

setTimeout(
function () {

window.location.href =
"./login.html";

},
1500
);

}

catch (error) {

console.error(error);

mostrarError(
"Error al conectar servidor"
);

}

}

);


function mostrarError(texto) {

mensajeError.forEach(
function (e) {

e.style.display =
"none";

}
);

mensajeError[0]
.style.display =
"block";

mensajeError[0]
.textContent =
texto;

}


function ocultarMensajes() {

mensajeError.forEach(
function (e) {

e.style.display =
"none";

}
);

mensajeExito.style.display =
"none";

}