const pg = require("../infra/conexao");
const { response } = require("express");
const moment = require("moment");

class TurmasService {
  async cadastrarTurma(req, res) {}
  async atualizarTurma(req, res) {}
  async deletarTurma(req, res) {}
  async inativarTurma(req, res) {}
  async listarTurmas(req, res) {}
  async buscarTurma(req, res) {}
}
module.exports = new TurmasService();
