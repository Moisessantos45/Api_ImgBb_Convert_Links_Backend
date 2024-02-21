import webp from "webp-converter";
import fs from "fs";
import path from "path";

webp.grant_permission();

const directorio = "./Uploads";

const eliminarFiles = (res) => {
  fs.readdir(directorio, (err, archivos) => {
    if (err) {
      console.error("Error al leer el directorio:", err);
      res.status(500).json({ msg: "Error al eliminar archivos" });
      return;
    }
    archivos.forEach((archivo) => {
      const rutaArchivo = path.join(directorio, archivo);
      fs.unlink(rutaArchivo, (err) => {
        if (err) {
          console.error(`Error al eliminar ${archivo}:`, err);
        } else {
          console.log(`${archivo} eliminado`);
        }
      });
    });
  });
};

// const enviarImg = async (req, res) => {
//   if (req.files.length < 0) {
//     res.status(404).json({ msg: "no se encontro imagen" });
//     return;
//   }
//   const imgPath = req.files[0].path;
//   const output = imgPath.split(".")[0] + ".webp";
//   const resul = webp.cwebp(imgPath, output, "-q 80").then(() => {
//     fs.readFile(output, function (err, data) {
//       if (err) {
//         res.status(500).json({ msg: "Error al leer el archivo" });
//       } else {
//         fs.unlinkSync(imgPath)
//         res.writeHead(200, { "Content-Type": "image/webp" });
//         res.end(data, "binary");
//         fs.unlink(output)
//       }
//     });
//   });
// };

const enviarImg = async (req, res) => {
  if (req.files.length < 0) {
    res.status(404).json({ msg: "no se encontro imagen" });
    return;
  }
  const imgPath = req.files[0].path;
  const output = imgPath.split(".")[0] + ".webp";
  webp
    .cwebp(imgPath, output, "-q 80")
    .then(() => {
      fs.readFile(output, function (err, data) {
        if (err) {
          res.status(500).json({ msg: "Error al leer el archivo" });
        } else {
          fs.unlink(imgPath, (err) => {
            if (err)
              console.error(`Error al eliminar el archivo original: ${err}`);
          });
          res.writeHead(200, { "Content-Type": "image/webp" });
          res.end(data, "binary");
          fs.unlink(output, (err) => {
            if (err)
              console.error(`Error al eliminar el archivo de salida: ${err}`);
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({ msg: `Error al convertir la imagen: ${err}` });
    });
};

export { enviarImg };
