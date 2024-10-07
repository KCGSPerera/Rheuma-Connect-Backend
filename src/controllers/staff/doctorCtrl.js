const Doctor = require('../../models/staff/Doctor');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Generate unique Doctor ID
const generateDoctorId = async () => {
  const latestDoctor = await Doctor.findOne().sort({ createdAt: -1 });
  const newId = latestDoctor
    ? `D${(parseInt(latestDoctor.docId.slice(1)) + 1).toString().padStart(4, '0')}`
    : 'D0001';
  return newId;
};

// Register a new doctor
const registerDoctor = async (req, res) => {
  const { username, email, password, name, contact, nic } = req.body;

  try {
    // Check if doctor already exists
    const doctorExists = await Doctor.findOne({ email });
    if (doctorExists) {
      return res.status(400).json({ message: 'Doctor already exists' });
    }

    // Generate unique Doctor ID
    const docId = await generateDoctorId();

    // Create a new doctor
    const doctor = new Doctor({
      username,
      email,
      password,
      name,
      contact,
      nic,
      docId,
    });

    await doctor.save();

    res.status(201).json({
      _id: doctor._id,
      username: doctor.username,
      email: doctor.email,
      docId: doctor.docId,
      token: generateToken(doctor._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering doctor', error });
  }
};

// Login doctor
const loginDoctor = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find doctor by email
    const doctor = await Doctor.findOne({ email });

    if (doctor && (await doctor.matchPassword(password))) {
      res.json({
        _id: doctor._id,
        username: doctor.username,
        email: doctor.email,
        docId: doctor.docId,
        token: generateToken(doctor._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// View doctor profile by ID
const viewDoctorProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor details', error });
  }
};

// View all doctors
const viewAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error });
  }
};

// Delete doctor by ID
const deleteDoctor = async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doctor', error });
  }
};

// Update doctor profile by ID
const updateDoctorProfile = async (req, res) => {
  const { id } = req.params;
  const { username, email, name, contact, nic } = req.body;

  try {
    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { username, email, name, contact, nic },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({ message: 'Doctor profile updated successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Error updating doctor profile', error });
  }
};

module.exports = {
  registerDoctor,
  loginDoctor,
  viewDoctorProfile,
  viewAllDoctors,
  deleteDoctor,
  updateDoctorProfile,
};
