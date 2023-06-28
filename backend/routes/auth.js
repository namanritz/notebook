const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchUser = require('../middleware/fetchUser');


const JWT_SECRET = "Naman";


//Route:1 - create a user using post"/api/auth/createuser"
router.post(
  "/createuser",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //if errors return bad req. and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //check if user exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry, a user with same email exists" });
      }

      //generate salt
      const salt = await bcrypt.genSalt(10);

      //store hash of the password in a variable
      const secPass = await bcrypt.hash(req.body.password, salt);

      //Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      // .then(user => res.json(user))
      // .catch(err=> {console.log(err)
      //     res.json({error:'Enter unique mail'})
      // })

      const data = {
        user: {
          id: user.id,
        },
      };
      //create a token signature
      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

// Route:2 - authenticate a user using post"/api/auth/login"
router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  async (req, res) => {
    //if errors return bad req. and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //take email and password from request and check if they match with some enrty in database
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ error: "Wrong Credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        res.status(400).json({ error: "Wrong Credentials" });
      }

      //create an object with the user's id
      const data = {
        user: {
          id: user.id,
        },
      };

      //create a jwt token and send it as the respsonse
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//Route:3 - Get logged in user details using post"/api/auth/getuser". Login required

router.post("/getuser",fetchUser, async (req, res) => {
  try {
    userID = req.user.id;
    const user = await User.findById(userID).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
});

module.exports = router;
