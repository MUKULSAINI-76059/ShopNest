const READ_ONLY_ADMIN_EMAIL = "admin321@gmail.com";

const admin = (req, res, next) => {
    if(req.user.role === "admin"){
        next();
    }else{
        return res.status(403).json({message:"Access Denied, Only for admin"});
    }
};

const adminWrite = (req, res, next) => {
    if(req.user.role !== "admin"){
        return res.status(403).json({message:"Access Denied, Only for admin"});
    }

    if(req.user.email?.toLowerCase() === READ_ONLY_ADMIN_EMAIL){
        return res.status(403).json({message:"This admin account has read-only access."});
    }

    next();
};

module.exports = {admin, adminWrite, READ_ONLY_ADMIN_EMAIL};