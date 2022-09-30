const ROLES = {
    basic: 'basic',
    admin: 'admin',
}

function authUser(req, res, next) {
    return (req, res, next) => {
        if (req.user == null) {
            next()
        } else {
            res.status(403).json({
                message: 'You need to create an account to access this feature'
            })
        }
    }
}

function authRole(role) {
    return (req, res, next) => {
        if (req.admin.role !== role) {
            res.status(403).json({
                message: 'Forbidden action'
            })
        }
        next()
    }
}

module.exports = {
    ROLES,
    authUser,
    authRole,
}
