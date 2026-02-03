import express from 'express';
import * as db from '../db/database.js';

const router = express.Router();

/**
 * GET /admin/accounts - List all registered accounts with time left
 */
router.get('/accounts', (req, res) => {
    try {
        const accounts = db.getAllAccounts();
        res.json({
            success: true,
            accounts: accounts
        });
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve accounts'
        });
    }
});

/**
 * GET /admin/settings - Get global service settings
 */
router.get('/settings', (req, res) => {
    try {
        const settings = db.getAllSettings();
        res.json({
            success: true,
            settings: settings
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve settings'
        });
    }
});

/**
 * PUT /admin/settings - Update global service settings
 */
router.put('/settings', (req, res) => {
    try {
        const { key, value } = req.body;
        
        if (!key || value === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: key and value'
            });
        }

        db.setSetting(key, value);
        res.json({
            success: true,
            message: 'Setting updated successfully'
        });
    } catch (error) {
        console.error('Error updating setting:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update setting'
        });
    }
});

/**
 * PUT /admin/accounts/:id - Update account settings
 */
router.put('/accounts/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { name, platform, auth_key, time_left } = req.body;

        if (!name || !platform || !auth_key || time_left === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, platform, auth_key, time_left'
            });
        }

        // Check if account exists
        const account = db.getAccountById(id);
        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        db.updateAccount(id, name, platform, auth_key, time_left);
        res.json({
            success: true,
            message: 'Account updated successfully'
        });
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update account'
        });
    }
});

/**
 * POST /admin/accounts - Create a new account
 */
router.post('/accounts', (req, res) => {
    try {
        const { name, platform, auth_key, time_left } = req.body;

        if (!name || !platform || !auth_key) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, platform, auth_key'
            });
        }

        const accountId = db.createAccount(
            name, 
            platform, 
            auth_key, 
            time_left || 0
        );

        res.status(201).json({
            success: true,
            id: accountId,
            message: 'Account created successfully'
        });
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create account'
        });
    }
});

export default router;
