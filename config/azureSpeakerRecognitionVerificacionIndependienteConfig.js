"use strict";

const azureSpeakerRecognitionVerificacionIndependienteConfig = {};

const axios = require("axios");
const https = require("https");
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const urlEndpointVerificacionProfiles = `${process.env.AZURE_SPEAKER_RECOGNITION_API_VERIFICATION_TEXT_INDEPENDENT_URL}/profiles`;
const OcpApimSubscriptionKey = `${process.env.AZURE_SPEAKER_RECOGNITION_API_KEY}`;

const headers = {
  "Ocp-Apim-Subscription-Key": OcpApimSubscriptionKey,
};

azureSpeakerRecognitionVerificacionIndependienteConfig.obtenerPerfil = async (
  profileId
) => {
  try {
    const response = await axios.get(
      `${urlEndpointVerificacionProfiles}/${profileId}`,
      {
        headers,
        httpsAgent,
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(
      `Error en azureSpeakerRecognitionVerificacionIndependienteConfig.obtenerPerfil: ${err}`
    );
  }
};

azureSpeakerRecognitionVerificacionIndependienteConfig.obtenerListaPerfiles = async (
  top = 100
) => {
  try {
    const response = await axios.get(`${urlEndpointVerificacionProfiles}`, {
      params: {
        $top: top,
      },
      headers,
      httpsAgent,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      `Error en azureSpeakerRecognitionVerificacionIndependienteConfig.obtenerListaPerfiles: ${err}`
    );
  }
};

azureSpeakerRecognitionVerificacionIndependienteConfig.crearPerfil = async (
  locale = "en-US"
) => {
  try {
    const response = await axios.post(
      `${urlEndpointVerificacionProfiles}`,
      {
        locale,
      },
      {
        headers,
        httpsAgent,
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(
      `Error en azureSpeakerRecognitionVerificacionIndependienteConfig.crearPerfil: ${err}`
    );
  }
};

azureSpeakerRecognitionVerificacionIndependienteConfig.eliminarPerfil = async (
  profileId
) => {
  try {
    await axios.delete(`${urlEndpointVerificacionProfiles}/${profileId}`, {
      headers,
      httpsAgent,
    });
  } catch (err) {
    throw new Error(
      `Error en azureSpeakerRecognitionVerificacionIndependienteConfig.eliminarPerfil: ${err}`
    );
  }
};

azureSpeakerRecognitionVerificacionIndependienteConfig.crearInscripcion = async (
  profileId,
  readableStream,
  readableStreamLength,
  ignoreMinLength = false
) => {
  try {
    const response = await axios({
      method: "post",
      url: `${urlEndpointVerificacionProfiles}/${profileId}/enrollments`,
      data: readableStream,
      params: {
        ignoreMinLength,
      },
      headers: {
        "Ocp-Apim-Subscription-Key": OcpApimSubscriptionKey,
        "Content-Type": "audio/wav",
        "Content-Length": readableStreamLength,
      },
      httpsAgent,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      `Error en azureSpeakerRecognitionVerificacionIndependienteConfig.crearInscripcion: ${err}`
    );
  }
};

azureSpeakerRecognitionVerificacionIndependienteConfig.verificarPerfil = async (
  profileId,
  newReadableStream,
  newReadableStreamLength,
  ignoreMinLength = false
) => {
  try {
    const response = await axios({
      method: "post",
      url: `${urlEndpointVerificacionProfiles}/${profileId}/verify`,
      data: newReadableStream,
      params: {
        ignoreMinLength,
      },
      headers: {
        "Ocp-Apim-Subscription-Key": OcpApimSubscriptionKey,
        "Content-Type": "audio/wav",
        "Content-Length": newReadableStreamLength,
      },
      httpsAgent,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      `Error en azureSpeakerRecognitionVerificacionIndependienteConfig.verificarPerfil: ${err}`
    );
  }
};

azureSpeakerRecognitionVerificacionIndependienteConfig.restablecerPerfil = async (
  profileId
) => {
  try {
    await axios({
      url: `${urlEndpointVerificacionProfiles}/${profileId}/reset`,
      method: "post",
      headers,
      httpsAgent,
    });
  } catch (err) {
    throw new Error(
      `Error en azureSpeakerRecognitionVerificacionIndependienteConfig.restablecerPerfil: ${err}`
    );
  }
};

module.exports = azureSpeakerRecognitionVerificacionIndependienteConfig;
