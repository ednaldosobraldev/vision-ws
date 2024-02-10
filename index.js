const customExpress = require("./config/customExpress");
const consign = require("consign");
const app = customExpress();
require("dotenv").config();





//script para criar as tabelas inicio
//const Tabelas = require('./infra/tabelas')
//Tabelas.init();
//script para criar as tabelas fim

consign().include("controllers").into(app);

app.listen(3001, () => console.log("**************** listening on port 3001 ********************"));
