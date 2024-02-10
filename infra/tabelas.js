const client = require("./conexao");

class Tabelas {
  init(client) {
    this.client = client;
    this.criarBancoDeDados();
    this.criarTabelaUsuarios();
    this.criarTabelaEmpresas();
    this.criarTabelaFiliais();
  }

  async criarBancoDeDados() {
    const newDatabase = "odonto";
    const sql1 = `SELECT FROM pg_database WHERE datname = '${newDatabase}'`;
    const res = await client.execute(sql1, (err, res) => {
      client.end();
    });
    let encontrado = res.rowCount;
    if (encontrado === 0) {
      console.log("Não Encontrado");
      const sql2 = "CREATE DATABASE " + newDatabase;
      const res = await client.execute(sql2, (err, res) => {
        client.end();
      });
    } else {
      console.log("Encontrado");
    }
    console.log(res.rowCount);
  }
  async criarTabelaUsuarios() {
    const sql =
      "CREATE TABLE IF NOT EXISTS usuarios " +
      "(usuario_id Serial NOT NULL, " +
      "usuario_nome Character varying(40) NOT NULL, " +
      "usuario_email Character varying(50) NOT NULL, " +
      "usuario_login Character varying(20) NOT NULL, " +
      "usuario_senha Character varying(200) NOT NULL, " +
      "usuario_telefone1 Character varying(20) NOT NULL, " +
      "usuario_telefone2 Character varying(20), " +
      "usuario_data_cadastro Date NOT NULL, " +
      "usuario_data_alt Date, " +
      "usuario_id_alt Integer NOT NULL, " +
      "usuario_nivel Integer NOT NULL, " +
      "usuario_ativo Character(1) NOT NULL, " +
      "filial_id Integer , PRIMARY KEY (usuario_id))";
    const res = await client.execute(sql, (err, res) => {
      if (err) {
        console.error("Tabela usuarios já existe");
        return;
      }
      console.log("Table usuarios criada com sucesso");
      client.end();
    });
    console.log(res.rows);
  }
  async criarTabelaEmpresas() {
    const sql =
      "CREATE TABLE IF NOT EXISTS empresas " +
      "(empresa_id Serial NOT NULL, " +
      "empresa_descricao Character varying(30) NOT NULL, " +
      "empresa_telefone Character varying(20) NOT NULL, " +
      "empresa_email Character varying(50) NOT NULL, " +
      "empresa_data_cadastro Date NOT NULL, " +
      "empresa_ativo Character(1) NOT NULL, PRIMARY KEY (empresa_id))";
    const res = await client.execute(sql, (err, res) => {
      if (err) {
        console.error("Tabela empresas já existe");
        return;
      }
      console.log("Table empresas criada com sucesso");
      client.end();
    });
    console.log(res.rows);
  }
  async criarTabelaFiliais() {
    const sql =
      "CREATE TABLE IF NOT EXISTS filiais " +
      "(filial_id Serial NOT NULL, " +
      "empresa_id Integer NOT NULL, " +
      "filial_fantasia Character varying(30) NOT NULL, " +
      "filiail_endereco Character varying(20) DEFAULT 30 NOT NULL, " +
      "filial_numero Character varying(5) NOT NULL, " +
      "filial_bairro Character varying(20) NOT NULL, " +
      "filial_cidade Character varying(20) NOT NULL, " +
      "filial_uf Character(2) NOT NULL, " +
      "filial_cep Character varying(8) NOT NULL, " +
      "filial_ativo Character(1) NOT NULL , PRIMARY KEY (filial_id))";
    const res = await client.execute(sql, (err, res) => {
      if (err) {
        console.error("Tabela filiais já existe");
        return;
      }
      console.log("Table filiais criada com sucesso");
      client.end();
    });
    console.log(res.rows);
  }

  async criarusuarioPadrao() {
    const sql =
      "INSERT INTO usuarios (usuario, senha) VALUES   ('admin', 'admin')";
    const res = await client.execute(sql, (err, res) => {
      if (err) {
        console.error("Tabela teste já existe");
        return;
      }
      console.log("Table teste criada com sucesso");
      client.end();
    });
    console.log(res.rows);
  }
}

module.exports = new Tabelas();
