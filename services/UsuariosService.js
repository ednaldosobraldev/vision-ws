const pg = require("../infra/conexao");
//const moment = require("moment");
const bcrypt = require("bcrypt");
const { response } = require("express");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const saltRounds = 10;

class UsuariosService  {
  //------------------------ ok 18/05/23 ---------------------------
  async listaUsuarios(req, res) {
    console.log("-------------- listaUsuarios geral --------------------");
    const id_empresa = req.params.id_empresa;
    const sql = `SELECT u.nome, u.email, u.telefone1, u.ativo FROM usuarios u where u.id_empresa = ${id_empresa}`;
    try {
      const rs = await pg.execute(sql);
      const linhas = rs.rows.length;
      for (let i = 0; i < linhas; i++) {
        if (rs.rows[i].ativo == true) {
          rs.rows[i].ativo = "S";
        } else {
          rs.rows[i].ativo = "N";
        }
      }
      if (linhas > 0) {
        const retorno = {
          tamanho: linhas,
          usuarios: rs.rows,
        };
        res.status(200).json(retorno);
      } else {
        res.status(401).json(erro);
      }
      /**/
    } catch (error) {
      return res.status(500).send({
        mensagem: "Nenhum usuário encontrado!",
      });
    }
  }

  async listaNiveis(req, res) {
    console.log(
      "***************** lista niveis ********************************"
    );
    const sql = `SELECT * FROM usuarios_niveis`;
    console.log(sql);
    try {
      const rs = await pg.execute(sql);
      const linhas = rs.rows.length;
      console.log(linhas);
      if (linhas > 0) {
        const retorno = {
          tamanho: linhas,
          usuarios: rs.rows,
        };
        res.status(200).json(retorno);
      } else {
        res.status(401).send({ message: "Nenhum nivel encontrado" });
      }
    } catch (error) {
      return res.status(500).send({
        mensagem: "Nenhum nível cadastrado!",
      });
    }
  }
  //------------------------ ok 18/05/23 ---------------------------
  async buscaUsuarioPorId(req, res) {
    console.log(
      "------------------ Busca Usuario por id ------------------------"
    );
    //console.log(req.body)
    const id = req.params.id;
    //const { usuario, senha } = req.body;
    const sql = `SELECT * FROM usuarios where id_usuario = ${id}`;
    console.log(sql);
    try {
      const rs = await pg.execute(sql);
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

  //------------------------ ok 18/05/23 ---------------------------
  async gerarSenha(req, res) {
    //const senhax = req.params.senha;
    const senhax = req.body.senha;
    console.log(
      "-------------------------------- gerar senha ---------------------"
    );
    console.log(senhax);
    //try {
    bcrypt.hash(senhax, saltRounds, async (errBcrypt, hash) => {
      if (errBcrypt) {
        res.send({
          sucess: false,
          statusCode: 500,
          message: "Erro ao gerar hash",
        });
        return;
      } else {
        console.log(hash);
        return res.status(200).send(hash);
      }
    });
  }
  /*
  ************************** SAVLAR USUARIO ********************
  */

  async salvarUsuario(usuario, res) {
    const data_cadastro = new moment().format("YYYY-MM-DD HH:mm:ss");
    const data_alt = new moment().format("YYYY-MM-DD HH:mm:ss");
    const empresa_id = 1;

    const { login } = usuario.login;
    console.log("------------------ salvar usuario ----------------");
    console.info(login);
    const sql = "SELECT * FROM usuarios WHERE login=$1";
    //try {
    const results = await pg.execute(sql, [login]);
    const linhas = results.rows.length;
    console.log(">>>>>>>>>>>>> linhas encontradas: " + linhas);
    if (linhas > 0) {
      const response = {
        msg: "Usuário já cadastrado!",
      };
      return res.status(409).send(response);
    } else {
      bcrypt.hash(usuario.senha, saltRounds, async (errBcrypt, hash) => {
        if (errBcrypt) {
          return res.status(500).send({ error: errBcrypt });
        }
        const senha = hash;
        const usuarioFinal = {
          ...usuario,
          data_cadastro,
          data_alt,
          senha,
        };

        console.log(usuarioFinal);

        const sql =
          "INSERT INTO usuarios (nome, email, login, senha, telefone1, " +
          "telefone2, ativo, empresa_id, data_cadastro, data_alt) " +
          "values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id_usuario";
        const resultInsert = await pg.execute(sql, [
          usuario.nome,
          usuario.email,
          usuario.login,
          usuario_senha,
          usuario.telefone1,
          usuario.telefone2,
          usuario.ativo,
          empresa_id,
          usuario_data_cadastro,
          usuario_data_alt,
        ]);
        const response = {
          mensagem: "Usuario criado com sucesso",
          usuarioCriado: {
            id_usuario: resultInsert.rows[0].id_usuario,
            nome: usuario.nome,
          },
        };
        res.status(201).send(response);
      });
    }
    /*} catch (error) {
      return res.status(500).send({
        error: error,
        mensagem: "Não foi possível salvar!",
      });
    }*/
  }

  async login(req, res) {
    const { login, senha } = req.body;
    try {
      const results = await pg.execute(
        "SELECT * FROM usuarios WHERE login=$1",
        [login]
      );
      const linhas = results.rows.length;
      //console.log(results.rows);
      if (linhas > 0) {
        bcrypt.compare(senha, results.rows[0].senha, (err, result) => {
          if (result) {
            const token = jwt.sign(
              {
                id_usuario: results.rows[0].id_usuario,
                id_empresa: results.rows[0].id_empresa,
              },
              process.env.JWT_KEY,
              {
                expiresIn: "1h",
              }
            );
            console.warn(token);
            const response = {
              mensagem: "Autenticado com sucesso",
              id_empresa: results.rows[0].id_empresa,
              nome: results.rows[0].nome,
              token: token,
            };
            return res.status(200).send(response);
          } else {
            const response = {
              mensagem: "Falha na autenticação",
            };

            return res.status(401).send(response);
          }
        });
      } else {
        return res.status(401).send({ mensagem: "Usuario não encontrado!" });
      }
    } catch (error) {
      return res.status(500).send({
        error: error,
        mensagem: "Erro na busca!",
      });
    }
  }
  async deletar(id, res) {
    const idx = parseInt(id);
    try {
      const sql = "DELETE";
    } catch (error) {
      console.error(error);
    }
    return res.status(200).send({
      id: idx,
    });
  }
}
module.exports = new UsuariosService();
