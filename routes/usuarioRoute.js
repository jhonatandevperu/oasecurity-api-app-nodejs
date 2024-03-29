"use strict";

const express = require("express");
const router = express.Router();
const multer = require("multer");
const usuarioController = require("../controllers/usuarioController");
const jsonWebTokenConfig = require("../config/jsonWebTokenConfig");

const multerConfig = multer(
  require("../config/multerConfig").multerConfig
).fields([
  { name: "foto_rostro", maxCount: 1 },
  { name: "face_id_2", maxCount: 1 },
  { name: "audio_grabacion", maxCount: 1 },
]);

const validApps = (req, res, next) => {
  const whiteListApps = ["OA_SECURITY_ADMIN", "OA_SECURITY_CLIENT"];
  const { appcode } = req.headers;
  if (!appcode || !whiteListApps.includes(appcode)) {
    return res.status(400).end();
  }
  next();
};

router.post("/", validApps, multerConfig, async (req, res) => {
  const { dni, nombres, apellidos, email, password, id_aplicacion } = req.body;
  const archivoFotoRostro = req.files["foto_rostro"][0];
  const archivoAudioGrabacion = req.files["audio_grabacion"][0];
  try {
    let nuevoUsuario = await usuarioController.registrarUsuario({
      dni,
      nombres,
      apellidos,
      email,
      password,
      archivoFotoRostro,
      archivoAudioGrabacion,
      id_aplicacion,
    });
    res.status(201).json(nuevoUsuario).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

router.get("/", validApps, async (req, res) => {
  try {
    let usuarios = await usuarioController.listarUsuarios();
    res.status(200).json(usuarios).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

router.get("/aplicacion/:idAplicacion", validApps, async (req, res) => {
  try {
    let usuarios = await usuarioController.listarUsuariosPorIdAplicacion(
      req.params.idAplicacion
    );
    res.status(200).json(usuarios).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

router.get("/:id", validApps, async (req, res) => {
  try {
    let usuario = await usuarioController.obtenerUsuarioPorId(req.params.id);
    if (usuario) {
      res.status(200).json(usuario).end();
    } else {
      res.status(404).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

router.post("/login", validApps, async (req, res) => {
  const { email, password } = req.body;
  let usuario = await usuarioController.login(email, password);
  if (usuario) {
    const token = jsonWebTokenConfig.sign(usuario);
    res.status(200).json({ token }).end();
  } else {
    res.status(400).end();
  }
});

router.post("/login/facial", validApps, multerConfig, async (req, res) => {
  const { idusuario } = req.headers;
  const faceId2File = req.files["face_id_2"][0];
  try {
    let respuesta = await usuarioController.loginFacial(idusuario, faceId2File);
    if (respuesta.isIdentical) {
      res.status(200).json({ identico: true }).end();
    } else {
      res.status(200).json({ identico: false }).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

router.post("/login/voz", validApps, multerConfig, async (req, res) => {
  const { profileid } = req.headers;
  const audioGrabacionFile = req.files["audio_grabacion"][0];
  try {
    let respuesta = await usuarioController.loginVoz(
      profileid,
      audioGrabacionFile
    );
    if (respuesta.recognitionResult === "Accept") {
      res.status(200).json({ identico: true }).end();
    } else {
      res.status(200).json({ identico: false }).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

router.put("/entrenar", validApps, async (req, res) => {
  const { idusuario } = req.headers;
  try {
    let usuario = await usuarioController.entrenarSpeakerRecognition(idusuario);
    res.status(200).json(usuario).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

module.exports = router;
