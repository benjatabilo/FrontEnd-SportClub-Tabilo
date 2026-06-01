const botones = document.querySelectorAll(".clase-card button");

botones.forEach((boton) => {

    boton.addEventListener("click", () => {

        alert("Clase reservada correctamente");

    });

});