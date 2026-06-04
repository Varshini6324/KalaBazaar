const User = require('../models/User');

// @desc    Update vendor profile
// @route   PUT /api/users/vendor-profile
// @access  Private (Vendor only)
exports.updateVendorProfile = async (req, res) => {
  try {
    const { storeName, description, address, craftType, logoUrl } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.vendorDetails = {
      storeName: storeName || user.vendorDetails.storeName,
      description: description || user.vendorDetails.description,
      address: address || user.vendorDetails.address,
      craftType: craftType || user.vendorDetails.craftType,
      logoUrl: logoUrl || user.vendorDetails.logoUrl,
    };

    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get vendor profile
// @route   GET /api/users/vendor-profile
// @access  Private (Vendor only)
exports.getVendorProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user.vendorDetails, isVendorVerified: user.isVendorVerified });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all verified artisans (public)
// @route   GET /api/users/artisans
// @access  Public
exports.getArtisans = async (req, res) => {
  try {
    const artisans = await User.find({ role: 'vendor', isVendorVerified: true }).select(
      'name vendorDetails isVendorVerified createdAt'
    );
    res.status(200).json({ success: true, count: artisans.length, data: artisans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all vendors
// @route   GET /api/users/vendors
// @access  Private (Admin only)
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor' }).select('-password');
    res.status(200).json({ success: true, count: vendors.length, data: vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve/Verify a vendor
// @route   PUT /api/users/vendors/:id/approve
// @access  Private (Admin only)
exports.approveVendor = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    if (user.role !== 'vendor') {
      return res.status(400).json({ success: false, message: 'User is not a vendor' });
    }

    user.isVendorVerified = true;
    await user.save();

    res.status(200).json({ success: true, message: 'Vendor approved successfully', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check email uniqueness if email is changing
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email is already in use' });
      }
      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    if (password) {
      user.password = password;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};