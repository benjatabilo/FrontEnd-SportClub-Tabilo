const users = [

    {
        user: "user1@sportclub.cl",
        fullname: "Usuario SportClub",
        password: "1234",
        role: "user"
    },

    {
        user: "coach1@sportclub.cl",
        fullname: "Coach SportClub",
        password: "1234",
        role: "coach"
    },

    {
        user: "admin1@sportclub.cl",
        fullname: "Administrador SportClub",
        password: "1234",
        role: "admin"
    }

];

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;

    const matchedUser = users.find(function (user) {

        return user.user === emailValue &&
               user.password === passwordValue;

    });

    if (!matchedUser) {

        loginMessage.style.display = "block";

        loginMessage.textContent =
        "Correo o contraseña incorrectos.";

        return;
    }

    localStorage.setItem(
        "user",
        JSON.stringify(matchedUser)
    );

    if (matchedUser.role === "user") {

        window.location.href =
        "./dashboard_usuario.html";

    }

    if (matchedUser.role === "coach") {

        window.location.href =
        "./dashboard_coach.html";

    }

    if (matchedUser.role === "admin") {

        window.location.href =
        "./dashboard_admin.html";

    }

});