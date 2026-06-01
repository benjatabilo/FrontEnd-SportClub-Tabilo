const form = document.querySelector("form");

const mensaje = document.querySelector(".mensaje-exito");

mensaje.style.display = "none";

form.addEventListener("submit", function(e){

    e.preventDefault();

    mensaje.style.display = "block";

});