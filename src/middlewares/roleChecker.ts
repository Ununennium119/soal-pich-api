import {NextFunction, Request, Response} from 'express';
import {UserRole} from "../enum/UserRole";

const authorizeRole = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({message: 'Access forbidden: Insufficient permissions.'});
        }

        next();
    };
};

export default authorizeRole;