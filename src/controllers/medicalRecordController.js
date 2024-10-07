const MedicalRecord = require("../models/MedicalRecord");
const Doctor = require("../models/staff/Doctor");
const Patient = require("../models/patient/Patient");
const Intern = require("../models/staff/Intern");
const upload = require("../middleware/uploadMiddleware"); // Import file upload middleware

// Add medical record to a patient
const addMedicalRecord = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: "File upload failed", error: err });
      }

      const { generatedBy, patient, examinedBy } = req.body;

      // Create a new medical record using the uploaded file path
      const newRecord = new MedicalRecord({
        photo: req.file.path, // Save the file path of the medical record photo
        generatedBy,
        patient,
        examinedBy,
      });

      // Save the medical record
      const savedRecord = await newRecord.save();

      // Push the record into Doctor/Intern's records
      const doctor = await Doctor.findById(generatedBy);
      if (doctor) {
        doctor.medicalRecords.push(savedRecord._id);
        await doctor.save();
      }

      const intern = await Intern.findById(examinedBy);
      if (intern) {
        intern.medicalRecords.push(savedRecord._id);
        await intern.save();
      }

      // Push the record into Patient's records
      const patientRecord = await Patient.findById(patient);
      if (patientRecord) {
        patientRecord.medicalRecords.push(savedRecord._id);
        await patientRecord.save();
      }

      res.status(201).json({
        message: "Medical record added successfully",
        data: savedRecord,
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add medical record", error });
  }
};

// Update medical record for a patient
const updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedRecord = await MedicalRecord.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedRecord) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    res.status(200).json({
      message: "Medical record updated successfully",
      data: updatedRecord,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update medical record", error });
  }
};

// View a specific medical record of a patient
const viewMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await MedicalRecord.findById(id);

    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    res.status(200).json({ data: record });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch medical record", error });
  }
};

// View all medical records of a specific patient
const viewAllMedicalRecordsOfPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const records = await MedicalRecord.find({ patient: patientId });

    if (records.length === 0) {
      return res.status(404).json({ message: "No medical records found for this patient" });
    }

    res.status(200).json({ data: records });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch medical records", error });
  }
};

// View all medical records of all patients
const viewAllMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find();

    if (records.length === 0) {
      return res.status(404).json({ message: "No medical records found" });
    }

    res.status(200).json({ data: records });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch medical records", error });
  }
};

module.exports = {
  addMedicalRecord,
  updateMedicalRecord,
  viewMedicalRecord,
  viewAllMedicalRecordsOfPatient,
  viewAllMedicalRecords,
};



// // controllers/medicalRecordController.js

// const MedicalRecord = require("../models/MedicalRecord"); // Import the MedicalRecord model
// const upload = require("../middlewares/uploadMiddleware"); // Import the file upload middleware

// // Controller function to handle medical record creation
// const uploadMedicalRecord = (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       return res.status(500).json({ message: "File upload failed", error: err });
//     }

//     // Create a new medical record using the uploaded file path
//     const newRecord = new MedicalRecord({
//       photo: req.file.path, // Save the file path
//       generatedBy: req.body.generatedBy,
//       patient: req.body.patient,
//       examinedBy: req.body.examinedBy,
//     });

//     newRecord
//       .save()
//       .then((result) => {
//         res.status(201).json({
//           message: "Medical record created successfully",
//           data: result,
//         });
//       })
//       .catch((err) => {
//         res.status(500).json({ message: "Failed to save record", error: err });
//       });
//   });
// };

// module.exports = {
//   uploadMedicalRecord,
// };
