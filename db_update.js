const mongoose = require("mongoose");
const Registration = require("./models/RegistrationSchema")
const DB_URI = process.env.TEST_DB_URI;

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    
    // add fields
    const res = await Registration.updateMany({}, { $set: { "team.room": "" } })
    
    // delete fields
    // const res = await Registration.updateMany({}, { $unset: { "team.rooms": 1 }})

    console.log(`[+] MongoDB is connected!\n`, res);
  })
  .catch((e) => {
    console.log(`[x] Connection failed! ${e}`);
  });
