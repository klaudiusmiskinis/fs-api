const fs = require('fs');

const ruta = 'C:/Users/Usuari/Desktop/Sistema documental/Documentos Agronomico/';
const contenido = fs.readdirSync(ruta);
const directorios = []
const archivos = []

contenido.forEach(recurso => {
    const comprobacionDirectorio = fs.lstatSync(ruta + recurso).isDirectory();
    if (comprobacionDirectorio) directorios.push(recurso);
    else archivos.push(recurso);
})
