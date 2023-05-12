const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");

const Registration = require("../models/RegistrationSchema");

router.post("/attendance", auth, async (req, res) => {
    try{
        const { teamID } = req.body;

        //search in DB
        const Team = await Registration.findById(teamID)
        if(!Team){
            res.status(403).json({message: "team not found"}); 
        }
        else{
            Team.team.attendance = true;
            Team.save();
            res.status(200).json({"message": `Team "${Team.team.teamName}" is present`});
        }
    }
    catch(e){
        console.log(e);
        res.status(422).json({error: e});
    }
});

module.exports = router; 