const firebaseConfig = {
    piKey: "AIzaSyAz_1fIMW63n_bprNvcN7LyVLIuDOSrhLM",
    authDomain: "imra-database.firebaseapp.com",
    databaseURL: "https://imra-database-default-rtdb.firebaseio.com",
    projectId: "imra-database",
    storageBucket: "imra-database.appspot.com",
    messagingSenderId: "334269021694",
    appId: "1:334269021694:web:d63dc481d5ee6cbb3d54af",
    measurementId: "G-6BVPZ9RFF7"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const fileRef = storage.ref("MySql.pdf"); // Ruta al archivo dentro del bucket

const downloadButton = document.getElementById("downloadButton");

downloadButton.addEventListener("click", async () => {
    try {
        // Obtiene la URL de descarga del archivo
        const downloadURL = await fileRef.getDownloadURL();

        // Crea un enlace de descarga y simula un clic para iniciar la descarga
        const downloadLink = document.createElement("a");
        downloadLink.href = downloadURL;
        downloadLink.download = "MySql Manual.pdf"; // Nombre que se dará al archivo descargado
        downloadLink.click();
    } catch (error) {
        console.error("Error al obtener la URL de descarga o al descargar el archivo:", error);
    }
});