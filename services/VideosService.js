const pg = require("../infra/conexao");
const { response } = require("express");
const moment = require("moment");

class VideosService {
  async listarVideos(req, res) {}
  async buscarvideo(req, res) {}
  async cadastrarVideo(req, res) {}
  async atualizarvideo(req, res) {}
  async deletarvideo(req, res) {}
  async inativarvideo(req, res) {}
}
module.exports = new VideosService();
