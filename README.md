# SportClub

Se crea un Sistema web  para la evaluación de Programación Front End.  

Este representa una plataforma deportiva llamada SportClub, incluyendo una Landing Page, autenticación de usuarios y dashboards diferenciados según el rol del usuario.


# Descripción del Proyecto

SportClub es una pagina web estática orientada a la gestión de usuarios, entrenamientos y administración de un club deportivo.

El sistema incluye:

- Landing Page principal
- Inicio de sesión
- Registro de usuarios
- Recuperación de contraseña
- Dashboard Usuario
- Dashboard Coach
- Dashboard Administrador

Cada dashboard posee una identidad visual distinta según el tipo de usuario, ya sea COACH, ADMINITRADOR O USUARIO.

# Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript
- GitHub Pages


# Estructura del Proyecto

/css           = Archivos de estilos
/js            = Scripcts JavaScript
/assets/img    = Imagenes
/pages         = Paginas (HTML) internas de la WEB.
index.html
README.md
IA.md


# Funcionalidades Principales

## Landing Page

- Presentación del club
- Información de servicios
- Planes y beneficios
- Navegación principal

## Sistema de Autenticación

- Login
- Registro de nuevos usuarios
- Recuperación de contraseña

## Dashboard Usuario

- Resumen de actividades
- Clases disponibles
- Perfil rápido

## Dashboard Coach

- Gestión de alumnos
- Horarios
- Clases asignadas
- Panel resumen

## Dashboard Administrador

- Gestión de usuarios
- Reportes
- Estadísticas
- Configuración rápida

---

# Diferenciación Visual

Cada dashboard utiliza una identidad visual distinta:

- Usuario : Azul
- Coach : Verde
- Administrador : Morado.

Esto permite identificar rápidamente el tipo de perfil dentro del sistema.

---

# Características Técnicas

- Diseño responsive
- Uso de HTML5 semántico
- Navegación funcional entre páginas
- Organización modular de archivos
- Estilos personalizados con CSS
- Interactividad básica con JavaScript.

----------------------------------------
#PARTE 2 EV: 
----------------------------------------

La segunda etapa la pagina  web dinámica capaz de interactuar con servicios web (API) para la gestión real de datos y autenticación.


# Principales avances:

- Conectividad: Integración de la plataforma con una API REST en localhost:3000.
- Autenticación real: Implementación de flujo de login y manejo seguro de tokens en localStorage.
- Persistencia de perfil: CRUD completo para la gestión de datos personales.
- Validaciones: Sistema de control de errores tanto en formularios de perfil como en cambio de contraseña.


# Tecnologías Utilizadas
- HTML5 / CSS3
- JavaScript
- API(Consumo mediante fetch)
- LocalStorage (Persistencia de sesión)

# Estructura del Proyecto
Se mantiene la estructura con las siguientes actualizaciones:

/css           = Estilos (con clases nuevas para alertas de éxito)
/js            = Scripts JavaScript (Lógica de API y control de estados)
/pages         = Páginas HTML (Interacción dinámica con el DOM)
index.html
README.md      = Documentación
IA.md          = Registro de asistencia por IA

# Funcionalidades Principales (Parte 2)
- Gestión de Perfil Dinámica
- Renderizado en tiempo real: Los datos del usuario se cargan directamente desde el servidor al iniciar sesión.
- Edición funcional: Los usuarios pueden modificar su información y ver los cambios reflejados.
- Manejo de estados: Intercambio automático entre modo "Lectura" y "Edición".

- Seguridad y Contraseñas: Cambio de contraseña: Formulario protegido que valida la contraseña actual y la confirmación de la nueva mediante peticiones PUT.

- validaciones robustas
- protección de rutas: Redirección automática al login si el usuario no cuenta con un token de sesión válido.
