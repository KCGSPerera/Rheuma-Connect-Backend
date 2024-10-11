const express = require("express");
const router = express.Router();
const {
  addPatientVitals,
  getPatientVitalsByDate,
  getRecentPatientVitals,
  updatePatientVitals,
  deletePatientVitals,
  getAllVitals,
} = require("../../controllers/patient/patientVitalsCtrl");

// Add patient vitals
router.post("/addVitals", addPatientVitals);

//get all
router.get("/getAllVitals/:patientId", getAllVitals);

// Get patient vitals by date
router.get("/getVitalsByDate", getPatientVitalsByDate);

// Get most recent patient vitals
router.get("/getRecentVitals/:patientId", getRecentPatientVitals);

// Update patient vitals
router.put("/updateVitals/:vitalsId", updatePatientVitals);

// Delete patient vitals
router.delete("/deleteVitals/:vitalsId", deletePatientVitals);

module.exports = router;
