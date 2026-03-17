const axios = require("axios");

const FLASK_BASE_URL = process.env.FLASK_BASE_URL || "http://localhost:5000";

exports.getPredictionFromFlask = async (text) => {
  const response = await axios.post(`${FLASK_BASE_URL}/predict`, {
    text: text,
  });

  return response.data;
};