const { body, validationResult } = require('express-validator');

exports.validateTrade = [
    body('symbol').isString().notEmpty().withMessage('Symbol is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

exports.validateRegister = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

exports.validateLogin = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').exists().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

exports.validateStock = [
    body('symbol').isString().notEmpty().withMessage('Symbol is required'),
    body('companyName').isString().notEmpty().withMessage('Company name is required'),
    body('currentPrice').isFloat({ min: 0 }).withMessage('Current price must be a positive number'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

