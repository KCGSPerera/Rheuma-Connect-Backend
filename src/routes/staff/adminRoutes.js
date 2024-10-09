const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../../middleware/authMiddleware');
const {
  registerAdmin,
  loginAdmin,
  viewOneAdmin,
  viewAdminProfile,
  getAllAdmins, // Add this route
  updateAdmin,
  updateProfile,
  deleteAdmin,
} = require('../../controllers/staff/adminCtrl');

// Admin registration (no authentication required for registration)
router.post('/register', registerAdmin);

// Admin login
router.post('/login', loginAdmin);

// Get all admins (protected route, role-based access)
router.get('/all', authMiddleware, roleMiddleware(['admin']), getAllAdmins);

// View specific admin details by id (protected route, role-based access)
router.get('/:id', authMiddleware, roleMiddleware(['admin']), viewOneAdmin);

// View logged-in admin's profile (protected route)
router.get('/profile/me', authMiddleware, roleMiddleware(['admin']), viewAdminProfile);

// Update specific admin's details by id (protected route, role-based access)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateAdmin);

// Update logged-in admin's profile (protected route)
router.put('/profile/me', authMiddleware, roleMiddleware(['admin']), updateProfile);

// Delete admin by id (protected route, role-based access)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteAdmin);

module.exports = router;





// const express = require('express');
// const router = express.Router();
// const { authMiddleware, roleMiddleware } = require('../../middleware/authMiddleware');
// const { manageUsers } = require('../../controllers/admin/adminCtrl');

// // Only Admins can access this route
// router.post('/manage-users', authMiddleware, roleMiddleware(['Admin']), manageUsers);

// module.exports = router;
