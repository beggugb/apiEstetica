import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Inventario, Articulo, Usuario, Almacen } = database;

class InventarioService {
    static setInventario(dato){
        return new Promise((resolve,reject) =>{
           Inventario.create(dato)
            .then((inventario) => resolve( inventario ))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }  
    static getInventario(id){
        return new Promise((resolve,reject) =>{
           Inventario.findByPk(id,{
            raw: true,
            nest: true            
           })
            .then((inventario)=> resolve( inventario ))
            .catch((reason) => reject({ message: reason.message }))      
        })
    } 
   static todu(dato, datoId) {   
    return new Promise((resolve, reject) => {
    var dd = dato.createdAt ? new Date(dato.createdAt) : new Date('2020-01-01 03:24:55.528-04')
    var reg = (new Date(dd + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]	    
      Inventario.update({registro : reg}, { where: { id: Number(datoId) } })
        .then((inventario) => resolve(inventario))
        .catch((reason) => reject(reason));
    });
  }

 static total(desde,hasta,tipo) {    
    return new Promise((resolve, reject) => {        
	let iTipo = tipo + '%'
            if (tipo === '' || tipo === undefined || tipo === null || tipo === '0') { iTipo = '%' }
        Inventario.findOne({ 
          raw: true,
          nest: true,
          attributes: [[Sequelize.fn('sum', Sequelize.col('total')), 'total']],            
           where: {[Op.and]: [
                   { registro: { [Op.between]: [desde, hasta]}},
		   { tipo: { [Op.iLike]: iTipo } }
                  ]}, 		
	   
        })           
            .then((result) => {              
                resolve(result)
            })
            .catch((reason) => {                
                reject({ message: reason.message })
              });           
     });
  }

  static totalDetalle(desde,hasta,tipo) {
    return new Promise((resolve, reject) => {       
       let iTipo = tipo + '%'
            if (tipo === '' || tipo === undefined || tipo === null || tipo === '0') { iTipo = '%' }	    
       Inventario.findAndCountAll({
         raw: true,
         nest: true,                  
	 where: {
          [Op.and]: [
            { registro: { [Op.between]: [desde, hasta]}},
            { tipo: { [Op.iLike]: iTipo } }		  
          ]
         },      
         order: [['id', 'DESC']],      
         include: [
          { model: Usuario, as:"usuario",attributes: ["id", "nombres"]},
          { model: Almacen, as:"aorigen",attributes: ["id", "nombre"]},
          { model: Almacen, as:"adestino",attributes: ["id", "nombre"]},		 
  		 
         ]
       })
         .then((inventarios) =>
           resolve({             
             total: inventarios.count,
             data: inventarios.rows,
           })
         )
         .catch((reason) => reject(reason));
     });
   }		


}
export default InventarioService; 
