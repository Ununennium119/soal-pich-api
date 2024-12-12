import {Router} from 'express';
import authenticateJWT from "../middlewares/jwtAuthenticator";
import {
    createQuestion,
    deleteQuestion,
    getQuestion,
    listQuestions,
    updateQuestion
} from "../controllers/questionController";
import authorizeRole from "../middlewares/roleChecker";
import {UserRole} from "../enum/UserRole";

const router: Router = Router();

router.post('', [authenticateJWT, authorizeRole([UserRole.DESIGNER])], createQuestion);
router.get('/:id', [authenticateJWT, authorizeRole([UserRole.DESIGNER, UserRole.PLAYER])], getQuestion);
router.put('/:id', [authenticateJWT, authorizeRole([UserRole.DESIGNER])], updateQuestion);
router.delete('/:id', [authenticateJWT, authorizeRole([UserRole.DESIGNER])], deleteQuestion);
router.get('', [authenticateJWT, authorizeRole([UserRole.DESIGNER, UserRole.PLAYER])], listQuestions);

export default router;
