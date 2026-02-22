import express from 'express';
const adminRouter = express.Router();
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';

import { addDoctor, allDoctors, loginAdmin, appointmentsAdmin,appointmentCancel,adminDashboard } from '../controllers/adminController.js';
import { changeAvailability } from '../controllers/doctorController.js';


//authAdmin is the middleware the test the admin authorization
adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor);
adminRouter.post('/login',loginAdmin);
adminRouter.post('/all-doctors',authAdmin,allDoctors);
adminRouter.post('/change-availability',authAdmin,changeAvailability);
adminRouter.get('/appointments',authAdmin,appointmentsAdmin);
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel);
adminRouter.get('/dashboard',authAdmin,adminDashboard);

export default adminRouter;
