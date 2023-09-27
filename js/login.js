import { signInWithEmailAndPassword, getAuth } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAz_1fIMW63n_bprNvcN7LyVLIuDOSrhLM",
    authDomain: "imra-database.firebaseapp.com",
    databaseURL: "https://imra-database-default-rtdb.firebaseio.com",
    projectId: "imra-database",
    storageBucket: "imra-database.appspot.com",
    messagingSenderId: "334269021694",
    appId: "1:334269021694:web:d63dc481d5ee6cbb3d54af",
    measurementId: "G-6BVPZ9RFF7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById("miFormulario");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const correo = document.getElementById("correo").value;
  const clave = document.getElementById("pass").value;

  console.log(correo, clave);

  try {
    await signInWithEmailAndPassword(auth, correo, clave);
    document.cookie = "userAuthenticated=true; path=/";
    window.location.href = "./app/inicio.html";
    form.reset()
  } catch (error) {
    alert("Usuario no registrado o credenciales incorrectas");
  }
});

const googleButton = document.getElementById("googlebtn");

googleButton.addEventListener("click", async () => {
  try {
    document.cookie = "userAuthenticated=true; path=/";
    // Inicia sesión con Google a través de una ventana emergente
    const result = await signInWithPopup(auth, googleAuthProvider);

    console.log("Usuario autenticado con Google:", result.user.displayName);
    alert("Usuario autenticado con Google:", result.user.email);

    // Almacena la URL de la foto de perfil en sessionStorage
    sessionStorage.setItem("photoURL", result.user.photoURL);

    // Almacena el correo y el nombre del usuario en sessionStorage
    sessionStorage.setItem("correo", result.user.email);
    sessionStorage.setItem("nombre", result.user.displayName);

    window.location.href = "./app/inicio.html";
  } catch (error) {
    console.error("Error al autenticar con Google:", error);
  }
});

const googleAuthProvider = new GoogleAuthProvider();
const nombre = document.getElementById("nombre");

const btnregistrar = document.getElementById("registrar");

btnregistrar.addEventListener("click", ()=>{
  sessionStorage.setItem("NamelUser", nombre.value);
  sessionStorage.setItem("EmailUser", correo.value);

  document.cookie = "userAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
});