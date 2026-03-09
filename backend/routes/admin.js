const { getUsers, getAllTransactions, upsertStock, getAllStocks, deleteStock, deleteUser } = require('../controllers/admin');
const { protect, authorize } = require('../middleware/auth');
const { validateStock } = require('../middleware/validation');
const express = require('express');
const router = express.Router();


router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.delete('/user/:id', deleteUser);
router.get('/transactions', getAllTransactions);
router.get('/stocks', getAllStocks);
router.post('/stock', validateStock, upsertStock);
router.delete('/stock/:symbol', deleteStock);




module.exports = router;
