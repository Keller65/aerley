import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, push, onChildAdded, onChildRemoved } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAz_1fIMW63n_bprNvcN7LyVLIuDOSrhLM",
    authDomain: "imra-database.firebaseapp.com",
    databaseURL: "https://imra-database-default-rtdb.firebaseio.com",
    projectId: "imra-database",
    storageBucket: "imra-database.appspot.com",
    messagingSenderId: "334269021694",
    appId: "1:334269021694:web:367ab5d6f7f4d0773d54af",
    measurementId: "G-9ZS3XW7C0J"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

// Obtener el nombre de usuario de la cuenta de Google (reemplaza esto con tu lógica de autenticación)
const nombreGoogle = sessionStorage.getItem("nombre");
const userId = nombreGoogle;
const presenceRef = ref(database, `presence/${userId}`);

// Cuando el usuario inicia sesión
set(presenceRef, {
    name: nombreGoogle,
    correoStatus: sessionStorage.getItem("correo"),
    status: "online",
    FotoStatus: sessionStorage.getItem("photoURL")
});

const formulario = document.getElementById("formulario");
const mensajesContainer = document.getElementById("mensajes");

// Escuchar eventos de eliminación de mensajes en tiempo real
onChildRemoved(ref(database, "chat"), (snapshot) => {
    const mensajeEliminadoID = snapshot.key;

    const mensajeElement = document.getElementById(mensajeEliminadoID);
    if (mensajeElement) {
        mensajeElement.remove();
    }
});

// Obtén una referencia al contenedor padre donde agregarás los contenedores creados
const userOnlineContainer = document.getElementById("usuerOnline");

// Escuchar eventos de adición de hijos en el nodo "presence"
onChildAdded(ref(database, "presence"), (snapshot) => {
    const presenceData = snapshot.val();

    const containerUserStatus = document.createElement("div");
    containerUserStatus.classList.add("ContainerUserStatus");

    const fotoStatus = document.createElement("img");
    fotoStatus.classList.add("FotoStatus");
    fotoStatus.src = presenceData.FotoStatus; 
    containerUserStatus.appendChild(fotoStatus);

    const nombreStatus = document.createElement("p");
    nombreStatus.classList.add("nombreStatus");
    nombreStatus.textContent = presenceData.name; 
    containerUserStatus.appendChild(nombreStatus);

    const correoStatus = document.createElement("p");
    correoStatus.classList.add("correoStatus");
    correoStatus.textContent = presenceData.correoStatus;
    containerUserStatus.appendChild(correoStatus);

    userOnlineContainer.appendChild(containerUserStatus);
});

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const mensajeUsuario = document.getElementById("mensaje").value;
    const nombreUsuario = sessionStorage.getItem("nombre");
    const fotoUsuario = sessionStorage.getItem("photoURL");

    const chatRef = ref(database, "chat");
    const nuevoChatRef = push(chatRef);

    const fechaActual = new Date();

    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    const fechaFormateada = fechaActual.toLocaleDateString('en-US', options);

    const archivoInput = document.getElementById("archivo");

    if (archivoInput.files.length > 0) {
        const archivo = archivoInput.files[ 0 ];

        try {
            const archivoRef = storageRef(storage, `archivos/${archivo.name}`);
            await uploadBytes(archivoRef, archivo);

            // Una vez que el archivo se haya subido con éxito, obtén su URL de descarga
            const archivoURL = await getDownloadURL(archivoRef);

            // Ahora puedes usar archivoURL en tu objeto nuevoMensaje
            const nuevoMensaje = {
                nombre: nombreUsuario,
                mensaje: mensajeUsuario,
                Fecha: fechaFormateada,
                photoURL: fotoUsuario,
                archivo: archivoURL
            };

            set(nuevoChatRef, nuevoMensaje)
                .then(() => {
                    console.log("mensje enviado");
                    formulario.reset();
                })
                .catch((error) => {
                    console.error("Error al enviar mensaje:", error);
                });
        } catch (error) {
            console.error("Error al subir el archivo:", error);
        }
    } else {
        // Si no se seleccionó un archivo, solo se envía el mensaje de texto
        const nuevoMensaje = {
            nombre: nombreUsuario,
            mensaje: mensajeUsuario,
            Fecha: fechaFormateada,
            photoURL: fotoUsuario
        };

        set(nuevoChatRef, nuevoMensaje)
            .then(() => {
                formulario.reset();
            })
            .catch((error) => {
                console.error("Error al enviar mensaje:", error);
            });
    }
});

