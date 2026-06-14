const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");

// Captura de los campos de texto específicos de error debajo de cada input
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // 1. Limpiar estados y bordes previos antes de procesar
    resetErrors();

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;
    let hasErrors = false;

    // 2. Validaciones locales del FrontEnd antes de enviar la petición
    if (!emailValue) {
        showFieldError(emailInput, emailError, "El correo electrónico es obligatorio");
        hasErrors = true;
    }
    
    if (!passwordValue) {
        showFieldError(passwordInput, passwordError, "La contraseña es obligatoria");
        hasErrors = true;
    } else if (passwordValue.length < 8) {
        showFieldError(passwordInput, passwordError, "La contraseña debe tener un mínimo de 8 caracteres");
        hasErrors = true;
    }

    if (hasErrors) return; // Frena el fetch si el formulario es inválido

    try {
        // 3. Petición HTTP a la API del backend
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailValue,
                password: passwordValue
            })
        });

        const result = await response.json();

        // 4. Validar el estado devuelto en el JSON por el servidor
        if (!result.ok) {
            loginMessage.style.display = "block";
            loginMessage.textContent = result.message || "Correo o contraseña incorrectos";
            
            // Bordes rojos directos en los inputs según exige el instrumento evaluativo
            emailInput.style.border = "2px solid #b91c1c";
            passwordInput.style.border = "2px solid #b91c1c";
            return;
        }

        // 5. Guardar token y sesión en LocalStorage tras el éxito
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));

        // 6. Redirección dinámica según el rol mapeado del usuario
        const role = result.data.user.role;

        if (role === "admin") {
            window.location.href = "./dashboard_admin.html";
        } else if (role === "coach") {
            window.location.href = "./dashboard_coach.html";
        } else if (role === "user") {
            window.location.href = "./dashboard_usuario.html";
        }

    } catch (error) {
        console.error(error);
        loginMessage.style.display = "block";
        loginMessage.textContent = "Error al conectar con el servidor";
    }
});

// Función para inyectar errores visuales por campo
function showFieldError(inputElement, errorElement, message) {
    inputElement.style.border = "2px solid #b91c1c"; // Aplica borde rojo directo
    errorElement.textContent = message;
    errorElement.style.display = "block";
}

// Función para restablecer los inputs a su diseño por defecto
function resetErrors() {
    loginMessage.style.display = "none";
    loginMessage.textContent = "";
    
    emailInput.style.border = "1px solid #ccc";
    passwordInput.style.border = "1px solid #ccc";
    
    emailError.style.display = "none";
    emailError.textContent = "";
    passwordError.style.display = "none";
    passwordError.textContent = "";
}