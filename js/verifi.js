import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";

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

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById("miFormulario");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita que el formulario se envíe automáticamente

  const correo = document.getElementById("correo").value;
  const clave = document.getElementById("pass").value;

  console.log(correo, clave);

  // Comprobar si el usuario ya existe
  try {
    await signInWithEmailAndPassword(auth, correo, clave);
    console.log("Usuario ya registrado. Iniciar sesión en lugar de registrarse.");
  } catch (signInError) {
    // Si no se puede iniciar sesión, entonces el usuario no existe
    try {
      const result = await createUserWithEmailAndPassword(auth, correo, clave);
      console.log(result);
      console.log("Usuario registrado");
    } catch (createUserError) {
      console.error(createUserError);
      console.log("Error al registrar al usuario");
    }
  }
});

function isUserAuthenticated() {
  const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'userAuthenticated' && value === 'true') {
        return true;
      }
    }
    return false;
}

  // Verificar la autenticación al cargar la página
window.addEventListener('load', () => {
  if (!isUserAuthenticated()) {
    // El usuario no tiene las cookies adecuadas, redirigirlo a la página de inicio de sesión
    window.location.href = "../index.html";
  }
});