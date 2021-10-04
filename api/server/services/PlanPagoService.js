import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { PlanPagos } = database;

class PlanPagosService {
    
    static setPlanPagoItem(dato){
        return new Promise((resolve,reject) =>{
           PlanPagos.create(dato)
            .then((plan) => resolve(plan.id))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }
    static setPlanPagosItem(data){
        return new Promise((resolve,reject) =>{
           PlanPagos.bulkCreate(data,{individualHooks: true})
            .then((plan) => resolve({ message: 'registrado' }))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }
    static getPlanPagosItems(crt){
        return new Promise((resolve,reject) =>{            
            PlanPagos.findAll({
                raw: true,
                nest: true,
                order: [['id','ASC']],
                where: { notaId: crt}                
            })
            .then((plan) => resolve(plan))
            .catch((reason)=> reject(reason))
        })
    }    

}
export default PlanPagosService; 