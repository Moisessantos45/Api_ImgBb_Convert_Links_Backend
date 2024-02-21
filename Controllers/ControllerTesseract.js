import Tesseract from "tesseract.js";

Tesseract.recognize("./logo.png", "spa")
  .then(({ data: { text } }) => {
    console.log(text.split("\n").join(" ")); // Imprime el texto reconocido en la consola
  })
  .catch((err) => {
    console.error(err); // Imprime cualquier error que ocurra
  });
