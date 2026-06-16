// --- URL base de tu API ---
const API_URL = 'http://localhost:3000/api'; 

// --- 1. Inicialización y Protección de Ruta ---
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Cargamos los datos del usuario logueado
    cargarDatosPerfil(token);

    // Configuramos el botón de volver
    configurarBotonVolver();
});

// --- 2. Función para obtener los datos de la API ---
async function cargarDatosPerfil(token) {
    try {
        const respuesta = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const resultado = await respuesta.json();
        
        if (!respuesta.ok) {
            throw new Error(resultado.message || 'Error al autenticar el usuario');
        }

        const usuario = resultado.data ? resultado.data : resultado;
        renderizarDatosUsuario(usuario);

    } catch (error) {
        console.error("Error en la carga:", error);
        document.getElementById('previewNombre').textContent = "Error al cargar datos";
    }
}

// --- 3. Renderizado de Datos ---
function renderizarDatosUsuario(usuario) {
    document.getElementById('previewNombre').textContent = usuario.full_name || 'Sin nombre';
    document.getElementById('previewEmail').textContent = usuario.email || 'Sin correo';
    
    const fechaRegistro = usuario.created_at ? new Date(usuario.created_at).toLocaleDateString('es-CL') : 'N/A';
    const fechaNac = usuario.birth_date ? new Date(usuario.birth_date).toLocaleDateString('es-CL') : 'N/A';
    
    document.getElementById('previewFechaReg').textContent = fechaRegistro;
    document.getElementById('previewFechaNac').textContent = fechaNac;

    const badgeRol = document.getElementById('previewRol');
    badgeRol.textContent = usuario.role;
    
    badgeRol.className = 'badge px-3 py-2 fs-7 '; 
    if (usuario.role === 'admin') {
        badgeRol.classList.add('bg-danger');
    } else if (usuario.role === 'coach') {
        badgeRol.classList.add('bg-primary');
    } else {
        badgeRol.classList.add('bg-success');
    }

    document.getElementById('inputNombre').value = usuario.full_name || '';
    document.getElementById('inputEmail').value = usuario.email || '';
    
    if (usuario.birth_date) {
        const fechaFormatoInput = new Date(usuario.birth_date).toISOString().split('T')[0];
        document.getElementById('inputFechaNac').value = fechaFormatoInput;
    }

    document.getElementById('inputDeporte').value = usuario.favorite_sport || '';
    document.getElementById('inputMetadata').value = usuario.metadata || '';
}

// --- 4. Botón de Volver (Corregido con clave 'role') ---
function configurarBotonVolver() {
    const btnVolver = document.getElementById('btnVolver');
    btnVolver.addEventListener('click', () => {
        // Estandarizado a 'role' para coincidir con el login
        const rolUsuario = localStorage.getItem('role') || 'user'; 
        
        if (rolUsuario === 'admin') {
            window.location.href = 'admin_dashboard.html';
        } else if (rolUsuario === 'coach') {
            window.location.href = 'coach_dashboard.html';
        } else {
            window.location.href = 'user_dashboard.html';
        }
    });
}

// --- 5. Lógica para Actualizar Información Personal ---
document.getElementById('formPerfil').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('inputNombre').value.trim();
    const fechaNac = document.getElementById('inputFechaNac').value;
    const deporte = document.getElementById('inputDeporte').value.trim();
    const metadataTexto = document.getElementById('inputMetadata').value.trim();

    let formularioValido = true;
    if (!nombre) {
        document.getElementById('inputNombre').classList.add('is-invalid');
        formularioValido = false;
    }
    if (!fechaNac) {
        document.getElementById('inputFechaNac').classList.add('is-invalid');
        formularioValido = false;
    }
    if (!formularioValido) return;

    const datosActualizados = {
        full_name: nombre,
        birth_date: fechaNac,
        metadata: { favorite_sport: deporte, other_interests: metadataTexto }
    };

    try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${API_URL}/auth/me`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(datosActualizados)
        });

        if (respuesta.ok) {
            const alertSuccess = document.getElementById('alertPerfilSuccess');
            alertSuccess.classList.remove('d-none');
            document.getElementById('previewNombre').textContent = nombre;
            setTimeout(() => alertSuccess.classList.add('d-none'), 3000);
        }
    } catch (error) {
        console.error("Error al guardar:", error);
    }
});

// --- 6. Lógica de Cambio de Contraseña y UX de Inputs ---
document.getElementById('formPassword').addEventListener('submit', async (e) => {
    e.preventDefault();
    // (Tu lógica de validación de contraseña ya estaba bien implementada aquí)
    // ...
});

document.querySelectorAll('.toggle-password').forEach(boton => {
    boton.addEventListener('click', function() {
        const input = this.previousElementSibling;
        input.type = (input.type === 'password') ? 'text' : 'password';
    });
});