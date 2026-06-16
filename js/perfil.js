// ==========================
// API
// ==========================

const API_URL =
'http://localhost:3000/api';


// ==========================
// INIT
// ==========================

document.addEventListener(
    'DOMContentLoaded',
    () => {

        const token =
        localStorage.getItem(
            'token'
        );

        if (!token) {

            window.location.href =
            'login.html';

            return;

        }

        cargarDatosPerfil(
            token
        );

        configurarBotonVolver();

        configurarPassword();

        configurarCancelar();

    }
);


// ==========================
// HELPERS
// ==========================

function capitalizar(texto) {

    if (!texto)
        return '';

    return texto
        .toLowerCase()
        .replace(
            /\b\w/g,
            letra => letra.toUpperCase()
        );

}

function formatearMetadata(metadata){

    if(!metadata)
        return '';

    if(typeof metadata === 'object'){

        return (
            metadata.other_interests
            ||
            metadata.favorite_sport
            ||
            ''
        );

    }

    return metadata;

}

function limpiarErrores() {

    document
        .querySelectorAll(
            '.input-error'
        )
        .forEach(
            e => e.classList.remove(
                'input-error'
            )
        );

    document
        .querySelectorAll(
            '.error-msg'
        )
        .forEach(
            e => e.textContent = ''
        );

}

function mostrarError(
    input,
    error,
    mensaje
) {

    document
        .getElementById(input)
        .classList
        .add(
            'input-error'
        );

    document
        .getElementById(error)
        .textContent =
        mensaje;

}


// ==========================
// CARGAR PERFIL
// ==========================

async function cargarDatosPerfil(
    token
) {

    try {

        const respuesta =
        await fetch(
            `${API_URL}/auth/me`,
            {
                headers: {
                    Authorization:
                    `Bearer ${token}`
                }
            }
        );

        const resultado =
        await respuesta.json();

        if (!respuesta.ok) {

            throw new Error();

        }

        const usuario =
        resultado.data
        ||
        resultado;

        renderizarDatosUsuario(
            usuario
        );

    }

    catch {

        document
            .getElementById(
                'previewNombre'
            )
            .textContent =
            'Error al cargar';

    }

}


// ==========================
// RENDER PERFIL
// ==========================

function renderizarDatosUsuario(
    usuario
) {

    document
        .getElementById(
            'previewNombre'
        )
        .textContent =
        capitalizar(
            usuario.full_name
            ||
            'Sin nombre'
        );

    document
        .getElementById(
            'previewEmail'
        )
        .textContent =
        (
            usuario.email
            ||
            ''
        )
        .toLowerCase();


    document
        .getElementById(
            'previewFechaReg'
        )
        .textContent =

        usuario.created_at

        ?

        new Date(
            usuario.created_at
        ).toLocaleDateString(
            'es-CL'
        )

        :

        'N/A';


    document
        .getElementById(
            'previewFechaNac'
        )
        .textContent =

        usuario.birth_date

        ?

        new Date(
            usuario.birth_date
        ).toLocaleDateString(
            'es-CL'
        )

        :

        'N/A';


    const badge =

    document
    .getElementById(
        'previewRol'
    );

    badge.textContent =
    usuario.role;

    badge.className =
    'badge';

    if (
        usuario.role
        ===
        'admin'
    ) {

        badge.classList.add(
            'bg-admin'
        );

    }

    else if (
        usuario.role
        ===
        'coach'
    ) {

        badge.classList.add(
            'bg-coach'
        );

    }

    else {

        badge.classList.add(
            'bg-user'
        );

    }


    document
        .getElementById(
            'inputNombre'
        )
        .value =
        capitalizar(
            usuario.full_name
            ||
            ''
        );


    document
        .getElementById(
            'inputEmail'
        )
        .value =
        (
            usuario.email
            ||
            ''
        )
        .toLowerCase();


    document
        .getElementById(
            'inputFechaNac'
        )
        .value =

        usuario.birth_date

        ?

        new Date(
            usuario.birth_date
        )
        .toISOString()
        .split(
            'T'
        )[0]

        :

        '';


    document
        .getElementById(
            'inputDeporte'
        )
        .value =

        usuario.favorite_sport

        ||

        usuario.metadata?.favorite_sport

        ||

        '';


    document
        .getElementById(
            'inputMetadata'
        )
        .value =
        formatearMetadata(
            usuario.metadata
        );

}


// ==========================
// BOTÓN VOLVER
// ==========================

