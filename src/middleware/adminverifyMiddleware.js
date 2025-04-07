const User = require('../models/userModels')


const roleAccess = (allowedRoles) => {
    try {
        return async (req, res, next) => {
            if (!req.user || !allowedRoles.includes(req.user.role)) {
                return res.status(403).send({
                    success: false,
                    message: "Access denied! You do not have the required role."
                });
            }
            next();
        };
    }
    catch (error) {
        return res.status(500).send({
            success: false,
            message: "Server error",
            error: error.message
        });
    };
};


const PermissionMiddleware = (requiredPermissionName) => {
    return async (req, res, next) => {
      try {
        const userId = req.user.id;
        if (!userId) {
          return res.status(401).send({
            success: false,
            message: "Unauthorized: No user found"
          });
        }
  
        const user = await User.findById(userId).populate("permissions");
  
        const hasPermission = user.permissions.some(perm =>
          perm.permission_name === requiredPermissionName
        );
  
        if (!hasPermission) {
          return res.status(403).send({
            success: false,
            message: `Access denied. You need '${requiredPermissionName}' permission`
          });
        }
  
        next();
      } catch (error) {
        console.error("Permission Middleware Error:", error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
      }
    };
  };
  

module.exports = { roleAccess, PermissionMiddleware }
