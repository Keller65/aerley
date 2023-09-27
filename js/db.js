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

const logobtn = document.querySelector(".logoIMRA");

logobtn.addEventListener("click", ()=>{
  window.location.href = "./app/inicio.html"
});

document.addEventListener("DOMContentLoaded", () => {

  const photoURL = sessionStorage.getItem("photoURL");

  const correo = sessionStorage.getItem("correo");
  const nombre = sessionStorage.getItem("nombre");

  const userNameP = document.getElementById("user__name");
  const userEmailP = document.getElementById("user__email");

  if (nombre) {
    userNameP.textContent = `${nombre}`;
  } else {
    console.error("No Disponible.");
    userNameP.textContent = sessionStorage.getItem("NamelUser");
  }

  if (correo) {
    userEmailP.textContent = `${correo}`;
  } else {
    console.error("No Disponible.");
    userEmailP.textContent = sessionStorage.getItem("EmailUser");
  }

  if (photoURL) {
    const profilePhotoImg = document.querySelector(".container__profile__photo");
    profilePhotoImg.src = photoURL;
  } else {
    const apiUrl = 'https://random-data-api.com/api/v2/users';

    async function getRandomUserData() {
      try {
        const profilePhotoImg = document.querySelector(".container__profile__photo");
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Error al hacer la solicitud: ${response.statusText}`);
        }

        const jsonData = await response.json();
        profilePhotoImg.src = jsonData.avatar;
      } catch (error) {
        console.error(error.message);
      }
    }

    getRandomUserData();
  }

  var firebaseConfig = {
    apiKey: "AIzaSyAz_1fIMW63n_bprNvcN7LyVLIuDOSrhLM",
    authDomain: "imra-database.firebaseapp.com",
    projectId: "imra-database",
    storageBucket: "imra-database.appspot.com",
    messagingSenderId: "334269021694",
    appId: "1:334269021694:web:d63dc481d5ee6cbb3d54af",
    measurementId: "G-6BVPZ9RFF7"
  };

  firebase.initializeApp(firebaseConfig);

  var firestore = firebase.firestore();
  var docRef = firestore.collection("videos").doc("TvCXM7SK4Gwuk3lMrUMw");

  // Consulta Firestore y muestra los datos en HTML
  docRef.get().then(function(doc) {
    if (doc.exists) {
        var data = doc.data();
        var clase = data.titulo;

        if (sessionStorage.getItem("NamelUser") !== null) {
          document.getElementById("titulo").textContent = clase + " " + sessionStorage.getItem("NamelUser");
        } else if (sessionStorage.getItem("nombre") !== null) {
          document.getElementById("titulo").textContent = clase + " " + sessionStorage.getItem("nombre");
        } else {
          console.log("No hay valores en sessionStorage.");
        }
        
      } else {
      console.error("Error al obtener el documento:", error);
    }

  }).catch(function(error) { 
    console.error("Error al obtener el documento:", error);
    console.log("no hay nombre generado");
  });
});

const cerrarSesion = document.querySelector(".btn__salir");

cerrarSesion.addEventListener("click", ()=>{
  sessionStorage.removeItem("photoURL");
  sessionStorage.removeItem("correo");
  sessionStorage.removeItem("nombre");
  sessionStorage.removeItem("EmailUser")
  sessionStorage.removeItem("NamelUser")
  window.location.href = "../index.html"
});