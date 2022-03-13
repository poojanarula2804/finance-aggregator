const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const healthInsuranceDB = require("../models/HealthInsurance");

router.post("/query", async(req, res) => {
    try{
        const age=parseFloat(req.query.age);
        const no_of_people=parseFloat(req.query.noOfPeople);
        const no_of_diseases=parseFloat(req.query.noOfDiseases);
       const sortCriteria= req.query.criteria ;
       console.log('string', sortCriteria);
       let allInsurances;
       if(sortCriteria == 'premium')
            allInsurances = await healthInsuranceDB.find().sort({'premium':1});
        else if(sortCriteria == 'cover')
            allInsurances = await healthInsuranceDB.find().sort({'cover':1});
        else if(sortCriteria == 'cashless_hospitals')
            allInsurances = await healthInsuranceDB.find().sort({'cashless_hospitals':1});
      
        for (let i = 0 ; i < allInsurances.length;i++){
          allInsurances[i].premium +=  (1000*no_of_people) + (2000*no_of_diseases);
        }
      console.log(allInsurances);
      res.status(200).send({ message: allInsurances, status: 1 });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: err, status: 0 });
    }
});
router.get("/", async(req, res) => {
    try{
        const allInsurances = await healthInsuranceDB.find();
        console.log(allInsurances.length);
        console.log(allInsurances);
        res.status(200).send({ message: allInsurances, status: 1 });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ message: err, status: 0 });
    }
});



module.exports = router;