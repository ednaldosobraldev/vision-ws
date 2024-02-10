const pg = require("../infra/conexao");
const { response } = require("express");
const moment = require("moment");

class TiposUsuarioService {
  async cadastrarTipoUsuario(req, res) {}
  async atualizarTipoUsuario(req, res) {}
  async deletarTipoUsuario(req, res) {}
  async inativarTipoUsuario(req, res) {}
  async listarTiposUsuarios(req, res) {}
  async buscarTipoUsuario(req, res) {}
}
module.exports = new TiposUsuarioService();
