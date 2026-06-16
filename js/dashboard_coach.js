// ==========================
// API
// ==========================

const API_URL =
'http://localhost:3000/api';


// ==========================
// INICIO
// ==========================

document.addEventListener(
'DOMContentLoaded',

async ()=>{

const token=
localStorage.getItem(
'token'
);

if(!token){

window.location.href=
'login.html';

return;

}

await cargarCoach();

}

);


// ==========================
// CARGAR COACH
// ==========================

async function cargarCoach(){

try{

const token=
localStorage.getItem(
'token'
);

const respuesta=
await fetch(

`${API_URL}/auth/me`,

{

method:'GET',

headers:{

'Authorization':
`Bearer ${token}`,

'Content-Type':
'application/json'

}

}

);

const resultado=
await respuesta.json();

if(!respuesta.ok){

throw new Error();

}

const usuario=
resultado.data
?
resultado.data
:
resultado;

mostrarBienvenida(
usuario
);

}

catch(error){

console.log(error);

}

}


// ==========================
// BIENVENIDA
// ==========================

function mostrarBienvenida(
usuario
){

const titulo=
document.getElementById(
'welcomeTitle'
);

if(!titulo)
return;

const nombreCompleto=

(
usuario.full_name
||
usuario.name
||
'Usuario'
)

.trim();

titulo.textContent=
`Bienvenido ${nombreCompleto}`;

}