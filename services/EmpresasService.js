const pg = require("../infra/conexao");
const { response } = require("express");
const moment = require("moment");

class EmpresaService {
  async atualizarEmpresa(req, res) {
    console.log(req.body);
    const id_empresa = req.params.id_empresa;
    const data_alt = new moment().format("YYYY-MM-DD HH:mm:ss");
    const empresa = req.body;
    // const empresaFinal = { ...empresa, data_cadastro, data_alt };
    // console.log(empresa)
    try {
      //const sql = "INSERT INTO atendimentos SET ?";
      const sql =
        "UPDATE empresas SET descricao_empresa = $1, razao = $2, fantasia = $3, cpf_cpnj = $4, ie = $5, cep = $6, rua = $7, numero = $8, bairro = $9, " +
        "cidade = $10, uf = $11, telefone1 = $12, telefone2 = $13, ativo = $14, data_alt $ 15) " +
        "WHERE id_empresa = $16 ";
      const resultInsert = await pg.execute(sql, [
        empresa.descricao_empresa,
        empresa.razao,
        empresa.fantasia,
        empresa.cpf_cpnj,
        empresa.ie,
        empresa.cep,
        empresa.rua,
        empresa.numero,
        empresa.bairro,
        empresa.cidade,
        empresa.uf,
        empresa.telefone1,
        empresa.telefone2,
        empresa.ativo,
        data_alt,
        id_empresa
      ]);
      const response = {
        mensagem: "Empresa Cadastrada Com Sucesso",
        empresa_cadastrada: {
          id_empresa: resultInsert.rows[0].id_empresa,
          descricao_empresa: empresa.descricao_empresa,
          data_cadastro: data_cadastro,
        },
      };
      res.status(201).send(response);
    } catch (error) {
      console.log(error);
      res
        .status(401)
        .send("tabela: " + error.table + " campo: " + error.column);
    }

  }
  async deletarEmpresa(req, res) {}
  async inativarEmpresa(req, res) {}
 
