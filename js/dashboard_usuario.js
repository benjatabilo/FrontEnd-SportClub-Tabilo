// --- Protección de Ruta ---
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
        // Si no hay token, no dejamos que cargue nada y redirigimos
        window.location.href = "./login.html";
        return; 
    }
    
    // ... aquí empieza el resto de tu código de perfil ...
});

const botones = document.querySelectorAll(".clase-card button");

botones.forEach((boton) => {

    boton.addEventListener("click", () => {

        alert("Clase reservada correctamente");

    });

});