const express = require('express');
const {
  updateVendorProfile,
  getVendorProfile,
  getAllVendors,
  approveVendor,
  getArtisans,
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/artisans', getArtisans); // ✅ public — used by ArtisansPage

// Vendor profile routes
router.put('/vendor-profile', protect, authorize('vendor'), updateVendorProfile);
router.get('/vendor-profile', protect, authorize('vendor'), getVendorProfile);

// Admin routes
router.get('/vendors', protect, authorize('admin'), getAllVendors);
router.put('/vendors/:id/approve', protect, authorize('admin'), approveVendor);

module.exports = router;
