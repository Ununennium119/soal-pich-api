import {Router, Request, Response, NextFunction} from 'express';
import {currentUser, login, register} from "../controllers/authController";
import authenticateJWT from "../middlewares/jwtAuthenticator";

const router: Router = Router();

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    try {
        return login(req, res, next);
    } catch (e) {
        next(e);
    }
});
router.post('/register', (req: Request, res: Response, next: NextFunction) => {
    try {
        return register(req, res, next);
    } catch (e) {
        next(e);
    }
});
router.post('/current-user', authenticateJWT, (req: Request, res: Response, next: NextFunction) => {
    try {
        return currentUser(req, res, next);
    } catch (e) {
        next(e);
    }
});

export default router;
