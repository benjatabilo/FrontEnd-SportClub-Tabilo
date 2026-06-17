// API
const API_URL = 'http://localhost:3000/api';

// INIT
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    cargarDatosPerfil(token);
    configurarBotonVolver();
    configurarPassword();
    configurarCancelar();
    cambiarModoEdicion(false);
});

// Hepers
function capitalizar(texto) {
    if (!texto) return '';
    return texto.toLowerCase().replace(/\b\w/g, letra => letra.toUpperCase());
}

function formatearMetadata(metadata) {
    if (!metadata) return '';
    if (typeof metadata === 'object') {
        return (metadata.other_interests || metadata.favorite_sport || '');
    }
    return metadata;
}

function limpiarErrores() {
    document.querySelectorAll('.input-error').forEach(e => e.classList.remove('input-error'));
    document.querySelectorAll('.error-msg').forEach(e => e.textContent = '');
}

function mostrarError(input, error, mensaje) {
    document.getElementById(input).classList.add('input-error');
    document.getElementById(error).textContent = mensaje;
}

// Cargar datos
async function cargarDatosPerfil(token) {
    try {
        const respuesta = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const resultado = await respuesta.json();
        if (!respuesta.ok) throw new Error();

        const usuario = resultado.data || resultado;
        renderizarDatosUsuario(usuario);
    } catch {
        document.getElementById('previewNombre').textContent = 'Error al cargar';
    }
}

function renderizarDatosUsuario(usuario) {
    document.getElementById('previewNombre').textContent = capitalizar(usuario.full_name || 'Sin nombre');
    document.getElementById('previewEmail').textContent = (usuario.email || '').toLowerCase();
    document.getElementById('previewFechaReg').textContent = usuario.created_at ? new Date(usuario.created_at).toLocaleDateString('es-CL') : 'N/A';
    document.getElementById('previewFechaNac').textContent = usuario.birth_date ? usuario.birth_date.split('-').reverse().join('-') : 'N/A';

    const badge = document.getElementById('previewRol');
    badge.textContent = usuario.role;
    badge.className = 'badge';
    badge.classList.add(usuario.role === 'admin' ? 'bg-admin' : (usuario.role === 'coach' ? 'bg-coach' : 'bg-user'));

    document.getElementById('inputNombre').value = capitalizar(usuario.full_name || '');
    document.getElementById('inputEmail').value = (usuario.email || '').toLowerCase();
    document.getElementById('inputFechaNac').value = usuario.birth_date || '';
    document.getElementById('inputDeporte').value = usuario.favorite_sport || usuario.metadata?.favorite_sport || '';
    document.getElementById('inputMetadata').value = formatearMetadata(usuario.metadata);
}

// GESTIÓN PERFIL (SUBMIT)
document.getElementById('formPerfil').addEventListener('submit', async (e) => {
    e.preventDefault();
    limpiarErrores();

    const nombre = document.getElementById('inputNombre').value.trim();
    const fecha = document.getElementById('inputFechaNac').value;
    
    if (!nombre) { mostrarError('inputNombre', 'errorNombre', 'El nombre es obligatorio'); return; }
    if (!fecha) { mostrarError('inputFechaNac', 'errorFechaNac', 'La fecha es obligatoria'); return; }

    const body = {
        full_name: nombre,
        birth_date: fecha,
        metadata: {
            favorite_sport: document.getElementById('inputDeporte').value,
            other_interests: document.getElementById('inputMetadata').value
        }
    };

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        if (response.ok) {
            await cargarDatosPerfil(localStorage.getItem('token')); // Refresca UI
            document.getElementById('alertPerfilSuccess').classList.remove('d-none');
            setTimeout(() => document.getElementById('alertPerfilSuccess').classList.add('d-none'), 3000);
            cambiarModoEdicion(false);
        }
    } catch { alert('Error al actualizar perfil'); }
});

// modificar contraseñas
function configurarPassword() {
    document.getElementById('formPassword').addEventListener('submit', async (e) => {
        e.preventDefault();
        limpiarErrores();
        
        const actual = document.getElementById('inputPasswordActual').value;
        const nueva = document.getElementById('inputPasswordNueva').value;
        const confirmar = document.getElementById('inputPasswordConfirmar').value;

        // Validaciones en el cliente
        if (nueva.length < 8) { mostrarError('inputPasswordNueva', 'errorPasswordNueva', 'Mínimo 8 caracteres'); return; }
        if (nueva !== confirmar) { mostrarError('inputPasswordConfirmar', 'errorPasswordConfirmar', 'Las contraseñas no coinciden'); return; }

        try {
            const response = await fetch(`${API_URL}/auth/me/password`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ 
                    current_password: actual,
                    new_password: nueva,
                    confirm_password: confirmar // <--- ESTE CAMPO ES EL QUE TE FALTABA
                })
            });

            if (response.ok) {

                const alerta = document.getElementById('alertPasswordSuccess');
                alerta.textContent = "Contraseña actualizada correctamente";
                alerta.classList.add('alert-success');
                alerta.classList.remove('d-none');
                
                e.target.reset(); // Limpia los campos
                setTimeout(() => {
                    alerta.classList.add('d-none');
                    alerta.classList.remove('alert-success');
                }, 3000);
            } else {
                // Esto maneja errores como contraseña actual incorrecta
                mostrarError('inputPasswordActual', 'errorPasswordActual', 'Contraseña actual incorrecta');
            }
        } catch (err) { 
            console.error(err);
            alert('Error al conectar con el servidor'); 
        }
    });
    

    document.querySelectorAll('.toggle-password').forEach(b => {
        b.addEventListener('click', function() {
            const input = this.previousElementSibling;
            input.type = input.type === 'password' ? 'text' : 'password';
        });
    });
}

// botones formularios
function configurarBotonVolver() {
    document.getElementById('btnVolver')?.addEventListener('click', () => {
        const rol = document.getElementById('previewRol').textContent.trim().toLowerCase();
        window.location.href = rol === 'coach' ? 'dashboard_coach.html' : (rol === 'admin' ? 'dashboard_admin.html' : 'dashboard_usuario.html');
    });
}

function cambiarModoEdicion(estado) {
    ['inputNombre', 'inputFechaNac', 'inputDeporte', 'inputMetadata'].forEach(id => document.getElementById(id).disabled = !estado);
    document.getElementById('accionesPerfil')?.classList.toggle('d-none', !estado);
}

document.getElementById('btnEditarPerfil').addEventListener('click', () => cambiarModoEdicion(true));
document.getElementById('btnCancelarPerfil').addEventListener('click', () => {
    cambiarModoEdicion(false);
    cargarDatosPerfil(localStorage.getItem('token'));
});

function configurarCancelar() {
    const btn = document.getElementById('btnCancelarPerfil');
    if (btn) btn.onclick = () => cambiarModoEdicion(false);
}