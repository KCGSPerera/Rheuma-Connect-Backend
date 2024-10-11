const PatientVitals = require("../../models/patient/PatientVitals");
const Patient = require("../../models/patient/Patient");
const Intern = require("../../models/staff/Intern");
const Doctor = require("../../models/staff/Doctor");

// Add Patient Vitals - doctors
const addPatientVitals = async (req, res) => {
  try {
    const { patient, weight, temperature, bloodPressure, heartRate, respiratoryRate, oxygenLevel, examinedBy } = req.body;

    // Create new vitals record
    const newVitals = new PatientVitals({
      patient,
      weight,
      temperature,
      bloodPressure,
      heartRate,
      respiratoryRate,
      oxygenLevel,
      examinedBy,
      examinerType: 'Doctor',
      date: new Date(),
      time: new Date().toLocaleTimeString(),
    });

    const savedVitals = await newVitals.save();

    // Push the vitals reference to the patient
    const patientData = await Patient.findById(patient);
    if (!patientData) {
      return res.status(404).json({ message: "Patient not found" });
    }
    patientData.patientVitals.push(savedVitals._id);
    await patientData.save();

    // Push the vitals reference to the intern who added the vitals
    // const internData = await Intern.findById(examinedBy);
    // if (internData) {
    //   // return res.status(404).json({ message: "Intern not found" });
    //   internData.patientVitals.push(savedVitals._id);
    // await internData.save();
    
    
    // }

    // const doctorData = await Doctor.findById(examinedBy);
    // if (doctorData) {
    //   // return res.status(404).json({ message: "Intern not found" });
    //   doctorData.patientVitals.push(savedVitals._id);
    // await doctorData.save();
    
    
    // }
    res.status(201).json({ message: "Patient vitals added successfully", vitals: savedVitals });
    // internData.patientVitals.push(savedVitals._id);
    // await internData.save();

    // res.status(201).json({ message: "Patient vitals added successfully", vitals: savedVitals });
  } catch (error) {
    res.status(500).json({ message: "Error adding patient vitals", error });
  }
};

// Intern add vitals
const internAddPatientVitals = async (req, res) => {
  try {
    const { patient, weight, temperature, bloodPressure, heartRate, respiratoryRate, oxygenLevel, examinedBy } = req.body;

    // Create new vitals record
    const newVitals = new PatientVitals({
      patient,
      weight,
      temperature,
      bloodPressure,
      heartRate,
      respiratoryRate,
      oxygenLevel,
      examinedBy,
      examinerType: 'Intern',
      date: new Date(),
      time: new Date().toLocaleTimeString(),
    });

    const savedVitals = await newVitals.save();

    // Push the vitals reference to the patient
    const patientData = await Patient.findById(patient);
    if (!patientData) {
      return res.status(404).json({ message: "Patient not found" });
    }
    patientData.patientVitals.push(savedVitals._id);
    await patientData.save();

    // Push the vitals reference to the intern who added the vitals
    const internData = await Intern.findById(examinedBy);
    if (internData) {
      // return res.status(404).json({ message: "Intern not found" });
      internData.patientVitals.push(savedVitals._id);
    await internData.save();
    
    
    }

    const doctorData = await Doctor.findById(examinedBy);
    if (doctorData) {
      // return res.status(404).json({ message: "Intern not found" });
      doctorData.patientVitals.push(savedVitals._id);
    await doctorData.save();
    
    
    }
    res.status(201).json({ message: "Patient vitals added successfully", vitals: savedVitals });
    // internData.patientVitals.push(savedVitals._id);
    // await internData.save();

    // res.status(201).json({ message: "Patient vitals added successfully", vitals: savedVitals });
  } catch (error) {
    res.status(500).json({ message: "Error adding patient vitals", error });
  }
};
//get all
const getAllVitals = async (req, res) => {
  const { patientId } = req.params; // Extract patientId from the request parameters

  try {
    const records = await PatientVitals.find({ patient: patientId }) // Filter by patient ID
      .populate('examinedBy', 'name'); // Optional: Populate doctor name
      
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving vitals', error });
  }
};

// get all
// const getAllVitals = async (req, res) => {
//   const { patientId } = req.params;

//   try {
//     const records = await PatientVitals.find({ patient: patientId }) // Filter by patient ID
//       .populate({
//         path: 'examinedBy',
//         select: 'name', // Replace 'name' with the appropriate field
//         model: function(doc) {
//           return doc.examinerType;
//         }
//       });
    
//     if (!records) {
//       return res.status(404).json({ message: 'No vitals found for this patient' });
//     }

//     res.status(200).json(records);
//   } catch (error) {
//     console.error('Error retrieving vitals:', error); // Log full error to console
//     res.status(500).json({ message: 'Error retrieving vitals', error: error.message || error });
//   }
// };



// Get Patient Vitals by Date
const getPatientVitalsByDate = async (req, res) => {
  try {
    const { patientId, date } = req.query;

    const vitals = await PatientVitals.find({
      patient: patientId,
      date: new Date(date),
    });

    if (!vitals || vitals.length === 0) {
      return res.status(404).json({ message: "No vitals found for this date" });
    }

    res.status(200).json({ vitals });
  } catch (error) {
    res.status(500).json({ message: "Error fetching patient vitals", error });
  }
};

// Get Most Recent Patient Vitals
const getRecentPatientVitals = async (req, res) => {
  try {
    const { patientId } = req.params;

    const recentVitals = await PatientVitals.findOne({ patient: patientId }).sort({ date: -1, time: -1 });

    if (!recentVitals) {
      return res.status(404).json({ message: "No recent vitals found" });
    }

    res.status(200).json({ vitals: recentVitals });
  } catch (error) {
    res.status(500).json({ message: "Error fetching recent patient vitals", error });
  }
};

// Update Patient Vitals
const updatePatientVitals = async (req, res) => {
  try {
    const { vitalsId } = req.params;
    const { weight, temperature, bloodPressure, heartRate, respiratoryRate, oxygenLevel } = req.body;

    const updatedVitals = await PatientVitals.findByIdAndUpdate(
      vitalsId,
      { weight, temperature, bloodPressure, heartRate, respiratoryRate, oxygenLevel },
      { new: true }
    );

    if (!updatedVitals) {
      return res.status(404).json({ message: "Vitals not found" });
    }

    res.status(200).json({ message: "Patient vitals updated successfully", vitals: updatedVitals });
  } catch (error) {
    res.status(500).json({ message: "Error updating patient vitals", error });
  }
};

// Delete Patient Vitals
const deletePatientVitals = async (req, res) => {
  try {
    const { vitalsId } = req.params;

    const deletedVitals = await PatientVitals.findByIdAndDelete(vitalsId);

    if (!deletedVitals) {
      return res.status(404).json({ message: "Vitals not found" });
    }

    res.status(200).json({ message: "Patient vitals deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting patient vitals", error });
  }
};

module.exports = {
  addPatientVitals,
  getPatientVitalsByDate,
  getRecentPatientVitals,
  updatePatientVitals,
  deletePatientVitals,
  getAllVitals,
  internAddPatientVitals
};
