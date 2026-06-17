// Selección de elementos del DOM
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");

// Evento de escucha para el envío del formulario
loginForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita que la página se recargue

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;

    // Reset de estilos y mensajes de error
    loginMessage.style.display = "none";
    loginMessage.style.color = "red";
    emailInput.style.borderColor = "";
    passwordInput.style.borderColor = "";

    // 1. Validación de campos vacíos (Requerimiento de rúbrica) [cite: 86]
    if (!emailValue || !passwordValue) {
        loginMessage.style.display = "block";
        loginMessage.textContent = "Todos los campos son obligatorios.";
        
        if (!emailValue) emailInput.style.borderColor = "red";
        if (!passwordValue) passwordInput.style.borderColor = "red";
        return;
    }

    try {
        // 2. Consumo de API (Requerimiento de rúbrica) [cite: 55, 92]
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

        // 3. Manejo de respuesta
        if (!result.ok) {
            loginMessage.style.display = "block";
            loginMessage.textContent = result.message || "Correo o contraseña incorrectos";
            return;
        }

        // Guardar token y datos de usuario en localStorage
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));

        localStorage.setItem("role", result.data.user.role);

        // 4. Redirección según rol (Requerimiento de rúbrica) [cite: 60]
        const role = result.data.user.role;
        
        // Ajusta las rutas según donde tengas tus archivos HTML
        if (role === "admin") {
            window.location.href = "../pages/dashboard_admin.html";
        } else if (role === "coach") {
            window.location.href = "../pages/dashboard_coach.html";
        } else {
            window.location.href = "../pages/dashboard_usuario.html";
        }

    } catch (error) {
        console.error("Error de red:", error);
        loginMessage.style.display = "block";
        loginMessage.textContent = "Error al conectar con el servidor.";
    }
});