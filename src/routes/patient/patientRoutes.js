const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../../middleware/authMiddleware');
const { upload } = require('../../utils/upload'); // Multer upload configuration
const { registerPatient, updatePatientInfo, viewPatient, loginPatient } = require('../../controllers/patient/patientCtrl');

// Patient registration
router.post('/register', registerPatient);

// Patient login
router.post('/login', loginPatient);

// Patient info update
// router.put('/:id/update', authMiddleware, roleMiddleware(['Patient']),updatePatientInfo);  // Route for without photo upload
router.put('/:id/update', authMiddleware, roleMiddleware(['Patient']), upload.single('profilePhoto'), updatePatientInfo);

// View patient details
router.get('/:id', authMiddleware,viewPatient);  // , roleMiddleware(['Patient'])

module.exports = router;