onChildAdded(ref(database, "chat"), (snapshot) => {
    const mensaje = snapshot.val();
    const mensajeElement = document.createElement("div");

    const fechaElement = document.createElement("p");
    fechaElement.classList.add("fechaMensaje");
    fechaElement.textContent = mensaje.Fecha;

    const mensajeTextElement = document.createElement("p");
    mensajeTextElement.classList.add("mensajeResult");
    mensajeTextElement.textContent = mensaje.mensaje;

    mensajeElement.innerHTML = `
        <strong>${mensaje.nombre}</strong>
    `;

    mensajeElement.appendChild(fechaElement);
    mensajeElement.appendChild(mensajeTextElement);

    const foto = document.createElement("img");
    foto.src = mensaje.photoURL;
    mensajeElement.appendChild(foto);

    if (mensaje.archivo) {
        const imagenAdjunta = document.createElement("img");
        imagenAdjunta.src = mensaje.archivo;
        imagenAdjunta.classList.add("archivoAdjunto");
        mensajeElement.appendChild(imagenAdjunta);
    }

    if (mensaje.nombre === sessionStorage.getItem("nombre")) {
        // Si el mensaje fue enviado por ti mismo, añade una clase para alinear a la derecha
        mensajeElement.classList.add("mensajeEnviado");
        if (darkModeToggle.checked) {
            const usuerOnline = document.getElementById("usuerOnline");
            mensajeElement.classList.add("mensajeEnviadoDarkMode");
            usuerOnline.classList.add("usuerOnlineDarkMode");
        }
    } else {
        // Si el mensaje no fue enviado por ti mismo, añade una clase para alinear a la izquierda
        mensajeElement.classList.add("mensajeRecibido");
        if (darkModeToggle.checked) {
            mensajeElement.classList.add("mensajeRecibidoDarkMode");
        }
    }

    // Asignar un ID al elemento del mensaje basado en la clave del mensaje en Firebase
    const mensajeKey = snapshot.key;
    mensajeElement.id = mensajeKey;

    mensajesContainer.appendChild(mensajeElement);
    mensajesContainer.scrollTop = mensajesContainer.scrollHeight;
});

const darkModeToggle = document.getElementById("dark-mode-toggle");
const contenedorPadre = document.querySelector(".container__padre");
const miFormulario = document.querySelector(".miFormulario");
const ColorMensaje = document.getElementById("mensaje");
const body = document.body;

darkModeToggle.addEventListener("change", () => {
    const containerUserStatusList = document.querySelectorAll(".ContainerUserStatus");
    if (darkModeToggle.checked) {
        body.classList.add("dark-mode");
        contenedorPadre.classList.add("container__padre_DarkMode");
        miFormulario.classList.add("dark_mode_formulario");
        ColorMensaje.style.color = "white";

        containerUserStatusList.forEach((containerUserStatus) => {
            containerUserStatus.style.backgroundColor = "#1d1d1d";
        });

        // Aplicar el modo oscuro a todos los mensajes existentes
        const mensajesEnviados = document.querySelectorAll(".mensajeEnviado");
        mensajesEnviados.forEach((mensajeEnviado) => {
            mensajeEnviado.classList.add("mensajeEnviadoDarkMode");
            userOnlineContainer.style.backgroundColor = "black";
        });

        const mensajesRecibidos = document.querySelectorAll(".mensajeRecibido");
        mensajesRecibidos.forEach((mensajeRecibido) => {
            mensajeRecibido.classList.add("mensajeRecibidoDarkMode");
        });
    } else {
        body.classList.remove("dark-mode");
        contenedorPadre.classList.remove("container__padre_DarkMode");
        miFormulario.classList.remove("dark_mode_formulario");
        ColorMensaje.style.color = "black";
        userOnlineContainer.style.backgroundColor = "white";

        containerUserStatusList.forEach((containerUserStatus) => {
            containerUserStatus.style.backgroundColor = "#e9e9e9";
        });

        // Eliminar el modo oscuro de todos los mensajes existentes
        const mensajesEnviadosDark = document.querySelectorAll(".mensajeEnviadoDarkMode");
        mensajesEnviadosDark.forEach((mensajeEnviadoDark) => {
            mensajeEnviadoDark.classList.remove("mensajeEnviadoDarkMode");
        });

        const mensajesRecibidosDark = document.querySelectorAll(".mensajeRecibidoDarkMode");
        mensajesRecibidosDark.forEach((mensajeRecibidoDark) => {
            mensajeRecibidoDark.classList.remove("mensajeRecibidoDarkMode");
        });
    }
});


/*const emojisContainer = document.getElementById("emojisContainer");
const mensajeUsuario = document.getElementById("mensaje");

const url = 'https://emoji-api.com/emojis?access_key=f8e066b0f74685289cae7fbf0cb340ac92cafe89';

fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Recorrer la matriz de emojis y agregar cada uno al contenedor
        data.forEach(emoji => {
            const emojiButton = document.createElement("button");
            emojiButton.innerHTML = emoji.character;
            emojisContainer.appendChild(emojiButton);

            // Agregar un manejador de eventos clic a cada emoji
            emojiButton.addEventListener("click", () => {
                // Cuando se hace clic en un emoji, agrega su carácter al valor del input
                mensajeUsuario.value += emoji.character;
            });
        });
    })
    .catch(error => {
        console.error('Error:', error);
    }); */
