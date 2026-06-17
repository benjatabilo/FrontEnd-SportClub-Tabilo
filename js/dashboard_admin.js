// REFERENCIAS DOM
const tableBody = document.getElementById("usuariosTableBody");
const logoutBtn = document.getElementById("logoutBtn");
const crudForm = document.getElementById("crudForm");
const formDynamicTitle = document.getElementById("formDynamicTitle");
const containerCamposClave = document.getElementById("containerCamposClave");
const crudGlobalFeedback = document.getElementById("crudGlobalFeedback");
const seccionFormularioUsuario = document.getElementById("seccionFormularioUsuario");

const hiddenUserId = document.getElementById("formUserId");
const inputFullName = document.getElementById("inputFullName");
const inputEmail = document.getElementById("inputEmail");
const selectRole = document.getElementById("selectRole");
const inputPassword = document.getElementById("inputPassword");
const inputConfirmPassword = document.getElementById("inputConfirmPassword");

const totalUsuariosCount = document.getElementById("totalUsuariosCount");
const totalCoachesCount = document.getElementById("totalCoachesCount");

// AUTENTICACIÓN
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "./login.html";
}

// INICIO
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://localhost:3000/api/auth/me", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = await response.json();
        if (!response.ok) throw new Error();

        const usuario = result.data || result;

        // VALIDAR ADMIN
        if (usuario.role !== "admin") {
            localStorage.clear();
            window.location.href = "./login.html";
            return;
        }

        // GUARDAR USUARIO
        localStorage.setItem("user", JSON.stringify(usuario));

        // BIENVENIDA
        const welcome = document.getElementById("welcomeMessage");
        if (welcome) welcome.textContent = `Bienvenido/a, ${usuario.full_name}`;

        // CARGAR TABLA Y EVENTOS
        cargarUsuarios();
        crudForm.addEventListener("submit", procesarFormulario);
        document.getElementById("btnCancelarForm").addEventListener("click", resetearFormularioAModoCrear);
        document.getElementById("btnIrAlFormulario").addEventListener("click", () => {
            resetearFormularioAModoCrear();
            seccionFormularioUsuario.style.display = "block";
            seccionFormularioUsuario.scrollIntoView({ behavior: "smooth" });
        });
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = "../index.html";
        });
    } catch (error) {
        console.log(error);
        localStorage.clear();
        window.location.href = "./login.html";
    }
});

// FUNCIONES CRUD

async function cargarUsuarios() {
    try {
        const response = await fetch("http://localhost:3000/api/users", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await response.json();
        if (!response.ok) throw new Error();

        const listaUsuarios = result.data || [];
        actualizarCardsSuperiores(listaUsuarios);
        tableBody.innerHTML = "";

        listaUsuarios.forEach(user => {
            const tr = document.createElement("tr");
            const badgeClass = `bg-${user.role}`;
            const fechaFormateada = formatearFecha(user.createdAt || user.created_at);

            tr.innerHTML = `
                <td><strong>#${user.id}</strong></td>
                <td>${user.full_name}</td>
                <td>${user.email}</td>
                <td><span class="badge ${badgeClass}">${user.role}</span></td>
                <td>${fechaFormateada}</td>
                <td class="text-center">
                    <button class="btn-action btn-edit" onclick="activarModoEdicionInSitu(${user.id}, '${user.full_name}', '${user.email}', '${user.role}')">Editar</button>
                    <button class="btn-action btn-delete" onclick="eliminarUsuarioId(${user.id})">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error al renderizar la tabla:", error);
    }
}

window.activarModoEdicionInSitu = function(id, name, email, role) {
    limpiarErroresEstilos();
    hiddenUserId.value = id;
    inputFullName.value = name;
    inputEmail.value = email;
    selectRole.value = role;
    formDynamicTitle.textContent = `Editar Usuario #${id}`;
    containerCamposClave.style.display = "none";
    seccionFormularioUsuario.style.display = "block";
    seccionFormularioUsuario.scrollIntoView({ behavior: "smooth" });
};

function resetearFormularioAModoCrear() {
    limpiarErroresEstilos();
    crudForm.reset();
    hiddenUserId.value = "";
    formDynamicTitle.textContent = "Nuevo Usuario";
    containerCamposClave.style.display = "grid";
    seccionFormularioUsuario.style.display = "none";
}

async function procesarFormulario(e) {
    e.preventDefault();
    limpiarErroresEstilos();

    let formularioValido = true;
    const esModoEdicion = hiddenUserId.value !== "";

    if (!inputFullName.value.trim()) { encenderErrorVisual(inputFullName, "errName"); formularioValido = false; }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inputEmail.value.trim() || !emailRegex.test(inputEmail.value)) { encenderErrorVisual(inputEmail, "errEmail"); formularioValido = false; }

    if (!esModoEdicion) {
        if (inputPassword.value.length < 8) { encenderErrorVisual(inputPassword, "errPassword"); formularioValido = false; }
        if (inputPassword.value !== inputConfirmPassword.value) { encenderErrorVisual(inputConfirmPassword, "errConfirmPassword"); formularioValido = false; }
    }

    if (!formularioValido) return;

    const url = esModoEdicion ? `http://localhost:3000/api/users/${hiddenUserId.value}` : "http://localhost:3000/api/users";
    const metodoHttp = esModoEdicion ? "PUT" : "POST";
    const payload = esModoEdicion 
        ? { full_name: inputFullName.value, email: inputEmail.value, role: selectRole.value }
        : { full_name: inputFullName.value, email: inputEmail.value, role: selectRole.value, password: inputPassword.value };

    try {
        const response = await fetch(url, {
            method: metodoHttp,
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            lanzarFeedbackNotificacion(esModoEdicion ? "¡Usuario modificado con éxito!" : "¡Usuario registrado correctamente!");
            resetearFormularioAModoCrear();
            cargarUsuarios();
        }
    } catch (err) { console.error("Fallo de red:", err); }
}

window.eliminarUsuarioId = async function(id) {
    if (!confirm(`¿Está seguro de eliminar al usuario #${id}?`)) return;
    try {
        const response = await fetch(`http://localhost:3000/api/users/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
            lanzarFeedbackNotificacion("Usuario eliminado.");
            cargarUsuarios();
        }
    } catch (err) { console.error("Error al eliminar:", err); }
};

// HELPERS
function encenderErrorVisual(el, id) { el.classList.add("input-error"); document.getElementById(id).style.display = "block"; }
function limpiarErroresEstilos() {
    crudForm.querySelectorAll("input, select").forEach(i => i.classList.remove("input-error"));
    crudForm.querySelectorAll(".error-msg").forEach(m => m.style.display = "none");
}
function lanzarFeedbackNotificacion(msj) {
    crudGlobalFeedback.textContent = msj;
    crudGlobalFeedback.style.display = "block";
    setTimeout(() => { crudGlobalFeedback.style.display = "none"; }, 4000);
}
function formatearFecha(f) {

    if (!f) return new Date().toLocaleDateString('es-CL');

    const d = new Date(f);

    return isNaN(d.getTime()) ? new Date().toLocaleDateString('es-CL') : d.toLocaleDateString('es-CL');
}
function actualizarCardsSuperiores(u) {
    totalUsuariosCount.textContent = u.length;
    totalCoachesCount.textContent = u.filter(user => user.role === "coach").length;
}