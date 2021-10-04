
import database from "../../src/models";

const { Modulo } = database;

class ModuloService {

    static getModulosUsuario(rolId){
        return new Promise((resolve,reject) =>{
            Modulo.findAll({
                raw: true,
                nest: true,
                where:{ rolId: rolId },                
                order: [['name','ASC']],
                attributes:['id','path','name','component','layout','enabled']                
            })
            .then((modulos) => resolve(modulos))
            .catch((reason)=> reject(reason))
        })

    }

}
  export default ModuloService; 