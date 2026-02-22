import express from "express";
import {
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
} from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";
const doctorRouter = express.Router();

//to get all the doctors for home page
doctorRouter.get("/list", doctorList);
//to login the doctor from doctor panel
doctorRouter.post("/login", loginDoctor);
//to get all the appointments data of a doctor for doctorsAppointment page
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
//route for mark the appointment complete from doctorappointment page or doctorDashboard page
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);
//route for mark the appointment cancel from doctorappointment page or doctorDashboard page
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
//geeting the dashboard data like earning of a perticular doctor
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
//route to gt the profile data of a perticular doctor
doctorRouter.get('/profile',authDoctor,doctorProfile);
//route to update the profile of a perticular doctor
doctorRouter.post('/update-profile',authDoctor,updateDoctorProfile);

export default doctorRouter;
