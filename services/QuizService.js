const pg = require("../infra/conexao");
const { response } = require("express");
const moment = require("moment");

class QuizService {
  async salvarQuiz(req, res) {}
  async atualizarQuiz(req, res) {}
  async deletarQuiz(req, res) {}
  async inativarQuiz(req, res) {}
  async listarQuiz(req, res) {}
  async buscarQuiz(req, res) {}
}
module.exports = new QuizService();
