const pg = require("../infra/conexao");
const { response } = require("express");
const moment = require("moment");

class SalasService {
  //--------------- NÃO IMPLEMENTAR - SERÁ CRIADO PELOS PROFESSORES ---------------
  async cadastrarSalasDesafio(req, res) {}
  //--------------- NÃO IMPLEMENTAR - SERÁ CRIADO PELOS PROFESSORES ---------------
  async atualizarSalasDesafio(req, res) {}
  async deletarSalasDesafio(req, res) {}
  async inativarSalasDesafio(req, res) {}
  async listarSalasDesafio(req, res) {}
  async buscarSalasDesafio(req, res) {}
}
module.exports = new SalasService();
