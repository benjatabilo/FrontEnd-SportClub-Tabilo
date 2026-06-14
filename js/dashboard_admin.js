// Elementos del DOM basados en la interfaz incrustada
const tableBody = document.getElementById("usuariosTableBody");
const logoutBtn = document.getElementById("logoutBtn");
const containerFormularioUsuario = document.getElementById("containerFormularioUsuario");
const userForm = document.getElementById("userForm");
const formTitle = document.getElementById("formTitle");
const feedbackNotification = document.getElementById("feedbackNotification");

// Inputs del Formulario
const userIdInput = document.getElementById("userId");
const nameInput = document.getElementById("userFullName");
const emailInput = document.getElementById("userEmail");
const passwordInput = document.getElementById("userPassword");
const confirmPasswordInput = document.getElementById("userConfirmPassword");
const roleInput = document.getElementById("userRole");

// Contadores de tarjetas
const totalUsuariosCount = document.getElementById("totalUsuariosCount");
const totalCoachesCount = document.getElementById("totalCoachesCount");

// Seguridad de la ruta (Token y Rol)
const token = localStorage.getItem("token");
const usuarioLogueado = JSON.parse(localStorage.getItem("user"));

if (!token || !usuarioLogueado || usuarioLogueado.role !== "admin") {
    window.location.href = "./login.html";
}

// Inicialización de Eventos
document.addEventListener("DOMContentLoaded", () => {
    cargarUsuarios();
    
    // Listeners para abrir, cerrar y cancelar el bloque inferior
    document.getElementById("btnAbrirCrear").addEventListener("click", abrirFormularioParaCrear);
    document.getElementById("btnCancelarForm").addEventListener("click", ocultarFormularioCompleto);
    document.getElementById("btnCerrarCruz").addEventListener("click", ocultarFormularioCompleto);
    
    userForm.addEventListener("submit", procesarFormulario);
    
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = "../index.html";
    });
});

// GET: Cargar usuarios e inyectar filas
async function cargarUsuarios() {
    try {
        const response = await fetch("http://localhost:3000/api/users", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await response.json();
        if (!response.ok) throw new Error();

        const usuarios = result.data || [];
        actualizarContadores(usuarios);
        tableBody.innerHTML = "";

        usuarios.forEach(user => {
            const tr = document.createElement("tr");
            
            let badgeColor = "#22c55e"; // user -> verde
            if (user.role === "coach") badgeColor = "#3b82f6"; // coach -> azul
            if (user.role === "admin") badgeColor = "#a855f7"; // admin -> morado

            const fechaFormateada = formatearFecha(user.createdAt || user.created_at);

            tr.innerHTML = `
                <td><strong>#${user.id}</strong></td>
                <td>${user.full_name}</td>
                <td>${user.email}</td>
                <td><span style="background-color: ${badgeColor}; color: white; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase;">${user.role}</span></td>
                <td>${fechaFormateada}</td>
                <td style="text-align: center;">
                    <button onclick="abrirFormularioParaEditar(${user.id}, '${user.full_name}', '${user.email}', '${user.role}')" style="background: #2E1A47; color: white; border: none; padding: 6px 12px; margin-right: 5px; border-radius: 6px; cursor: pointer; font-weight: bold;">Editar</button>
                    <button onclick="eliminarUsuario(${user.id})" style="background: #b91c1c; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: bold;">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (err) {
        mostrarFeedback("Error crítico al leer datos de la API", "error");
    }
}

// Muestra el formulario abajo en modo Creación
function abrirFormularioParaCrear() {
    limpiarErroresVisuales();
    userForm.reset();
    userIdInput.value = "";
    formTitle.innerHTML = `<span style="font-size: 18px;">👤</span> Nuevo Usuario`;
    
    document.getElementById("emailGroup").style.display = "flex";
    document.getElementById("passwordGroup").style.display = "grid"; // Muestra claves
    
    // Acción clave: Hacerlo visible en el flujo del documento sin popups
    containerFormularioUsuario.style.display = "block";
    containerFormularioUsuario.scrollIntoView({ behavior: 'smooth' });
}

// Muestra el formulario abajo en modo Edición
window.abrirFormularioParaEditar = function(id, name, email, role) {
    limpiarErroresVisuales();
    userIdInput.value = id;
    nameInput.value = name;
    emailInput.value = email;
    roleInput.value = role;
    
    formTitle.innerHTML = `<span style="font-size: 18px;">📝</span> Editar Usuario #${id}`;
    document.getElementById("passwordGroup").style.display = "none"; // Oculta claves en edición
    
    // Hacerlo visible abajo de la tabla
    containerFormularioUsuario.style.display = "block";
    containerFormularioUsuario.scrollIntoView({ behavior: 'smooth' });
};

function ocultarFormularioCompleto() {
    limpiarErroresVisuales();
    userForm.reset();
    containerFormularioUsuario.style.display = "none";
}

// POST y PUT con validación manual en pantalla
async function procesarFormulario(e) {
    e.preventDefault();
    limpiarErroresVisuales();
    
    let esValido = true;
    const isEdit = userIdInput.value !== "";

    // Validar nombre obligatorio
    if (!nameInput.value.trim()) {
        marcarError(nameInput, "errName");
        esValido = false;
    }

    // Validaciones exclusivas al crear
    if (!isEdit) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
            marcarError(emailInput, "errEmail");
            esValido = false;
        }
        if (passwordInput.value.length < 8) {
            marcarError(passwordInput, "errPassword");
            esValido = false;
        }
        if (passwordInput.value !== confirmPasswordInput.value) {
            marcarError(confirmPasswordInput, "errConfirmPassword");
            esValido = false;
        }
    }

    if (!esValido) return;

    const url = isEdit ? `http://localhost:3000/api/users/${userIdInput.value}` : "http://localhost:3000/api/users";
    const method = isEdit ? "PUT" : "POST";
    
    const bodyData = isEdit 
        ? { full_name: nameInput.value, role: roleInput.value }
        : { full_name: nameInput.value, email: emailInput.value, password: passwordInput.value, role: roleInput.value };

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyData)
        });

        const result = await response.json();

        if (response.ok) {
            ocultarFormularioCompleto();
            mostrarFeedback(isEdit ? "¡Usuario actualizado correctamente!" : "¡Usuario creado con éxito!", "success");
            cargarUsuarios();
        } else {
            mostrarFeedback(result.message || "Error en la operación", "error");
        }
    } catch (error) {
        mostrarFeedback("Fallo de conexión con el servidor", "error");
    }
}

