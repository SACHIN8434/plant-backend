import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

//API for adding doctor
const addDoctor = async (req, res) => {
  try {
    //fetching data from request object
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    //fetching image from request object form
    const imageFile = req.file;

    //checking for all data to doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    //validating email formate using validator package
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    //validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    //hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //upload the doctor image to the cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    //creating data fromat for database
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };
    // console.log(doctorData);

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    res.json({
      success: true,
      message: "Doctor added successfully",
    });
  } catch (err) {
    console.log("Error occurred whilte creating new doctor", err);
    return res.json({
      success: false,
      message: err.message,
    });
  }
};

//API For the admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASS
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      return res.json({
        success: true,
        token,
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (e) {
    console.log("Error occurred Admin Login", e);
    return res.json({
      success: false,
      message: "Error occurred Admin Login",
    });
  }
};

//API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
  try {
    //it will remove password property from doctor object
    const doctors = await doctorModel.find({}).select("-password");

    return res.json({
      success: true,
      doctors,
    });
  } catch (err) {
    console.log("Error occurred whilte creating new doctor", err);
    return res.json({
      success: false,
      message: err.message,
    });
  }
};

//API to get all appointment
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    return res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.log("Error occurred whilte creating new doctor", err);
    return res.json({
      success: false,
      message: err.message,
    });
  }
};

//API for appointment cancellation
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    //remove slotDate and time from doctorModel
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter((e) => {
      e != slotTime;
    });

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({
      success: true,
      message: "Appointment Cancelled",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {

    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
        //we are just sending number of doctors not the details
        doctors:doctors.length,
        appointments:appointments.length,
        //total number of users
        patients:users.length,
        //5 latest appointment
        latestAppointments:appointments.reverse().slice(0,5),
    }

    return res.json({
        success:true,
        dashData,
    })
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
};
