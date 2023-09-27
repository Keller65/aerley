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

// Referencia al documento en Firestore
var docRef = firestore.collection("videos").doc("TvCXM7SK4Gwuk3lMrUMw");

// Consulta Firestore y muestra los datos en HTML
docRef.get().then(function(doc) {
    if (doc.exists) {
        var data = doc.data();

        var clase = data.titulo;

        document.getElementById("titulo").textContent = clase;
    } else {
        console.log("El documento no existe.");
    }
}).catch(function(error) {
    console.error("Error al obtener el documento:", error);
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
