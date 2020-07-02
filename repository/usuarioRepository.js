"use strict";

const usuarioRepository = {};

const { usuarioModel, rolModel } = require("../models");

usuarioRepository.registrarUsuario = async (usuario) => {
  try {
    const {
      dni,
      nombres,
      apellidos,
      email,
      password,
      audio_profile_id,
      audio_profile_status,
      url_foto_rostro,
      url_audio_grabacion,
    } = usuario;
    let nuevoUsuario = await usuarioModel.create(
      {
        dni,
        nombres,
        apellidos,
        email,
        password,
        url_foto_rostro,
        audio_profile_id,
        audio_profile_status,
        url_audio_grabacion,
        id_rol: 2, //Cliente
      },
      {
        fields: [
          "dni",
          "nombres",
          "apellidos",
          "email",
          "password",
          "url_foto_rostro",
          "audio_profile_id",
          "audio_profile_status",
          "url_audio_grabacion",
          "id_rol",
        ],
      }
    );
    return nuevoUsuario;
  } catch (err) {
    console.log(err);
    throw new Error(`Error en usuarioRepository.registrarUsuario: ${err}`);
  }
};

usuarioRepository.actualizarUsuario = async (usuario) => {
  try {
    const { id, audio_profile_status } = usuario;
    let usuarioActualizado = await usuarioModel.update(
      {
        audio_profile_status: audio_profile_status,
      },
      {
        where: {
          id: Number(id),
        },
        fields: ["audio_profile_status"],
        returning: true,
      }
    );
    return usuarioActualizado;
  } catch (err) {
    throw new Error(`Error en usuarioRepository.actualizarUsuario: ${err}`);
  }
};

usuarioRepository.listarUsuarios = async () => {
  try {
    let usuarios = await usuarioModel.findAll({
      attributes: [
        "id",
        "dni",
        "nombres",
        "apellidos",
        "email",
        "audio_profile_status",
        "url_foto_rostro",
      ],
      include: [
        {
          required: true,
          model: rolModel,
          where: {
            id: 2, //Rol Cliente
          },
        },
      ],
    });
    return usuarios;
  } catch (err) {
    throw new Error(`Error en usuarioRepository.listarUsuarios: ${err}`);
  }
};

usuarioRepository.obtenerUsuarioPorId = async (id) => {
  try {
    let usuario = await usuarioModel.findOne({
      attributes: [
        "id",
        "dni",
        "nombres",
        "apellidos",
        "email",
        "url_foto_rostro",
        "audio_profile_id",
        "url_audio_grabacion",
      ],
      include: [
        {
          required: true,
          model: rolModel,
        },
      ],
      where: {
        id: Number(id),
      },
    });
    return usuario;
  } catch (err) {
    throw new Error(`Error en usuarioRepository.obtenerUsuarioPorId: ${err}`);
  }
};

usuarioRepository.obtenerUsuarioPorEmail = async (email) => {
  try {
    let usuario = await usuarioModel.findOne({
      attributes: [
        "id",
        "dni",
        "nombres",
        "apellidos",
        "email",
        "password",
        "url_foto_rostro",
        "audio_profile_id",
        "url_audio_grabacion",
      ],
      include: [
        {
          required: true,
          model: rolModel,
        },
      ],
      where: {
        email: String(email).toLowerCase(),
      },
    });
    return usuario;
  } catch (err) {
    throw new Error(
      `Error en usuarioRepository.obtenerUsuarioPorEmail: ${err}`
    );
  }
};

module.exports = usuarioRepository;
