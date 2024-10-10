// const Patient = require('../../models/patient/Patient');

// // Function to register a patient
// const registerPatient = async (req, res) => {
//   try {
//     const { name, birthday, bloodType, contactNumber, allergies, rheumaticType } = req.body;

//     // Generate Medical ID
//     const latestPatient = await Patient.findOne().sort({ createdAt: -1 });
//     const newId = latestPatient ? `KRU${(parseInt(latestPatient.medicalId.slice(3)) + 1).toString().padStart(5, '0')}` : 'KRU00001';

//     const patient = new Patient({
//       name,
//       birthday,
//       medicalId: newId,
//       bloodType,
//       contactNumber,
//       allergies,
//       rheumaticType,
//       age: Math.floor((Date.now() - new Date(birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000)), // Calculate age
//       registered: false
//     });

//     await patient.save();
//     res.status(201).json({ message: 'Patient registered, awaiting admin approval', patient });
//   } catch (error) {
//     res.status(500).json({ message: 'Error registering patient', error });
//   }
// };

// // Function for patient to update personal info
// const updatePatientInfo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { profilePhoto, contactNumber, allergies, rheumaticType } = req.body;

//     const patient = await Patient.findByIdAndUpdate(id, { profilePhoto, contactNumber, allergies, rheumaticType }, { new: true });
//     if (!patient) {
//       return res.status(404).json({ message: 'Patient not found' });
//     }
//     res.status(200).json({ message: 'Patient info updated', patient });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating patient info', error });
//   }
// };

// // Function to view patient details
// const viewPatient = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const patient = await Patient.findById(id);
//     if (!patient) {
//       return res.status(404).json({ message: 'Patient not found' });
//     }
//     res.status(200).json({ patient });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching patient details', error });
//   }
// };

// module.exports = {
//   registerPatient,
//   updatePatientInfo,
//   viewPatient,
// };



const Patient = require('../../models/patient/Patient');
const jwt = require('jsonwebtoken');
const path = require('path');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register a new patient
const registerPatient = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await Patient.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Patient already exists' });
    }

    // Generate Medical ID
    const latestPatient = await Patient.findOne().sort({ createdAt: -1 });
    const newId = latestPatient
      ? `KRU${(parseInt(latestPatient.medicalId.slice(3)) + 1).toString().padStart(5, '0')}`
      : 'KRU00001';

    // Create a new patient
    const patient = new Patient({
      username,
      email,
      password,
      medicalId: newId,
      registered: true // Admin will accept the registration
    });

    await patient.save();

    res.status(201).json({
      _id: patient._id,
      username: patient.username,
      email: patient.email,
      token: generateToken(patient._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering patient', error });
  }
};

// Login patient
const loginPatient = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find patient by email
    const patient = await Patient.findOne({ email });

    if (patient && (await patient.matchPassword(password))) {
      res.json({
        _id: patient._id,
        username: patient.username,
        email: patient.email,
        token: generateToken(patient._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// // Without Profile Photo
// // Function for patient to update personal info
// const updatePatientInfo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { profilePhoto, name, birthday, bloodType, contactNumber, allergies, rheumaticType } = req.body;

//     // Calculate age if birthday is provided
//     const age = birthday ? Math.floor((Date.now() - new Date(birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : undefined;

//     const patient = await Patient.findByIdAndUpdate(id, {
//       profilePhoto,
//       name,
//       birthday,
//       age,
//       bloodType,
//       contactNumber,
//       allergies,
//       rheumaticType,
//     }, { new: true });

//     if (!patient) {
//       return res.status(404).json({ message: 'Patient not found' });
//     }
//     res.status(200).json({ message: 'Patient info updated', patient });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating patient info', error });
//   }
// };


// With Profile Photo
// Function for patient to update personal info
const updatePatientInfo = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, birthday, bloodType, contactNumber, allergies, rheumaticType } = req.body;
  
      // Calculate age if birthday is provided
      const age = birthday ? Math.floor((Date.now() - new Date(birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : undefined;
  
      // Handle profile photo upload if provided
      const profilePhoto = req.file ? `/uploads/${req.file.filename}` : undefined;
  
      const updateData = {
        name,
        birthday,
        age,
        bloodType,
        contactNumber,
        allergies,
        rheumaticType,
      };
  
      if (profilePhoto) {
        updateData.profilePhoto = profilePhoto;
      }
  
      const patient = await Patient.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      res.status(200).json({ message: 'Patient info updated', patient });
    } catch (error) {
      res.status(500).json({ message: 'Error updating patient info', error });
    }
  };

  

// // Function to view patient details
// const viewPatient = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const patient = await Patient.findById(id);
//     if (!patient) {
//       return res.status(404).json({ message: 'Patient not found' });
//     }
//     res.status(200).json({ patient });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching patient details', error });
//   }
// };

// view single patient with formatted birthday
// view single patient with formatted birthday and createdAt
const viewPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Format the birthday and createdAt to remove the time part (YYYY-MM-DD)
    const formattedPatient = {
      ...patient._doc, // Spread the patient document
      birthday: patient.birthday ? patient.birthday.toISOString().split('T')[0] : null, // Format birthday
      createdAt: patient.createdAt ? patient.createdAt.toISOString().split('T')[0] : null, // Format createdAt
    };

    res.status(200).json({ patient: formattedPatient });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient details', error });
  }
};


// Function to get all patients
const getAllPatients = async (req, res) => {
  try {
    // Fetch all patients from the database
    const patients = await Patient.find();

    // Format the birthday and createdAt for each patient
    const formattedPatients = patients.map((patient) => ({
      ...patient._doc, // Spread the patient document
      birthday: patient.birthday ? patient.birthday.toISOString().split('T')[0] : null, // Format birthday
      createdAt: patient.createdAt ? patient.createdAt.toISOString().split('T')[0] : null, // Format createdAt
    }));

    res.status(200).json({ patients: formattedPatients });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error });
  }
};


module.exports = {
  registerPatient,
  loginPatient,
  updatePatientInfo,
  viewPatient,
  getAllPatients,
};

