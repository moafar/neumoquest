// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAmpPGrYcDHo5VzxHkV5jpOXPxvUA82jr8",
    authDomain: "neumo-quest.firebaseapp.com",
    projectId: "neumo-quest",
    storageBucket: "neumo-quest.appspot.com",
    messagingSenderId: "426221221937",
    appId: "1:426221221937:web:b54a3861dae477ed8bbd10",
    measurementId: "G-FVZLVKEPHT"
};

// Inicializa Firebase y Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Verificar si estamos en el entorno de desarrollo
if (window.location.hostname === "localhost") {
    // Conectar Firestore al emulador en localhost:8080
    firebase.firestore().useEmulator("localhost", 8080);

    // Conectar Authentication al emulador en localhost:9099
    firebase.auth().useEmulator("http://localhost:9099");
}

// Función para guardar datos de texto en Firestore
async function saveTextDataToFirestore(userName, userRole, message) {
    try {
        const docRef = await db.collection("audioUploads").add({
            name: userName,
            role: userRole,
            message: message,
            timestamp: new Date(),
        });
        console.log("Documento en Firestore con ID: ", docRef.id);
        showThankYouPage(); // Mostrar página de agradecimiento
    } catch (e) {
        console.error("Error agregando documento a Firestore: ", e);
    }
}

// Función para guardar datos de audio en Firestore
async function saveAudioDataToFirestore(userName, userRole, fileId) {
    try {
        const docRef = await db.collection("audioUploads").add({
            name: userName,
            role: userRole,
            fileId: fileId,
            timestamp: new Date(),
        });
        console.log("Documento en Firestore con ID: ", docRef.id);
        showThankYouPage(); // Mostrar página de agradecimiento
    } catch (e) {
        console.error("Error agregando documento a Firestore: ", e);
    }
}

// Lógica de navegación entre las tarjetas
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM completamente cargado y analizado");

    // Navegación entre tarjetas
    document.getElementById('nextButtonWelcome').addEventListener('click', function() {
        document.getElementById('welcomeCard').classList.add('d-none');
        document.getElementById('infoCard').classList.remove('d-none');
    });

    document.getElementById('nextButtonInfo').addEventListener('click', function() {
        document.getElementById('infoCard').classList.add('d-none');
        document.getElementById('mainContent').classList.remove('d-none');
    });

    document.getElementById('backButtonInfo').addEventListener('click', function() {
        document.getElementById('infoCard').classList.add('d-none');
        document.getElementById('welcomeCard').classList.remove('d-none');
    });

    document.getElementById('backButtonMain').addEventListener('click', function() {
        document.getElementById('mainContent').classList.add('d-none');
        document.getElementById('infoCard').classList.remove('d-none');
    });

    // Listener para el botón "Enviar respuesta como texto"
    document.getElementById("toggleTextButton").addEventListener("click", function () {
        document.getElementById("myFirstMicrophone").style.display = "none";
        document.getElementById("exampleFormControlTextarea1").style.display = "block";
        document.getElementById("submitTextButton").style.display = "block";
        document.getElementById("toggleTextButton").style.display = "none";
        document.getElementById("toggleMicrophoneButton").style.display = "block";
    });

    // Observa cuando CameraTag haya inicializado el micrófono
    CameraTag.observe("myFirstMicrophone", "initialized", function () {
        console.log("Micrófono de CameraTag inicializado");

        const myMicrophone = CameraTag.microphones["myFirstMicrophone"];

        // Observa cuando el usuario publique una grabación
        CameraTag.observe("myFirstMicrophone", "published", function () {
            console.log("Grabación de audio publicada");

            const myAudio = myMicrophone.getAudio();
            console.log("Audio data:", myAudio);
            const fileId = myAudio.uuid;
            const userName = document.getElementById("userName").value.trim();
            const userRole = document.getElementById("userRole").value.trim();

            if (!userName || !userRole) {
                alert("Por favor completa todos los campos antes de grabar.");
                return;
            }

            console.log("Datos a guardar:", { userName, userRole, fileId });
            saveAudioDataToFirestore(userName, userRole, fileId);
        });
    });

    // Listener para el botón "Enviar respuesta en audio"
    document.getElementById("toggleMicrophoneButton").addEventListener("click", function () {
        const userName = document.getElementById("userName").value.trim();
        const userRole = document.getElementById("userRole").value.trim();

        if (!userName || !userRole) {
            alert("Por favor, completa los campos 'Nombre' y 'Cargo' antes de activar el micrófono.");
            return;
        }

        // Muestra el micrófono y oculta el textarea y el botón de enviar para texto
        document.getElementById("myFirstMicrophone").style.display = "block";
        document.getElementById("exampleFormControlTextarea1").style.display = "none";
        document.getElementById("submitTextButton").style.display = "none";
        document.getElementById("toggleTextButton").style.display = "block";
        document.getElementById("toggleMicrophoneButton").style.display = "none";
    });

    // Listener para el botón de enviar texto
    document.getElementById("submitTextButton").addEventListener("click", function () {
        const userName = document.getElementById("userName").value.trim();
        const userRole = document.getElementById("userRole").value.trim();
        const message = document.getElementById("exampleFormControlTextarea1").value.trim();

        if (!userName || !userRole || !message) {
            alert("Debes diligenciar tu nombre y rol en la organización. El mensaje no puede estar vacío.");
            return;
        }

        saveTextDataToFirestore(userName, userRole, message);
    });
});

