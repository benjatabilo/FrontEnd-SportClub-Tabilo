const form = document.getElementById("registerForm");
const mensajeExito = document.querySelector(".mensaje-exito");
const globalErrorMessage = document.getElementById("registerMessage");

// Elementos de los inputs para poder aplicarles los bordes rojos
const nombreInput = document.getElementById("nombre");
const correoInput = document.getElementById("correo");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

// Elementos spans de error individuales
const errorNombre = document.getElementById("error-nombre");
const errorCorreo = document.getElementById("error-correo");
const errorPassword = document.getElementById("error-password");
const errorConfirmPassword = document.getElementById("error-confirmPassword");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // 1. Limpiar estados, textos y bordes de error de intentos anteriores
    ocultarMensajes();

    const nombre = nombreInput.value.trim();
    const correo = correoInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const fecha = document.getElementById("fechaNacimiento").value;
    const actividad = document.getElementById("actividad").value;

    let hasErrors = false;

    // 2. VALIDACIONES LOCALES CAMPO POR CAMPO (Exigido en Rúbrica)
    if (!nombre) {
        mostrarErrorCampo(nombreInput, errorNombre, "El nombre completo es obligatorio");
        hasErrors = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo) {
        mostrarErrorCampo(correoInput, errorCorreo, "El correo electrónico es obligatorio");
        hasErrors = true;
    } else if (!emailRegex.test(correo)) {
        mostrarErrorCampo(correoInput, errorCorreo, "Por favor, ingrese un correo válido");
        hasErrors = true;
    }

    if (!password) {
        mostrarErrorCampo(passwordInput, errorPassword, "La contraseña es obligatoria");
        hasErrors = true;
    } else if (password.length < 8) {
        mostrarErrorCampo(passwordInput, errorPassword, "La contraseña debe tener mínimo 8 caracteres");
        hasErrors = true;
    } else {
        const segura = /^(?=.*[A-Za-z])(?=.*\d)/;
        if (!segura.test(password)) {
            mostrarErrorCampo(passwordInput, errorPassword, "La contraseña debe contener letras y números");
            hasErrors = true;
        }
    }

    if (!confirmPassword) {
        mostrarErrorCampo(confirmPasswordInput, errorConfirmPassword, "Debe confirmar su contraseña");
        hasErrors = true;
    } else if (password !== confirmPassword) {
        mostrarErrorCampo(confirmPasswordInput, errorConfirmPassword, "Las contraseñas no coinciden");
        hasErrors = true;
    }

    // Detener flujo si hay errores en el frontend
    if (hasErrors) return;

    // 3. ENVÍO SEGURO MEDIANTE FETCH
    try {
        const response = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                full_name: nombre,
                email: correo,
                password: password,
                role: "user",
                must_change_password: false,
                birth_date: fecha || null,
                metadata: {
                    sports: [
                        {
                            name: actividad || "general",
                            frequency_per_week: 3
                        }
                    ]
                }
            })
        });

        const result = await response.json();

        // 4. VALIDAR RESPUESTA DEL BACKEND
        if (!result.ok) {
            // Si el backend reporta un error (ej: El correo ya existe), lo tiramos a la alerta global
            globalErrorMessage.style.display = "block";
            globalErrorMessage.textContent = result.message || "No se pudo completar el registro";
            
            if (result.message && result.message.toLowerCase().includes("email")) {
                correoInput.style.border = "2px solid red";
            }
            return;
        }

        // 5. RESPUESTA EXITOSA
        mensajeExito.style.display = "block";
        mensajeExito.textContent = "¡Usuario registrado correctamente! Redirigiendo...";

        setTimeout(function () {
            window.location.href = "./login.html";
        }, 1500);

    } catch (error) {
        console.error(error);
        globalErrorMessage.style.display = "block";
        globalErrorMessage.textContent = "Error al conectar con el servidor";
    }
});

// Función para renderizar errores específicos por input
function mostrarErrorCampo(inputElement, errorSpan, mensaje) {
    inputElement.style.border = "2px solid red";
    errorSpan.style.display = "block";
    errorSpan.textContent = mensaje;
}

// Función para limpiar la pantalla a su estado original
function ocultarMensajes() {
    // Limpiar mensajes globales
    globalErrorMessage.style.display = "none";
    globalErrorMessage.textContent = "";
    mensajeExito.style.display = "none";

    // Reagrupar inputs y spans para restablecerlos con un bucle limpio
    const inputs = [nombreInput, correoInput, passwordInput, confirmPasswordInput];
    const spans = [errorNombre, errorCorreo, errorPassword, errorConfirmPassword];

    inputs.forEach(input => input.style.border = "1px solid #ccc");
    spans.forEach(span => {
        span.style.display = "none";
        span.textContent = "";
    });
}