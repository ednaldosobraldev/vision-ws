const customExpress = require("./config/customExpress");
const consign = require("consign");
const app = customExpress();
require("dotenv").config();

//script para criar as tabelas inicio
//const Tabelas = require('./infra/tabelas')
//Tabelas.init();
//script para criar as tabelas fim

consign().include("controllers").into(app);
const porta = 8001
app.listen(porta, () => console.log('**************** listening on port ' + porta));