  async listarEmpresas(req, res) {
    const id_empresa = req.params.id_empresa;
    console.log("-------------- lista_empresas geral --------------------");
    let sqlListaEmpresas = "SELECT " +
    "  * " +
    "FROM " +
    "   empresas e " + 
    "WHERE " +
    "e.id_empresa = $1"
    try {
      const rs = await pg.execute(sqlListaEmpresas, [id_empresa]);
      const linhas = rs.rows.length;
      console.log()

      if (linhas > 0) {
        const retorno = {
          tamanho: linhas,
          empresas: rs.rows,
        };
        res.status(200).json(retorno);
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
  async buscarempresaPeloId(req, res) {
    const id_empresa = req.params.id_empresa;
    try {
      const rs = await pg.execute(
        "SELECT " +
          "   e.id_empresa, " +
          "   e.descricao_empresa, " +
          "   e.cpf_cnpj, " +
          "   e.razao, " +
          "   e.fantasia, " +
          "   e.telefone1, " +
          "   e.ativo " +
          "FROM " +
          "   empresas e " +
          "WHERE " +
          "   e.id_empresa = $1 ",
        [id_empresa]
      );
      res.status(200).json(rs.rows[0]);
    } catch (error) {
      res.status(401).json(error);
    }
  }

  async cadastrarEmpresa(req, res) {
    console.log(req.body);
    const data_cadastro = new moment().format("YYYY-MM-DD HH:mm:ss");
    const data_alt = new moment().format("YYYY-MM-DD HH:mm:ss");
    const empresa = req.body;
    // const empresaFinal = { ...empresa, data_cadastro, data_alt };
    // console.log(empresa)
    try {
      //const sql = "INSERT INTO atendimentos SET ?";
      const sql =
        "INSERT INTO empresas (descricao_empresa, razao, fantasia, cpf_cpnj, ie, cep, rua, numero, bairro, " +
        "cidade, uf, telefone1, telefone2, ativo, data_cadastro, data_alt) " +
        "values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING id_empresa, descricao_empresa";
      const resultInsert = await pg.execute(sql, [
        empresa.descricao_empresa,
        empresa.razao,
        empresa.fantasia,
        empresa.cpf_cpnj,
        empresa.ie,
        empresa.cep,
        empresa.rua,
        empresa.numero,
        empresa.bairro,
        empresa.cidade,
        empresa.uf,
        empresa.telefone1,
        empresa.telefone2,
        empresa.ativo,
        data_cadastro,
        data_alt,
      ]);
      const response = {
        mensagem: "Empresa Cadastrada Com Sucesso",
        empresa_cadastrada: {
          id_empresa: resultInsert.rows[0].id_empresa,
          descricao_empresa: empresa.descricao_empresa,
          data_cadastro: data_cadastro,
        },
      };
      res.status(201).send(response);
    } catch (error) {
      console.log(error);
      res
        .status(401)
        .send("tabela: " + error.table + " campo: " + error.column);
    }
  }
  async desativarempresa(req, res) {
    console.log(
      "--------------------- DESATIVAR empresa --------------------"
    );
    let id_empresa = req.params.id;
    console.log("---------- id empresa passad back: " + id_empresa);

    try {
      let sqlAtivo = "SELECT ativo FROM  WHERE id_empresa = $1";
      let rsSqlAtivo = await pg.execute(sqlAtivo, [id_empresa]);
      let linhasAtivo = rsSqlAtivo.rowCount;
      if (linhasAtivo > 0) {
        let rsAtivo = rsSqlAtivo.rows[0].ativo;
        console.log("rsAtivo encontrado: " + rsAtivo);
        rsAtivo = !rsAtivo;

        let sqlUpdate =
          "UPDATE empresas SET ativo = $1 WHERE id_empresa = $2";
        let rsUpdate = await pg.execute(sqlUpdate, [rsAtivo, id_empresa]);
        let linhasUpdate = rsUpdate.rowCount;
        if (linhasUpdate > 0) {
          console.log(
            "----------------------- atualizado --------------------"
          );
          const response = {
            mensagem: "Registro Ativado/Inativado com sucesso.",
          };
          return res.status(200).send(response);
        } else {
          const response = {
            mensagem: "Não foi possível Ativado/Inativado o registro.",
          };
          return res.status(401).send(response);
        }
      }
    } catch (error) {
      return res.status(500).send({
        mensagem: "Nenhum dado encontrado!",
      });
    }
  }

  async avancarRegistro(req, res) {
    const id_empresa = req.params.id_empresa;
    let sqlFind =
      "SELECT " +
      "     min(e.id_empresa) proximo " +
      "FROM " +
      "     empresas e " +
      "WHERE " +
      "     e.id_empresa = $1";
    try {
      let rsFind = await pg.execute(sqlFind,  [id_empresa]);

      let linhasFind = rsFind.rowCount;
      if (linhasFind > 0) {
        let sqlBusca =
          "SELECT " +
          "e.nome_empresa, " +
          "e.id_empresa, " +
          "e.rua, " +
          "e.numero, " +
          "e.bairro, " +
          "e.cidade, " +
          "e.uf, " +
          "e.cep, " +
          "e.telefone1, " +
          "e.telefone2, " +
          "e.ativo " +
          "FROM " +
          "empresas e " +
          "WHERE " +
          "e.id_empresa = $1";
        try {
          const rs = await pg.execute(sqlBusca, [id_empresa, id_empresa]);
          res.status(200).json(rs.rows[0]);
        } catch (error) {
          res.status(401).json(error);
        }
      }
    } catch (error) {
      res.status(401).json(erro);
    }
  }
  async retrocederRegistro(req, res) {}
  async buscarEscolaPeloId(req, res){}
}

module.exports = new EmpresaService();
