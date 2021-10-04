import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { CajaItem } = database;

class CajaItemsService {
   
  static add(newCaja) {    
    return new Promise((resolve, reject) => {        
        CajaItem.create(newCaja)
            .then((result) => {              
                resolve(result)
            })
            .catch((reason) => {                
                reject({ message: reason.message })
              });           
        
   });
  } 
  

   static getAllCaja(pag,num,cajaId) {  
    return new Promise((resolve, reject) => {
       let page = parseInt(pag);
       let der = num * page - num;
       CajaItem.findAndCountAll({
         raw: true,
         nest: true,
         offset: der,
         limit: num,
         where: { cajaId: { [Op.eq]: cajaId }},
         order: [['id', 'ASC']],                
       })
         .then((cajas) =>
           resolve({
             paginas: Math.ceil(cajas.count / num),
             pagina: page,
             total: cajas.count,
             data: cajas.rows,
           })
         )
         .catch((reason) => reject(reason));
     });
   }

 static getItemsCaja(cajaId) {
    return new Promise((resolve, reject) => {
       CajaItem.findAll({
         raw: true,
         nest: true,
         where: { cajaId: { [Op.eq]: cajaId }},
         order: [['id', 'DESC']],
       })
         .then((cajas) =>
           resolve(cajas)
         )
         .catch((reason) => reject(reason));
     });
   }

  
}

export default CajaItemsService;

