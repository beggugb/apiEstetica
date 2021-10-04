import CajaItemsService from "../services/CajaItemsService";
import CajaService from "../services/CajaService";

class CajaItemController { 
 
  static add(req, res) {        
    const { cajaId, tipo, monto } = req.body
    Promise.all([CajaService.item(cajaId)])
      .then(([caja]) => {            
        Promise.all([CajaItemsService.add(req.body)])
            .then(([icaja]) => {
                const newCaja = caja                                        
                if(tipo === 'ingreso'){
                    newCaja.montoIngreso = parseFloat(caja.montoIngreso) + monto
                    newCaja.montoFinal = parseFloat(caja.montoFinal) + monto
                }else{
                    newCaja.montoEgreso = parseFloat(caja.montoEgreso) + monto
                    newCaja.montoFinal = parseFloat(caja.montoFinal) - monto
                }
                Promise.all([CajaService.update(newCaja,caja.id)])
                    .then(([resCaja]) => {
                        Promise.all([CajaService.item(cajaId),CajaItemsService.getAllCaja(1,12,cajaId)])
                            .then(([caja, items]) => {
                                res.status(200).send({ result:{caja, items }});
                      })            
                })
            })      
        })        
    .catch((reason) => {          
     res.status(400).send({ message: reason.message });
    });

    /*  
    Promise.all([CajItemsService.add(req.body),NotaService.item(notaId)])
      .then(([result]) => {            
          Promise.all([                    
                  CajItemsService.getAllCaja(1,12,"createdAt","ASC",cajaId)
              ]) 
              .then(([result]) => {
                  res.status(200).send({ data: result });
              })
          })        
      .catch((reason) => {          
       res.status(400).send({ message: reason.message });
      });   
    */  
}

static listadetalle(req, res) {        
    Promise.all([CajaItemsService.getAllCaja(req.params.page,req.params.num,req.params.id)]) 
      .then(([result]) => {
           res.status(200).send({ result: result });                
          })        
      .catch((reason) => {      
          
        res.status(400).send({ reason });
      });   
  }

}


export default CajaItemController;
