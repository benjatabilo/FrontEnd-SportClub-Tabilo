const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;

    loginMessage.style.display = "none";

    try {

        const response = await fetch(
            "http://localhost:3000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: emailValue,
                    password: passwordValue
                })

            }
        );

        const result = await response.json();

        console.log(result);

        // Validar login exitoso
        if (!result.ok) {

            loginMessage.style.display = "block";

            loginMessage.textContent =
                result.message ||
                "Correo o contraseña incorrectos";

            return;

        }

        // Guardar token
        localStorage.setItem(
            "token",
            result.data.token
        );

        // Guardar usuario
        localStorage.setItem(
            "user",
            JSON.stringify(result.data.user)
        );

        loginMessage.style.display = "block";

        loginMessage.textContent =
            result.message;

        // Redirección según rol
        const role =
            result.data.user.role;

        if (role === "user") {

            window.location.href =
                "./dashboard_usuario.html";

        }

        else if (role === "coach") {

            window.location.href =
                "./dashboard_coach.html";

        }

        else if (role === "admin") {

            window.location.href =
                "./dashboard_admin.html";

        }

    }

    catch (error) {

        console.error(error);

        loginMessage.style.display = "block";

        loginMessage.textContent =
            "Error al conectar con el servidor";

    }

});