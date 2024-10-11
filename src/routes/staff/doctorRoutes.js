const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../../middleware/authMiddleware');
const {
  registerDoctor,
  loginDoctor,
  viewDoctorProfile,
  viewAllDoctors,
  deleteDoctor,
  updateDoctorProfile,
} = require('../../controllers/staff/doctorCtrl');

// Doctor registration
router.post('/register', registerDoctor);

// Doctor login
router.post('/login', loginDoctor);

// View doctor profile by ID (protected route)
router.get('/:id', authMiddleware, roleMiddleware(['doctor', 'admin']), viewDoctorProfile);

// // View all doctors (protected route)
// router.get('/', authMiddleware, roleMiddleware(['admin']), viewAllDoctors);

// View all doctors (protected route)
router.get('/', viewAllDoctors);


// Update doctor profile by ID (protected route)
router.put('/:id', authMiddleware, roleMiddleware(['doctor', 'admin']), updateDoctorProfile);

// Delete doctor by ID (protected route)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteDoctor);

module.exports = router;




// const express = require('express');
// const router = express.Router();
// const { authMiddleware, roleMiddleware } = require('../../middleware/authMiddleware');
// const { uploadMedicalRecord } = require('../../controllers/doctor/doctorCtrl');

// // Only Doctors can upload medical records
// router.post('/upload-medical-record', authMiddleware, roleMiddleware(['Doctor']), uploadMedicalRecord);

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { authMiddleware, roleMiddleware } = require('../../middleware/authMiddleware');
// const { upload } = require('../../utils/upload'); // Multer upload configuration
// const { registerDoctor, updateDoctorInfo, viewDoctor, loginDoctor } = require('../../controllers/staff/doctorCtrl');

// // Doctor registration
// router.post('/register', registerDoctor);

// // Doctor login
// router.post('/login', loginDoctor);

// // Doctor info update with photo upload
// router.put('/:id/update', authMiddleware, roleMiddleware(['Doctor']), upload.single('profilePhoto'), updateDoctorInfo);

// // View doctor details
// router.get('/:id', authMiddleware, viewDoctor); // , roleMiddleware(['Doctor'])

// module.exports = router;
