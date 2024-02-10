const client = require("../infra/conexao");
const moment = require("moment");

class Atendimentos {
  async lista(req, res) {
    const sql = "SELECT * FROM usuarios";
    try {
      const rs = await client.execute(sql);
      const linhas = rs.rows.length;
      console.log("linhas: " + linhas);
      if (linhas > 0) {
        const response = {
          total: linhas,
          usuarios: rs.rows[0],
        };
        res.status(200).json(response);
      } else {
        res.status(401).json(erro);
      }
      /**/
    } catch (error) {
      return res.status(500).send({
        error: error,
        mensagem: "Erro na consulta!",
      });
    }
  }

  async buscaPorId(id, res) {
    const sql = `SELECT * FROM usuarios where usuario_id = ${id}`;
    try {
      const rs = await client.execute(sql);
      const linhas = rs.rows.length;
      console.log("linhas: " + linhas);
      if (linhas > 0) {
        res.status(200).json(rs.rows[0]);
      } else {
        res.status(401).json(erro);
      }
      /**/
    } catch (error) {
      return res.status(500).send({
        mensagem: "Nenhum dado encontrado!",
      });
    }
  }
  async adiciona(atendimentos, res) {
    const dataCriacao = new moment().format("YYYY-MM-DD HH:mm:ss");
    //const data = moment(atendimentos.data,  'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');
    //const dataEhValida = moment(data).isSameOrAfter(dataCriacao);
    const atendimentoFinal = { ...atendimentos, dataCriacao };
    console.log(atendimentoFinal);
    const sql = "INSERT INTO atendimentos SET ?";
    const rs = await client.execute(sql, [atendimentoFinal], (erro, result) => {
      if (erro) {
        console.log(erro);
      } else {
        console.log(rs.rows);
      }
    });
    console.log(rs.rows);
  }

  async alterar(id, valores, res) {
    const sql = 'UPDATE atendimentos SET ? WHERE id=?' ;
    const rs = await client.execute(sql,[valores, id]);


  }

  async deletar(id, res) {
    const sql = 'DELETE FROM atendimentos WHERE id=?' ;
    const rs = await client.execute(sql, id);
  }
}

module.exports = new Atendimentos();
