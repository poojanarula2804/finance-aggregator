var express = require("express");
const axios = require("axios");
var router = express.Router();

var backendURL = "http://localhost:9001/healthInsurance";

router.get('/', async (req, res) => {
    var allInsurances = [];
    await axios
        .get(backendURL)
        .then((res) => {
            console.log(`statusCode: ${res.status}`);
            allInsurances = res.data.message;
        })
        .catch((error) => {
            console.error(error);
        });
    console.log(allInsurances.length, " insurances returned")
    res.render('health-insurance', {allInsurances : allInsurances});
})

router.post("/query", async (req, res) => {
    var allInsurances = [];
    var noOfPeople = req.body.noOfPeople;
    var noOfDiseases = req.body.noOfDiseases;
    var age = req.body.age;
    var criteria = req.body.criteria;
    let queryParams = {
        noOfPeople : noOfPeople,
        age : age,
        noOfDiseases : noOfDiseases,
        criteria: criteria
    }
    await axios
        .post(
            backendURL + "/query", queryParams
        )
        .then((res) => {
            console.log(`statusCode: ${res.status}`);
            allInsurances = res.data.message;
        })
        .catch((error) => {
            console.error(error);
        });
    console.log(criteria);
    res.render('health-insurance', {
        allInsurances: allInsurances,
        noOfDiseases: noOfDiseases,
        noOfPeople: noOfPeople,
        age: age,
        criteria: criteria
    });
})

module.exports = router;