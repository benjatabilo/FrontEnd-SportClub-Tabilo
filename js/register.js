// js/register.js

const form = document.getElementById("registerForm");
const mensajeError = document.getElementById("registerMessage");
const mensajeExito = document.querySelector(".mensaje-exito");

// Función para mostrar errores de forma clara
function mostrarError(texto, inputElement = null) {
    mensajeError.style.display = "block";
    mensajeError.textContent = texto;
    
    // Si pasamos el input, le ponemos borde rojo
    if (inputElement) {
        inputElement.style.borderColor = "red";
    }
}

// Función para limpiar estados previos
function ocultarMensajes() {
    mensajeError.style.display = "none";
    mensajeExito.style.display = "none";
    
    // Limpiar bordes de todos los inputs
    const inputs = form.querySelectorAll("input, select, textarea");
    inputs.forEach(input => input.style.borderColor = "");
}

form.addEventListener("submit", async function (e) {
    e.preventDefault();
    ocultarMensajes();

    // Captura de datos
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const fecha = document.getElementById("fechaNacimiento").value;
    const actividad = document.getElementById("actividad").value;

    // --- VALIDACIONES ---
    if (!nombre || !correo || !password || !confirmPassword) {
        mostrarError("Complete todos los campos obligatorios");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        mostrarError("Correo inválido", document.getElementById("correo"));
        return;
    }

    if (password.length < 8) {
        mostrarError("La contraseña debe tener mínimo 8 caracteres", document.getElementById("password"));
        return;
    }

    const segura = /^(?=.*[A-Za-z])(?=.*\d)/;
    if (!segura.test(password)) {
        mostrarError("La contraseña debe contener letras y números", document.getElementById("password"));
        return;
    }

    if (password !== confirmPassword) {
        mostrarError("Las contraseñas no coinciden", document.getElementById("confirmPassword"));
        return;
    }

    // --- ENVÍO A API ---
    try {
        const response = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                full_name: nombre,
                email: correo,
                password: password,
                role: "user",
                must_change_password: false,
                birth_date: fecha || null,
                metadata: {
                    sports: [{
                        name: actividad || "general",
                        frequency_per_week: 3
                    }]
                }
            })
        });

        const result = await response.json();

        if (!response.ok || !result.ok) {
            mostrarError(result.message || "No se pudo registrar, intente nuevamente");
            return;
        }

        // Éxito
        mensajeExito.style.display = "block";
        mensajeExito.textContent = "Usuario registrado correctamente.";
        
        // Redirección tras 1.5s
        setTimeout(() => {
            window.location.href = "./login.html";
        }, 1500);

    } catch (error) {
        console.error("Error al conectar:", error);
        mostrarError("Error crítico al conectar con el servidor.");
    }
});