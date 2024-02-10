const pg = require("../infra/conexao");
const { response } = require("express");
const moment = require("moment");

class ManuaisService {
  async cadastrarManual(req, res) {}
  async atualizarManual(req, res) {}
  async deletarManual(req, res) {}
  async inativarManual(req, res) {}
  async listarManuais(req, res) {}
  async buscarManual(req, res) {}
}
module.exports = new ManuaisService();