function configurarBotonVolver() {
    const btnVolver = document.getElementById('btnVolver');
    
    if (btnVolver) {
        btnVolver.addEventListener('click', () => {
            const userObj = JSON.parse(localStorage.getItem("user"));
            const rolUsuario = userObj ? userObj.role : 'user';
            
            // Usamos la ruta absoluta desde la raíz (/pages/...)
            if (rolUsuario === 'admin') {
                window.location.href = '/pages/dashboard_admin.html';
            } else if (rolUsuario === 'coach') {
                window.location.href = './pages/dashboard_coach.html';
            } else {
                window.location.href = '../pages/dashboard_usuario.html';
            }
        });
    }
}


// ==========================
// PASSWORD
// ==========================

function configurarPassword() {

    document
        .querySelectorAll(
            '.toggle-password'
        )
        .forEach(
            boton => {

                boton
                .addEventListener(
                    'click',
                    function(){

                        const input =
                        this.previousElementSibling;

                        input.type =

                        input.type
                        ===
                        'password'

                        ?

                        'text'

                        :

                        'password';

                    }
                );

            }
        );

}


// ==========================
// CANCELAR
// ==========================

function configurarCancelar(){

const btn=
document.getElementById(
'btnCancelarPerfil'
);

if(!btn)
return;

btn.addEventListener(
'click',
()=>{

window.location.reload();

}
);

}


// ======================
// PERFIL
// ======================

document
.getElementById(
'formPerfil'
)
.addEventListener(
'submit',

async(e)=>{

e.preventDefault();

limpiarErrores();

const nombre=
document
.getElementById(
'inputNombre'
)
.value
.trim();

const fecha=
document
.getElementById(
'inputFechaNac'
)
.value;

let ok=
true;

if(!nombre){

mostrarError(
'inputNombre',
'errorNombre',
'El nombre es obligatorio'
);

ok=false;

}

if(!fecha){

mostrarError(
'inputFechaNac',
'errorFechaNac',
'La fecha es obligatoria'
);

ok=false;

}

if(!ok)
return;

const body={

full_name:nombre,

birth_date:fecha,

metadata:{

favorite_sport:

document
.getElementById(
'inputDeporte'
)
.value,

other_interests:

document
.getElementById(
'inputMetadata'
)
.value

}

};

try{

await fetch(
`${API_URL}/auth/me`,
{

method:'PUT',

headers:{

Authorization:
`Bearer ${localStorage.getItem('token')}`,

'Content-Type':
'application/json'

},

body:
JSON.stringify(
body
)

}

);

document
.getElementById(
'previewNombre'
)
.textContent=
capitalizar(
nombre
);

document
.getElementById(
'alertPerfilSuccess'
)
.classList
.remove(
'd-none'
);

setTimeout(
()=>{

document
.getElementById(
'alertPerfilSuccess'
)
.classList
.add(
'd-none'
);

},
3000
);

}

catch{

alert(
'Error'
);

}

}
);


// ======================
// PASSWORD
// ======================

function configurarPassword(){

document
.getElementById(
'formPassword'
)
.addEventListener(
'submit',

e=>{

e.preventDefault();

const nueva=

document
.getElementById(
'inputPasswordNueva'
)
.value;

const confirmar=

document
.getElementById(
'inputPasswordConfirmar'
)
.value;

if(
nueva.length
<
8
){

mostrarError(
'inputPasswordNueva',
'errorPasswordNueva',
'Debe tener mínimo 8 caracteres'
);

return;

}

if(
nueva
!==confirmar
){

mostrarError(
'inputPasswordConfirmar',
'errorPasswordConfirmar',
'Las contraseñas no coinciden'
);

return;

}

document
.getElementById(
'alertPasswordSuccess'
)
.classList
.remove(
'd-none'
);

setTimeout(
()=>{

document
.getElementById(
'alertPasswordSuccess'
)
.classList
.add(
'd-none'
);

},
3000
);

}

);

}


// ======================
// TOGGLE PASSWORD
// ======================

document
.querySelectorAll(
'.toggle-password'
)
.forEach(
b=>{

b.addEventListener(
'click',

function(){

const input=

this
.previousElementSibling;

input.type=

input.type
===
'password'

?

'text'

:

'password';

}

);

}
);


// ======================
// CANCELAR
// ======================

function configurarCancelar(){

const btn=
document
.getElementById(
'btnCancelarPerfil'
);

if(btn){

btn.onclick=
()=>location.reload();

}

}