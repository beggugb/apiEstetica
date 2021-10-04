import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { Caja, Usuario } = database;

class CajaService {

  static getItem(userId) {    
    return new Promise((resolve, reject) => {
      Caja.findOne({
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        limit:1,        
        where :  {
          [Op.and]: [
            { estado: {[Op.eq]: false }},
            { usuarioId: userId }
          ] 
        },
      })
        .then((caja) => resolve(caja))
        .catch((reason) => reject(reason));
    });
  }
   
  static add(newCaja) {    
    return new Promise((resolve, reject) => {        
        Caja.create(newCaja)           
            .then((result) => {              
                resolve({ message: "success" })
            })
            .catch((reason) => {                
                reject({ message: reason.message })
              });           
        
   });
  }
  
  static verificarCaja(usuarioId, dos) {    
        var d         = new Date()
        var formatted = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]         
    return new Promise((resolve, reject) => {        
        Caja.findOne({
            raw: true,
            nest: true,
            where : [{ createdAt: {[Op.eq]: formatted }},
            { estado: {[Op.eq]: false }}, 
            { usuarioId: {[Op.eq]: usuarioId }}]
        })           
            .then((result) => {                              
                resolve(result)
            })
            .catch((reason) => {                
                reject({ message: reason.message })
              });           
        
   });
  }

  static getAll(usuarioId) {        
    return new Promise((resolve, reject) => {        
        Caja.findAll({
            order: [['createdAt', 'DESC']],       
            limit: 10,     
            attributes:['id','descripcion','estado','userId'],
            where: { userId: { [Op.eq]: usuarioId }}            
        })
        .then((CajaItemss) => {                
                resolve({ message: "Lista CajaItemss", data: CajaItemss })
            })
        .catch((reason) => {                
                reject({ message: reason.message, data: null })
         });
       });
   }

   static getAllUsuario(pag,num,usuarioId) {  
    return new Promise((resolve, reject) => {
       let page = parseInt(pag);
       let der = num * page - num;
       Caja.findAndCountAll({
         raw: true,
         nest: true,
         offset: der,
         limit: num,
         where: { usuarioId: { [Op.eq]: usuarioId }},
         order: [['id','DESC']],                
	   include: [
            { model: Usuario,as: "usuario", attributes: ["id", "nombres"]}
        ]
      
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

   static item(datoId) {    
    return new Promise((resolve, reject) => {
      Caja.findOne({
        raw: true,
        nest: true,
        where: { id: datoId }, 
	include: [
            { model: Usuario,as: "usuario", attributes: ["id", "nombres"]}
        ]
      
      })
        .then((caja) => resolve(caja))
        .catch((reason) => reject(reason));
    });
  }

  static update(newCaja,datoId) {    
    return new Promise((resolve, reject) => {        
      Caja.update(newCaja, { where: { id: Number(datoId) } })
            .then((result) => {              
                resolve(result)
            })
            .catch((reason) => {                
                reject({ message: reason.message })
              });       
        });
    }



  static total(desde,hasta,usuarioId) {	   
      return new Promise((resolve, reject) => {    	    
	    console.log(usuarioId)
      let iuser = 0
      let fuser = 30

      if (usuarioId === '' || usuarioId === undefined || usuarioId === null || usuarioId === 0) 
	    { console.log('pp') }	      
      else{
        iuser = usuarioId
        fuser = usuarioId    
		      
      }
          Caja.findAll({ 
            raw: true,
            nest: true,
            attributes: [[Sequelize.fn('sum', Sequelize.col('montoFinal')), 'total']],
            where :  {
		          [Op.and]: [
                  {fechaCierre: {[Op.between]: [desde, hasta]}},
		              {usuarioId: {[Op.between]: [iuser, fuser]}}
		          ]
	          }	    
          })           
              .then((result) => {              
                  resolve(result)
              })
              .catch((reason) => {                
                  reject({ message: reason.message })
                });           
       });
    }
  
    static totalDetalle(desde,hasta,usuarioId) {
      return new Promise((resolve, reject) => {       
   console.log(usuarioId)
	let iuser = 0
      let fuser = 30

      if (usuarioId === '' || usuarioId === undefined || usuarioId === null || usuarioId === 0) 
         { console.log('pp') }        
      else{
          iuser = usuarioId
          fuser = usuarioId

      }       
        Caja.findAndCountAll({
           raw: true,
           nest: true,                 
	        where :  {
                [Op.and]: [
                  {fechaCierre: {[Op.between]: [desde, hasta]}},
                  {usuarioId: {[Op.between]: [iuser, fuser]}}
                ] 
              },	 
           order: [['createdAt', 'DESC']],
           include: [
            { model: Usuario, attributes: ["id", "nombre"]}
        ]      
         })
           .then((cajas) =>
             resolve({             
               total: cajas.count,
               data: cajas.rows,
             })
           )
           .catch((reason) => reject(reason));
       });
     }
     
     
   static generalTotal(desde,hasta) {	   
    return new Promise((resolve, reject) => {    	    	    
      Caja.findOne({ 
        raw: true,
        nest: true,
        attributes: [
          [Sequelize.fn('sum', Sequelize.col('montoIngreso')), 'ingresos'],
          [Sequelize.fn('sum', Sequelize.col('montoEgreso')), 'egresos']          
        ],
        where :  {fechaCierre: {[Op.between]: [desde, hasta]}}		              		              
          })           
       .then((result) => {              
              resolve(result)
        })
        .catch((reason) => {                
            reject({ message: reason.message })
       });           
       });
    } 
  
}

export default CajaService;
