import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

//only admin can change the availability of a doctor
const changeAvailability = async (req, res) => {
  try {
    //update the avalilable status of doctor in the database
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    return res.json({
      success: true,
      message: "Availability Changed",
    });
  } catch (err) {
    console.log("Error occurred ", err);
    res.json({
      success: false,
      message: err.message,
    });
  }
};

//for home page doctors we fetch the doctorlist
const doctorList = async (req, res) => {
  try {
    //we will get all the doctors by excluding password and email
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    return res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//API for doctor Login
//we use email id and password to authenticate the doctor
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    //find the doctor with the help of doctor email id
    const doctor = await doctorModel.findOne({ email });

    //if we don't found the doctor with this email id
    if (!doctor) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    //if we found the doctor then we match the password and the user password
    const isMatch = await bcrypt.compare(password, doctor.password);

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      return res.json({
        success: true,
        token,
      });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;

    //with the help of this docId we find the appointsment of doctor
    const appointments = await appointmentModel.find({ docId });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to mark appointment completed for doctor panel (doctor panel appointments.js functionlity)
const appointmentComplete = async (req, res) => {
  try {
    //we will get docId from authDoctor using authDoctor middleware
    const { docId, appointmentId } = req.body;

    //finding appointment
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({
        success: true,
        message: "appointment completed",
      });
    } else {
      return res.json({
        success: false,
        message: "Mark faild",
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to cancel the appointment for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    //we will get docId from authDoctor using authDoctor middleware
    const { docId, appointmentId } = req.body;

    //finding appointment
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({
        success: true,
        message: "appointment Cancelled",
      });
    } else {
      return res.json({
        success: false,
        message: "Cancellation failed",
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;

    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];
    //getting the total number of unique patient in patients array
    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    //if doctor have more than 5 appointments we get 5 latest appointmetn
    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    return res.json({
      success: true,
      dashData,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const profileData = await doctorModel.findById(docId).select("-password");
    res.json({
      success: true,
      profileData,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//API to update doctor profile data from doctor panel
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;
    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });
    return res.json({
      success: true,
      message: "Profile updated",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  updateDoctorProfile,
  doctorProfile
};
