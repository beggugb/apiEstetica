import ArticuloService from "../services/ArticuloService";
import AlmacenItemService from "../services/AlmacenItemService";
import AlmacenService from "../services/AlmacenService";

class AlmacenController {   

  static lista(req, res) {
    AlmacenService.getListas()
      .then((almacenes) => {
            res.status(200).send({result: almacenes });
        })
      .catch((reason) => {
        res.status(400).send({ message: reason });
    });
  }	

  static stock(req, res) {    
    const { categoriaId, almacenId } = req.body          
    if(categoriaId === 0 || categoriaId === 1)
    {
      AlmacenService.getServicios()
      .then((articulos) => {     
          let iok = formatear(articulos)                           
          res.status(200).send({result: iok });                        
        })                   
      .catch((reason) => {    
        console.log(reason)          
        res.status(400).send({ message: reason });
      })
    }else{
      AlmacenService.getStock(categoriaId, almacenId)
      .then((articulos) => {                      
            res.status(200).send({result: articulos });                        
        })                   
      .catch((reason) => {    
        console.log(reason)          
        res.status(400).send({ message: reason });
      })
    }
  }
  
  static buscarItems(req, res) { 
    const { nombre,almacenId } = req.body
    console.log(nombre)
    const regex = /^[0-9]*$/;
    const onlyNumbers = regex.test(nombre);
    console.log(onlyNumbers)	  
    if(onlyNumbers)
    {
    AlmacenService.searchCodigoStock(nombre,almacenId)
      .then((articulos) => {
            res.status(200).send({result: articulos });
        })
      .catch((reason) => {
        console.log(reason)
        res.status(400).send({ message: reason });
    });
	
    }else{
      AlmacenService.searchNombreStock(nombre,almacenId)	    
      .then((articulos) => {
            res.status(200).send({result: articulos });
        })
      .catch((reason) => {
        console.log(reason)
        res.status(400).send({ message: reason });
    });

    }	  
  }	
	
}

function formatear(data){
  let newData = Array()
  data.map((item) => {
    let ite = {
      "id":item.id,
      "almacenId" :1,
      "articuloId" :item.id,
      "stock" : 100,
      "articulo": {
        "id": item.id,
        "nombre": item.nombre,
        "categoriaId": 1,
        "filename": item.filename,
        "precioVenta": item.precioVenta,
        "inOferta": false,
        "nombreCorto": item.nombreCorto,
        "unidad": null,
        "comision": item.comision
      }
    }  
    newData.push(ite)  
  })
  return newData  
}
export default AlmacenController;
