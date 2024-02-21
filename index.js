import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Router from "./Routers/router.js";

const app = express();

app.use(express.json());
dotenv.config();

const dominiosPermitidos = [process.env.FRONTEND_URL, "http://localhost:5174"];
const opciones = {
  origin: function (origin, callback) {
    if (dominiosPermitidos.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
};
app.use(cors(opciones));
app.use("/api", Router);
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor contendado ${PORT}`);
});