// Función para mostrar la página de agradecimiento
function showThankYouPage() {
    document.getElementById("mainContent").classList.add("d-none");
    document.getElementById("thankYouCard").classList.remove("d-none");
}

// Traducciones para CameraTag
if (typeof(CT_i18n) == "undefined") {
    CT_i18n = [];
}

CT_i18n[0] = "Para grabar este video con tu teléfono móvil, por favor visita <<url>> en el navegador de tu móvil";
CT_i18n[1] = "Tu dispositivo móvil no soporta la carga de videos";
CT_i18n[2] = "Grabar en este navegador requiere Flash Player 11 o superior. ¿Te gustaría instalarlo ahora?";
CT_i18n[3] = "No se puede incrustar el grabador. Asegúrate de tener Flash Player 11 o superior instalado";
CT_i18n[4] = "Elige un método abajo para enviar tu video";
CT_i18n[5] = "grabar desde la cámara";
CT_i18n[6] = "Cargar";
CT_i18n[7] = "grabar desde el teléfono";
CT_i18n[8] = "saluda a la cámara";
CT_i18n[9] = "grabando en";
CT_i18n[10] = "subiendo...";
CT_i18n[11] = "haz clic para detener la grabación";
CT_i18n[12] = "haz clic para omitir la revisión";
CT_i18n[13] = "Enviar";
CT_i18n[14] = "Regrabar";
CT_i18n[15] = "Revisar grabación";
CT_i18n[16] = "espera mientras procesamos el video";
CT_i18n[17] = "Enviado";
CT_i18n[18] = "Introduce tu <b>número de teléfono móvil</b> abajo y te enviaremos un enlace para grabar desde el móvil";
CT_i18n[19] = "Enviar enlace móvil";
CT_i18n[20] = "cancelar";
CT_i18n[21] = "Revisa tu teléfono para obtener instrucciones de grabación móvil";
CT_i18n[22] = "o apunta tu navegador móvil a";
CT_i18n[23] = "arrastra el archivo para cargar";
CT_i18n[24] = "enviando tu mensaje";
CT_i18n[25] = "¡por favor ingresa tu número de teléfono!";
CT_i18n[26] = "eso no parece ser un número de teléfono válido";
CT_i18n[27] = "No se pudo enviar el SMS.";
CT_i18n[28] = "No se detectó la cámara";
CT_i18n[29] = "No se detectó el micrófono";
CT_i18n[30] = "Acceso al hardware denegado";
CT_i18n[31] = "Conexión perdida con el servidor";
CT_i18n[32] = "Reproducción fallida";
CT_i18n[33] = "No se puede conectar";
CT_i18n[34] = "No se pudo publicar tu grabación.";
CT_i18n[35] = "No se pudo enviar los datos del formulario.";
CT_i18n[36] = "subiendo tu video";
CT_i18n[37] = "bufferizando la reproducción de video";
CT_i18n[38] = "Enviando";
CT_i18n[39] = "conectando...";
CT_i18n[40] = "negociando el firewall...";
CT_i18n[41] = "¡Oh no! Parece que tu navegador pausó el grabador";
CT_i18n[42] = "Ese archivo no parece ser un video válido. ¿Quieres continuar de todos modos?";
CT_i18n[43] = "Graba o sube un video";
CT_i18n[44] = "Haz clic para comenzar";
CT_i18n[45] = "Elige un método para enviar tu foto";
CT_i18n[46] = "Capturar desde la cámara";
CT_i18n[47] = "Subir un archivo";
CT_i18n[48] = "Elige qué dispositivo(s) te gustaría usar";
CT_i18n[49] = "Haz clic aquí para tomar o subir una foto";
CT_i18n[50] = "Ajustes / Filtros de imagen";
CT_i18n[51] = "Panorámica y Zoom";
CT_i18n[52] = "Humo";
CT_i18n[53] = "Murica";
CT_i18n[54] = "Brillo / Contraste";
CT_i18n[55] = "Visión nocturna";
CT_i18n[56] = "Posterizar";
CT_i18n[57] = "Zinc";
CT_i18n[58] = "Berry";
CT_i18n[59] = "Cámara espía";
CT_i18n[60] = "Revista";
CT_i18n[61] = "Cross Hatch";
CT_i18n[62] = "Destello";
CT_i18n[63] = "Tono / Saturación";
CT_i18n[64] = "Vibrancia";
CT_i18n[65] = "Reducción de ruido";
CT_i18n[66] = "Máscara de enfoque";
CT_i18n[67] = "Ruido";
CT_i18n[68] = "Sepia";
CT_i18n[69] = "Viñeta";
CT_i18n[70] = "Desenfoque de Zoom";
CT_i18n[71] = "Desenfoque triangular";
CT_i18n[72] = "Desplazamiento de inclinación";
CT_i18n[73] = "Desenfoque de lente";
CT_i18n[74] = "Remolino";
CT_i18n[75] = "Abultamiento / Pinch";
CT_i18n[76] = "Tinta";
CT_i18n[77] = "Trabajo de bordes";
CT_i18n[78] = "Pixelación hexagonal";
CT_i18n[79] = "Pantalla de puntos";
CT_i18n[80] = "Semitono de color";
CT_i18n[82] = "Ángulo";
CT_i18n[83] = "Tamaño";
CT_i18n[84] = "Escala";
CT_i18n[85] = "Radio";
CT_i18n[86] = "Intensidad";
CT_i18n[87] = "Brillo";
CT_i18n[88] = "Radio de desenfoque";
CT_i18n[89] = "Radio de gradiente";
CT_i18n[90] = "Tono";
CT_i18n[91] = "Saturación";
CT_i18n[92] = "Movimiento";
CT_i18n[93] = "Número de colores";
CT_i18n[94] = "Gamma";
CT_i18n[95] = "Color";
CT_i18n[96] = "Luminancia";
CT_i18n[97] = "Contraste";
CT_i18n[98] = "Deteniendo";
CT_i18n[99] = "No se puede activar la cámara o el micrófono";
CT_i18n[100] = "Esperando por hardware";
CT_i18n[101] = "Reanudar grabación";
CT_i18n[102] = "Grabación pausada";
CT_i18n[103] = "Seleccione el método de envío del audio";
CT_i18n[104] = "Grabar";
CT_i18n[105] = "¿Qué micrófono le gustaría usar?";
CT_i18n[106] = "este video es más largo que el máximo permitido de ## segundos. Intenta de nuevo.";
CT_i18n[107] = "Ese archivo no parece ser un archivo de audio válido. ¿Continuar de todos modos?";
CT_i18n[108] = "No pudimos analizar el archivo seleccionado. Intente de nuevo.";
CT_i18n[109] = "Este navegador no soporta acceso al hardware desde orígenes no seguros. Usa https://";
CT_i18n[110] = "TEl video sigue subiendo al servidor. Intente de nuevo en unos segundos.";
CT_i18n[111] = "Ocurrió un error.";
CT_i18n[112] = "asegúrate de que tu etiqueta de sala tenga un atributo id";
CT_i18n[113] = "asegúrate de que tu etiqueta de sala tenga un atributo data-app-id";
CT_i18n[114] = "No se encontraron o no se permiten la cámara o el micrófono en tu dispositivo.";
CT_i18n[115] = "La cámara o el micrófono están siendo usados por otro proceso que no permite leer estos dispositivos.";
CT_i18n[116] = "No se encontró un dispositivo que cumpla con las restricciones de video y audio. Puedes cambiar las restricciones.";
CT_i18n[117] = "No está permitido acceder a la cámara y al micrófono.";
CT_i18n[118] = "El navegador no puede acceder a la cámara y al micrófono debido a un contexto no seguro. Instala SSL y accede mediante https";
CT_i18n[119] = "WebSocket no es compatible con este navegador";
CT_i18n[120] = "Selecciona tus dispositivos de audio y video a continuación";
CT_i18n[121] = "Introduce tus credenciales de chat a continuación:";
CT_i18n[122] = "Unirse a la sala";
CT_i18n[123] = "Nombre de la sala";
CT_i18n[124] = "Nombre de usuario";
CT_i18n[125] = "El sistema de grabación Flash ya no es compatible";
CT_i18n[126] = "Este navegador no soporta la grabación de video. Asegúrate de cargar esta página de manera segura (usando https) y usar una versión reciente de Chrome, Firefox, Safari o Edge.";