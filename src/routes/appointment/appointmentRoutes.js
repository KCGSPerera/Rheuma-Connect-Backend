const express = require("express");
const router = express.Router();
const { authMiddleware, roleMiddleware } = require("../../middleware/authMiddleware");
const {
  addAppointment,
  updateAppointmentStatus,
  rescheduleAppointment,
  cancelAppointment,
  getAppointmentForPatient,
  getAppointmentById,
  getAppointmentsByDate,
  getScheduledAppointments,
  getCompletedAppointments,
  getCancelledAppointments,
  getRescheduledAppointments,
  getScheduledAppointmentsForToday,
  getRescheduledAppointmentsForToday,
  getAllScheduledAndRescheduledForToday,
  getPatientLastAppointment,
  addAppointmentAndCompleteLastAppointment,
  getLastAppointmentByPatientId,
  getLastScheduledAppointmentByPatientId,
  getAppointmentsForTodayWithScheduledStatus,
  getPatientsForTodayAppointmentWithScheduledStatus,
} = require("../../controllers/appointment/appointmentCtrl");

// Add new appointment (Doctor creates an appointment for a patient)
router.post("/add-appointment", authMiddleware, roleMiddleware(["doctor"]), addAppointment);

// Update appointment status
router.put("/updateStatus", authMiddleware, roleMiddleware(["doctor"]), updateAppointmentStatus);

// Reschedule appointment
router.put("/reschedule", authMiddleware, roleMiddleware(["doctor"]), rescheduleAppointment);

// Cancel appointment
router.put("/cancel", authMiddleware, roleMiddleware(["doctor"]), cancelAppointment);

// Get one appointment for a patient
router.get("/patient/:patientId", authMiddleware, getAppointmentForPatient);

// Get one appointment by ID
router.get("/:id", authMiddleware, getAppointmentById);

// Get all appointments for a particular date
router.get("/date", authMiddleware, getAppointmentsByDate);

// Get all Scheduled appointments
router.get("/scheduled", authMiddleware, getScheduledAppointments);

// Get all Completed appointments
router.get("/completed", authMiddleware, getCompletedAppointments);

// Get all Cancelled appointments
router.get("/cancelled", authMiddleware, getCancelledAppointments);

// Get all Rescheduled appointments
router.get("/rescheduled", authMiddleware, getRescheduledAppointments);

// Get all Scheduled appointments for the current day
router.get("/scheduled/today", authMiddleware, getScheduledAppointmentsForToday);

// Get all Rescheduled appointments for the current day
router.get("/rescheduled/today", authMiddleware, getRescheduledAppointmentsForToday);

// Get all Scheduled and Rescheduled appointments for the current day
router.get("/today", authMiddleware, getAllScheduledAndRescheduledForToday);

// Get the patient's last appointment
router.get("/patient/:patientId/last-appointment", authMiddleware, getPatientLastAppointment);


//Hansanie
router.post("/add", authMiddleware, roleMiddleware(["doctor"]), addAppointmentAndCompleteLastAppointment);
router.get("/get-last/:patientId", authMiddleware, getLastAppointmentByPatientId);
router.get("/get-last-scheduled/:patientId", authMiddleware, getLastScheduledAppointmentByPatientId);
router.get("/get-all-today", authMiddleware, getAppointmentsForTodayWithScheduledStatus);
router.get("/get-all-today/patients", authMiddleware, getPatientsForTodayAppointmentWithScheduledStatus);


module.exports = router;
