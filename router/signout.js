const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");

//Admin signout route
router.post("/signout", auth, async (req,res) =>{
    try{
      localStorage.clear();
      res.status(422).json({message: "Signed out!"});
    }
    catch(e){
      res.status(422).json({error: e});
    }
    
});
  
module.exports = router;
