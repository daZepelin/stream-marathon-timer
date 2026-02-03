/**
 * Admin authentication middleware
 * Checks for X-Admin-Secret header to authenticate admin requests
 */

// Admin secret - in production this should come from environment variable
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'stream-marathon-admin-secret-key-2024';

function adminAuth(req, res, next) {
    const adminSecret = req.headers['x-admin-secret'];

    if (!adminSecret) {
        return res.status(401).json({
            success: false,
            message: 'Missing admin authentication header'
        });
    }

    if (adminSecret !== ADMIN_SECRET) {
        return res.status(403).json({
            success: false,
            message: 'Invalid admin secret'
        });
    }

    next();
}

export default adminAuth;
