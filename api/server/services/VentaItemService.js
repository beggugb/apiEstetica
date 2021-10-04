import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { VentaItem, Articulo, Categoria, Marca, Personal} = database;

class VentaItemService {
    static setVentaItem(data){
        return new Promise((resolve,reject) =>{
           VentaItem.bulkCreate(data,{individualHooks: true})
            .then((VentaItem) => resolve({ message: 'registrado' }))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }
    static deleteVentaItems(datoId) {
        return new Promise((resolve, reject) => {
          VentaItem.destroy({ where: { ventaId: Number(datoId) } })
            .then((ventaItem) => resolve(ventaItem))
            .catch((reason)  => reject(reason));
        });
    }	
    static getVentaItems(crt){
        return new Promise((resolve,reject) =>{            
            VentaItem.findAll({
                raw: true,
                nest: true,
                order: [['id','ASC']],
                where: { ventaId: crt},
                include:[
                    {
		      model: Articulo, as: "articulo",attributes:['id','nombre'],
		      include:[
			      {model: Categoria, as:"categoria",attributes:['id','nombre']},
			      {model: Marca, as:"marca",attributes:['id','nombre']}
		      ]
	           }		    
                ]
            })
            .then((VentaItems) => resolve(VentaItems))
            .catch((reason)=> reject(reason))
        })
    } 

    static total(desde,hasta) {            
        return new Promise((resolve, reject) => {        
            /*let iPersona = 0
            let fPersona = 50

            if(iPersona === '' || iPersona === 0 || iPersona === '0')    
            { console.log('vacio') }
            else{ iPersona = personalId; fPersona = personalId  }*/
            VentaItem.findOne({ 
              raw: true,
              nest: true,
              attributes: [[Sequelize.fn('sum', Sequelize.col('comision')), 'total']],            
               where: {[Op.and]: [
                       { fechaRegistro: { [Op.between]: [desde, hasta]}},
                       /*{ personalId: { [Op.between]: [iPersona, fPersona]}}*/
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

    static totalDetalle(desde,hasta) {
       return new Promise((resolve, reject) => {   
        /*let iPersona = 0
        let fPersona = 50
        if(iPersona === '' || iPersona === 0 || iPersona === '0')    
        { console.log('vacio') }
        else{ iPersona = personalId; fPersona = personalId  }
        */
        VentaItem.findAll({
            raw: true,
            nest: true,                              
            where: {
             [Op.and]: [
                { fechaRegistro: { [Op.between]: [desde, hasta]}},
               /* { personalId: { [Op.between]: [iPersona, fPersona]}}*/
            ]
            },      
            include: [{ model: Personal, as:"personal",attributes: ["id", "nombres"]}],
            attributes: ['personalId','fechaRegistro',
            [Sequelize.fn('sum', Sequelize.col('comision')), 'tComision'],
            [Sequelize.fn('sum', Sequelize.col('valor')), 'tVenta']
        ],                                  
            group: ['personalId','fechaRegistro','personal.id']
          })
            .then((inventarios) =>
              resolve(inventarios)
            )
            .catch((reason) => reject(reason));
    
        });
    }

     static dtotal(desde,hasta,personalId) {
        return new Promise((resolve, reject) => {
            VentaItem.findOne({
              raw: true,
              nest: true,
              attributes: [[Sequelize.fn('sum', Sequelize.col('comision')), 'total']],
               where: {[Op.and]: [
                       { fechaRegistro: { [Op.between]: [desde, hasta]}},
                       { personalId: personalId }
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
	
	
    static dtotalDetalle(desde,hasta,personalId) {
       return new Promise((resolve, reject) => {
        VentaItem.findAll({
            raw: true,
            nest: true,
            where: {
             [Op.and]: [
                { fechaRegistro: { [Op.between]: [desde, hasta]}},
                { personalId: personalId }
            ]
            },
            include: [
		    { model: Personal, as:"personal",attributes: ["id", "nombres"]},
 		    { model: Articulo, as:"articulo",attributes: ["id", "nombre","comision"]}	
	            ],
            attributes: ['personalId','fechaRegistro','cantidad','comision','valor']        
          })
            .then((inventarios) =>
              resolve(inventarios)
            )
            .catch((reason) => reject(reason));

        });
    }

    static totals(desde,hasta) {            
        return new Promise((resolve, reject) => {                    
            VentaItem.findAll({
              raw: true,
              nest: true,
              attributes: ['isService',
                  [Sequelize.fn('sum', Sequelize.col('comision')), 'valores'],[Sequelize.fn('count', Sequelize.col('id')), 'cantidad']],
                where: { fechaRegistro: { [Op.between]: [desde, hasta]}}, 
                group: ['isService'] 		
           
            })           
                .then((result) => {              
                    resolve(result)
                })
                .catch((reason) => {                
                    reject({ message: reason.message })
                  });           
         });
    }
    static totalesGenerales(desde,hasta) {            
        return new Promise((resolve, reject) => {                    
            VentaItem.findAll({ 
                raw: true,
                nest: true,
                attributes: ['isService',[Sequelize.fn('sum', Sequelize.col('valor')), 'ventas'],[Sequelize.fn('count', Sequelize.col('id')), 'cantidad']],            
                where: { fechaRegistro: { [Op.between]: [desde, hasta]}}, 
                group: ['isService']
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
export default VentaItemService; 
