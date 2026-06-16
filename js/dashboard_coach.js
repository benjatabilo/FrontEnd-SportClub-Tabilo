// Validar acceso inmediatamente
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || user?.role !== "coach") {
    // Si no tiene token o no es coach, lo echamos de la página
    window.location.href = "../login.html";
}