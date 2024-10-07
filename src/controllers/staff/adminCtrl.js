const Admin = require('../../models/staff/Admin');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register a new admin
const registerAdmin = async (req, res) => {
  const { username, email, password, name, contact, nic } = req.body;

  try {
    // Check if the admin already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create a new admin
    const admin = new Admin({
      username,
      email,
      password,
      name,
      contact,
      nic,
      role: 'admin',  // Default role for admin
    });

    await admin.save();

    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin', error });
  }
};

// Login admin
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// View details of a specific admin by id
const viewOneAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin details', error });
  }
};

// View logged-in admin's profile
const viewAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin profile', error });
  }
};

// Update a specific admin's details by id
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, name, contact, nic } = req.body;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { username, email, name, contact, nic },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin updated', updatedAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Error updating admin', error });
  }
};

// Update logged-in admin's profile
const updateProfile = async (req, res) => {
  try {
    const { username, email, name, contact, nic } = req.body;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.user._id,
      { username, email, name, contact, nic },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Profile updated', updatedAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

// Delete an admin by id
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByIdAndDelete(id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin', error });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  viewOneAdmin,
  viewAdminProfile,
  updateAdmin,
  updateProfile,
  deleteAdmin,
};








// const Admin = require('../../models/staff/Admin');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // Register a new admin
// const registerAdmin = async (req, res) => {
//   const { email, username, password, name, contact, nic } = req.body;

//   try {
//     // Check if admin already exists
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return res.status(400).json({ message: "Admin already exists" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create new admin
//     const newAdmin = new Admin({
//       email,
//       username,
//       password: hashedPassword,
//       name,
//       contact,
//       nic,
//     });

//     await newAdmin.save();

//     res.status(201).json({ message: "Admin registered successfully", data: newAdmin });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to register admin", error });
//   }
// };

// // Admin login
// const loginAdmin = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return res.status(400).json({ message: "Admin not found" });
//     }

//     // Check if password matches
//     const isPasswordValid = await bcrypt.compare(password, admin.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.status(200).json({ token, adminId: admin._id });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to login", error });
//   }
// };

// // View admin by ID (passed via params)
// const viewOneAdmin = async (req, res) => {
//   try {
//     const admin = await Admin.findById(req.params.id);
//     if (!admin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }
//     res.status(200).json(admin);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching admin", error });
//   }
// };

// // View logged-in admin profile
// const viewAdminProfile = async (req, res) => {
//   try {
//     const admin = await Admin.findById(req.user._id);
//     if (!admin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }
//     res.status(200).json(admin);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching admin profile", error });
//   }
// };

// // Delete an admin by ID
// const deleteAdmin = async (req, res) => {
//   try {
//     const admin = await Admin.findByIdAndDelete(req.params.id);
//     if (!admin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }
//     res.status(200).json({ message: "Admin deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting admin", error });
//   }
// };

// // Update an admin by ID (passed via params)
// const updateAdmin = async (req, res) => {
//   const { name, contact, nic } = req.body;

//   try {
//     const admin = await Admin.findByIdAndUpdate(
//       req.params.id,
//       { name, contact, nic },
//       { new: true }
//     );

//     if (!admin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     res.status(200).json({ message: "Admin updated successfully", data: admin });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating admin", error });
//   }
// };

// // Update the logged-in admin's profile
// const updateProfile = async (req, res) => {
//   const { name, contact, nic } = req.body;

//   try {
//     const admin = await Admin.findByIdAndUpdate(
//       req.user._id,
//       { name, contact, nic },
//       { new: true }
//     );

//     if (!admin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     res.status(200).json({ message: "Profile updated successfully", data: admin });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating profile", error });
//   }
// };

// module.exports = {
//   registerAdmin,
//   loginAdmin,
//   viewOneAdmin,
//   viewAdminProfile,
//   deleteAdmin,
//   updateAdmin,
//   updateProfile,
// };
