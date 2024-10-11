// const jwt = require('jsonwebtoken');
// const Admin = require('../models/staff/Admin');
// const Doctor = require('../models/staff/Doctor');
// const Patient = require('../models/patient/Patient');

// // Authenticate based on role
// const authMiddleware = async (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await Admin.findById(decoded.id) || await Doctor.findById(decoded.id) || await Patient.findById(decoded.id);

//     if (!user) {
//       return res.status(401).json({ message: 'User not found' });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Unauthorized', error });
//   }
// };

// module.exports = { authMiddleware };



const jwt = require('jsonwebtoken');
const Admin = require('../models/staff/Admin');
const Doctor = require('../models/staff/Doctor');
const Patient = require('../models/patient/Patient');
const Intern = require('../models/staff/Intern');

// Authenticate based on role
const authMiddleware = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, no token' });
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the token's decoded ID (check Admin, Doctor, or Patient)
    let user = await Admin.findById(decoded.id) || await Doctor.findById(decoded.id) || await Patient.findById(decoded.id) || await Intern.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach the user to the request object
    req.user = user;
    req.role = user.role; // Assuming `role` is a field in the Admin, Doctor, and Patient models
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized, token failed', error });
  }
};

// Role-based access control (RBAC) middleware
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden, insufficient permissions' });
    }
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };

