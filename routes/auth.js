import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

/* User Registration */
router.post("/register", async (req, res) => {
  try {
    /* Salting and Hashing the Password */
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    /* Create a new user */
    const newuser = await new User({
      userType: req.body.userType,
      userFullName: req.body.userFullName,
      admissionId: req.body.admissionId,
      employeeId: req.body.employeeId,
      age: req.body.age,
      dob: req.body.dob,
      gender: req.body.gender,
      address: req.body.address,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email,
      password: hashedPass,
      isAdmin: req.body.isAdmin,
    });

    /* Save User and Return */
    const user = await newuser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

/* User Login */
router.post("/signin", async (req, res) => {
  try {
    console.log(req.body, "req");

    // Find user based on either admissionId or employeeId
    const user = req.body.admissionId
      ? await User.findOne({ admissionId: req.body.admissionId })
      : req.body.employeeId
      ? await User.findOne({ employeeId: req.body.employeeId })
      : null;

    if (!user) {
      return res.status(404).json("User not found");
    }

    // Compare passwords directly (assuming passwords are stored in plain text)
    if (req.body.password !== user.password) {
      return res.status(400).json("Wrong Password");
    }

    // Return user data if successful
    res.status(200).json(user);
  } catch (err) {
    console.error(err); // Changed from console.log to console.error for errors
    res.status(500).json("Internal Server Error"); // Return a 500 status code for unexpected errors
  }
});

export default router;
