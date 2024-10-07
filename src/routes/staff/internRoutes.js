const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../../middleware/authMiddleware');
const {
  registerIntern,
  loginIntern,
  viewInternProfile,
  viewAllInterns,
  deleteIntern,
  updateInternProfile,
} = require('../../controllers/staff/internCtrl');

// Intern registration
router.post('/register', registerIntern);

// Intern login
router.post('/login', loginIntern);

// View intern profile by ID (protected route)
router.get('/:id', authMiddleware, roleMiddleware(['intern', 'admin']), viewInternProfile);

// View all interns (protected route)
router.get('/', authMiddleware, roleMiddleware(['admin']), viewAllInterns);

// Update intern profile by ID (protected route)
router.put('/:id', authMiddleware, roleMiddleware(['intern', 'admin']), updateInternProfile);

// Delete intern by ID (protected route)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteIntern);

module.exports = router;
