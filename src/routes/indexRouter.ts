import {Router, Request, Response, NextFunction} from 'express';
import {currentUser, login, register} from "../controllers/authController";
import authenticateJWT from "../middlewares/jwtAuthenticator";
import {getScoreboard} from "../controllers/questionController";

const router: Router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/current-user', authenticateJWT, currentUser);
router.get('/scoreboard', authenticateJWT, getScoreboard);

export default router;
