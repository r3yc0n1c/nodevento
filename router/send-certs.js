const express = require("express");
const path = require("path");
const router = express.Router();
const { generateCert } = require("../utils/certGen");
const { sendCertMail } = require("../utils/mailer");

// Auth route middleware
const auth = require("../utils/auth");

// Load model
const Registration = require("../models/RegistrationSchema");

const SLOTS = [
  "Slot1-8CSE1.png",
  "Slot1-8CSE2.png",
  "Slot1-8IT.png",
  "Slot2-8CSE1.png",
  "Slot2-8CSE2.png",
  "Slot2-8IT.png",
];

// Ticket Generation route
router.post("/sendtickets", async (req, res) => {
  const Teams = await Registration.find({"team.emailSent": false});

  n = Teams.length;

  for (var i = 0; i < n; i++) {
    // console.log("idm", Teams[i]._id);

    key = i % SLOTS.length;
    slot_room = SLOTS[key]
    bgImg = path.join(__dirname, "..", "assets", slot_room);

    var ticketData = {
      TICKET_ID: Teams[i]._id.toString(),
      TEAM_NAME: Teams[i].team.teamName,
      BG_URL: bgImg
    };

    // PDF ticket gen
    let resp = await generatePDFTicket(ticketData);
    if (!resp) res.status(422).json({ message: "pdf error" });

    //send tickets
    const leader = Teams[i].members.find((member) => member.role === "leader");
    ticketData.TEAM_EMAIL = leader.email;
    let ressp = await sendEventMail(ticketData);
    if (!ressp) {
      res.status(422).json({ message: "Ticket error" });
    } else {
      Teams[i].team.emailSent = true;
      Teams[i].team.slot =  key <= 2 ? "Slot 1" : "Slot 2";
      Teams[i].team.room = slot_room.split('-')[1].split('.')[0]
      await Teams[i].save();

      console.log(`[+] Ticket sent for team: ${ticketData.TEAM_NAME} | ${Teams[i].team.slot} | ${Teams[i].team.room}`);
    }
  }

  res.status(200).json({ message: "done" });
});

module.exports = router;
