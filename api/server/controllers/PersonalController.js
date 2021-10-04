import PersonalService from "../services/PersonalService";

class PersonalController {
  
  static registrar(req, res) {    
    PersonalService.setPersonal(req.body)
      .then((Personal) => {                      
          res.status(200).send({result: Personal });                        
        })                   
      .catch((reason) => { 
	console.log(reason)      
        res.status(400).send({ message: reason });
    });
  }

  static actualizar(req, res) {    
    PersonalService.updatePersonal(req.body,req.params.id)
      .then((Personal) => {     
           res.status(200).send({result: Personal });                                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }
  static item(req, res) {    
    PersonalService.getPersonal(req.params.id)
      .then((Personal) => {                      
            res.status(200).send({result: Personal });                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }

  static data(req, res) {    
    PersonalService.getPersonals(req.params.page,req.params.num)
      .then((Personals) => {                      
            res.status(200).send({result: Personals });                        
        })                   
      .catch((reason) => {              
	console.log(reason)      
        res.status(400).send({ message: reason });
    });
  }
    static lista(req, res) {
    PersonalService.getListas()
      .then((personas) => {
            res.status(200).send({result: personas });
        })
      .catch((reason) => {
        res.status(400).send({ message: reason });
    });
  }	

  static buscar(req, res) {    
    const { nombres } = req.body      
    const regex = /^[0-9]*$/;
    const onlyNumbers = regex.test(nombres);
    if(onlyNumbers && nombres != ''){
      PersonalService.searchPersonalsNit(nombres)
      .then((Personals) => {
            res.status(200).send({result: Personals });
        })
      .catch((reason) => {
	console.log(reason)
      
        res.status(400).send({ message: reason });
    });	
    }else{
    	    
    PersonalService.searchPersonals(nombres)
      .then((Personals) => {                      
            res.status(200).send({result: Personals });                        
        })                   
      .catch((reason) => {              
	console.log(reason)
      
        res.status(400).send({ message: reason });
    });
   }	    
  }

}

export default PersonalController;
