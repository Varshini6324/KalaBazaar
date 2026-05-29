const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Include other resource routers
const reviewRouter = require('./reviewRoutes');

const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// Re-route into other resource routers
router.use('/:productId/reviews', reviewRouter);

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('vendor'), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('vendor', 'admin'), updateProduct)
  .delete(protect, authorize('vendor', 'admin'), deleteProduct);

module.exports = router;
