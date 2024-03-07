import webp from "webp-converter";
import fs from "fs";
import path from "path";

webp.grant_permission();

const directorio = "./Uploads";

const eliminarDirectorio = (res, id) => {
  const dir = path.join(directorio, id);
  fs.readdir(dir, (err, files) => {
    try {
      if (err) {
        res.status(500).json({ msg: `Error al leer el directorio: ${err}` });
        return;
      }
      if (files.length === 0) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    } catch (error) {
      console.log(`Error al eliminar el directorio: ${error}`);
    }
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
  const { id } = req.params;
  if (req.files.length < 0) {
    res.status(404).json({ msg: "no se encontro imagen" });
    return;
  }
  const imgPath = req.files[0].path;
  const output = imgPath.split(".")[0] + ".webp";
  try {
    webp
      .cwebp(imgPath, output, "-q 80")
      .then(() => {
        fs.readFile(output, function (err, data) {
          if (err) {
            res.status(500).json({ msg: "Error al leer el archivo" });
          } else {
            fs.unlinkSync(imgPath);
            res.writeHead(200, { "Content-Type": "image/webp" });
            res.end(data, "binary");
            fs.unlinkSync(output);
            eliminarDirectorio(res, id);
          }
        });
      })
      .catch((err) => {
        res.status(500).json({ msg: `Error al convertir la imagen: ${err}` });
      });
  } catch (error) {
    res.status(500).json({ msg: `Error al convertir la imagen: ${error}` });
  }
};

export { enviarImg };
