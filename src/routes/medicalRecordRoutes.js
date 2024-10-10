const express = require("express");
const router = express.Router();
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");
const {
  addMedicalRecord,
  updateMedicalRecord,
  viewMedicalRecord,
  viewAllMedicalRecordsOfPatient,
  viewAllMedicalRecords,

  
  //Hansanie
  addRecord,
  getAllRecords,
  getRecordById,
} = require("../controllers/medicalRecordController");


//========= Hansanie =====================================

// router.post("/add-record", authMiddleware, roleMiddleware(['Doctor', 'Intern']), addRecord);
// router.post("/get-all-records", authMiddleware, roleMiddleware(['Doctor', 'Intern']), getAllRecords);
// router.post("/get-record", authMiddleware, roleMiddleware(['Doctor', 'Intern']), getRecordById);


router.post("/add-record", authMiddleware,  addRecord);
router.get("/get-all-records/:patientId", authMiddleware,  getAllRecords);
router.get("/get-record/:id", authMiddleware,  getRecordById);

//==============================================









// Route to add medical record (requires doctor or intern role)
router.post("/add", authMiddleware, roleMiddleware(['Doctor', 'Intern']), addMedicalRecord);

// Route to update a medical record by its ID (requires doctor or intern role)
router.put("/update/:id", authMiddleware, roleMiddleware(['Doctor', 'Intern']), updateMedicalRecord);

// Route to view a specific medical record by its ID
router.get("/view/:id", authMiddleware, viewMedicalRecord);

// Route to view all medical records of a specific patient
router.get("/patient/:patientId", authMiddleware, viewAllMedicalRecordsOfPatient);

// Route to view all medical records of all patients (admin access)
router.get("/all", authMiddleware, roleMiddleware(['Admin']), viewAllMedicalRecords);

module.exports = router;



// const express = require("express");
// const router = express.Router();
// const medicalRecordController = require("../controllers/medicalRecordController"); // Import the controller

// // Route to handle medical record upload
// router.post("/uploadMedicalRecord", medicalRecordController.uploadMedicalRecord);

// module.exports = router;
