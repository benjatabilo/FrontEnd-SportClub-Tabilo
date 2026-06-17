// API
const API_URL = 'http://localhost:3000/api';

// proteccion de rutas
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = './login.html';
        return;
    }
    
    // Cargar nombre usuario
    await cargarUsuario();
    configurarBotones();
});

// Cargar usuario
async function cargarUsuario() {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const resultado = await respuesta.json();
        const usuario = resultado.data || resultado;
        
        mostrarBienvenida(usuario);
    } catch (error) {
        console.error(error);
    }
}

// bienvenida con nombre de user
function mostrarBienvenida(usuario) {
    const titulo = document.getElementById('welcomeTitle');
    if (!titulo) return;

    const nombreCompleto = (usuario.full_name || usuario.name || 'Usuario').trim();
    titulo.textContent = `Bienvenido ${nombreCompleto}`;
}

// botones de reseva
function configurarBotones() {
    const botones = document.querySelectorAll('.clase-card button');
    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            alert('Clase reservada correctamente');
        });
    });
}