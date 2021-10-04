import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { NotaCobranza } = database;

class NotaService {
    static setNota(dato){
        return new Promise((resolve,reject) =>{
           NotaCobranza.create(dato)
            .then((nota) => resolve( nota.id ))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }   

}
export default NotaService; 