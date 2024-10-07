const Intern = require('../../models/staff/Intern');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Generate unique Intern ID
const generateInternId = async () => {
  const latestIntern = await Intern.findOne().sort({ createdAt: -1 });
  const newId = latestIntern
    ? `I${(parseInt(latestIntern.internId.slice(1)) + 1).toString().padStart(4, '0')}`
    : 'I0001';
  return newId;
};

// Register a new intern
const registerIntern = async (req, res) => {
  const { username, email, password, name, contact, nic } = req.body;

  try {
    // Check if intern already exists
    const internExists = await Intern.findOne({ email });
    if (internExists) {
      return res.status(400).json({ message: 'Intern already exists' });
    }

    // Generate unique Intern ID
    const internId = await generateInternId();

    // Create a new intern
    const intern = new Intern({
      username,
      email,
      password,
      name,
      contact,
      nic,
      internId,
    });

    await intern.save();

    res.status(201).json({
      _id: intern._id,
      username: intern.username,
      email: intern.email,
      internId: intern.internId,
      token: generateToken(intern._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering intern', error });
  }
};

// Login intern
const loginIntern = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find intern by email
    const intern = await Intern.findOne({ email });

    if (intern && (await intern.matchPassword(password))) {
      res.json({
        _id: intern._id,
        username: intern.username,
        email: intern.email,
        internId: intern.internId,
        token: generateToken(intern._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// View intern profile by ID
const viewInternProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const intern = await Intern.findById(id);
    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }
    res.status(200).json(intern);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching intern details', error });
  }
};

// View all interns
const viewAllInterns = async (req, res) => {
  try {
    const interns = await Intern.find();
    res.status(200).json(interns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interns', error });
  }
};

// Delete intern by ID
const deleteIntern = async (req, res) => {
  const { id } = req.params;

  try {
    const intern = await Intern.findByIdAndDelete(id);
    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }
    res.status(200).json({ message: 'Intern deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting intern', error });
  }
};

// Update intern profile by ID
const updateInternProfile = async (req, res) => {
  const { id } = req.params;
  const { username, email, name, contact, nic } = req.body;

  try {
    const intern = await Intern.findByIdAndUpdate(
      id,
      { username, email, name, contact, nic },
      { new: true }
    );

    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    res.status(200).json({ message: 'Intern profile updated successfully', intern });
  } catch (error) {
    res.status(500).json({ message: 'Error updating intern profile', error });
  }
};

module.exports = {
  registerIntern,
  loginIntern,
  viewInternProfile,
  viewAllInterns,
  deleteIntern,
  updateInternProfile,
};