// DELETE: Eliminar registro
window.eliminarUsuario = async function(id) {
    if (!confirm(`¿Confirmas la eliminación definitiva del usuario #${id}?`)) return;

    try {
        const response = await fetch(`http://localhost:3000/api/users/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            mostrarFeedback("Usuario eliminado del sistema correctamente.", "success");
            cargarUsuarios();
        } else {
            mostrarFeedback("No se pudo eliminar el recurso.", "error");
        }
    } catch (err) {
        mostrarFeedback("Error de red al intentar eliminar.", "error");
    }
};

// Controladores visuales de errores
function marcarError(inputElement, errorId) {
    inputElement.classList.add("input-error");
    document.getElementById(errorId).style.display = "block";
}

function limpiarErroresVisuales() {
    const inputs = userForm.querySelectorAll("input, select");
    inputs.forEach(input => input.classList.remove("input-error"));
    const messages = userForm.querySelectorAll(".error-msg");
    messages.forEach(msg => msg.style.display = "none");
}

function mostrarFeedback(mensaje, tipo) {
    feedbackNotification.textContent = mensaje;
    feedbackNotification.style.display = "block";
    if (tipo === "success") {
        feedbackNotification.style.backgroundColor = "#d1fae5";
        feedbackNotification.style.color = "#065f46";
    } else {
        feedbackNotification.style.backgroundColor = "#fee2e2";
        feedbackNotification.style.color = "#991b1b";
    }
    setTimeout(() => { feedbackNotification.style.display = "none"; }, 4000);
}

function formatearFecha(fechaString) {
    if (!fechaString) return "14/06/2026";
    const fecha = new Date(fechaString);
    if (isNaN(fecha.getTime())) return "14/06/2026";
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

function actualizarContadores(usuarios) {
    if (totalUsuariosCount) totalUsuariosCount.textContent = usuarios.length;
    if (totalCoachesCount) totalCoachesCount.textContent = usuarios.filter(u => u.role === "coach").length;
}