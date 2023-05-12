const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");
const crypto = require("crypto");

const Registration = require("../models/RegistrationSchema");

const KEY=process.env.CIPHER_KEY;
const IV=process.env.CIPHER_IV;
const ALGO=process.env.CIPHER_ALGORITHM;

router.post("/details", auth, async (req, res) => {
    try{
        const {data} = req.body;
        const cipher = crypto.createDecipheriv(ALGO, KEY, IV);
        let decryptedData = cipher.update(data, "hex", "utf-8" ) + cipher.final("utf-8")
        const teamID = decryptedData.split("$")[1];
        
        // console.log(decryptedData, teamID);

        // search in DB
        const team = await Registration.findById(teamID)
        if(!team){
            res.status(403).json({message: "team not found"}); 
        }
        else{
            res.status(200).json(team);
        }
    }
    catch(e){
        console.log(e);
        res.status(422).json({error: e});
    }
});

module.exports = router; 