const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//register
router.post("/register", async (req, res) => {
  const { name, lastname, email, password } = req.body;
  try {
    const newuser = new User({ name, lastname, email, password });
    
    //checkin if email exsits
    const checkin = router.findone({ email });
    if (checkin) {
      res.status(400).send({ msg: "email exist" });
    }
    console.log(newuser);
    //cryptin passwords bad with bcrypt
    const salt = 10;
    const gensalt = await bcrypt.genSalt(salt);
    const cryptedpw = await bcrypt.hash(password, gensalt);
    console.log(cryptedpw);
    newuser.password = cryptedpw;
    
    //creatin token
    const newusertoken=await newuser.save()
console.log(newusertoken)
    const payload2 = {
      _id: newusertoken._id,
      name: newusertoken.name,
    };
    const token1 = await jwt.sign(payload2, process.env.pwd, {
      expiresIn: 3600,
    });

    await newuser.save();
    res.status(200).send({ newuser, msg: "user added succefully", token1 });
  } catch (error) {
    res.status(500).send("user not saved");
  }
});
// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    //checkin if the email exsits
    const chekinemail = await User.findOne({ email });
    if (!chekinemail) {
      res.status(400).send({ msg: "bqd credentials" });
    }
    //chekin passwords
    const chekinpass = await bcrypt.compare(password, chekinemail.password);
    if (!chekinpass) {
      res.status(400).send({ msg: "bqd credentials" });
    }
    // creating token
    const payload = {
      _id: chekinemail._id,
    };
    const token = jwt.sign(payload, process.env.pwd, { expiresIn: 3600 });
    res.status(200).send({ msg: "welcome", token });
  } catch (error) {
    res.status(500).send("user not found");
  }
});
module.exports = router;
