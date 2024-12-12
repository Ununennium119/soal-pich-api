import {Router} from 'express';
import authenticateJWT from "../middlewares/jwtAuthenticator";
import {
    createCategory,
    deleteCategory,
    getCategory,
    listCategories,
    updateCategory
} from "../controllers/categoryController";
import authorizeRole from "../middlewares/roleChecker";
import {UserRole} from "../enum/UserRole";

const router: Router = Router();

router.post('', [authenticateJWT, authorizeRole([UserRole.DESIGNER])], createCategory);
router.get('/:id', [authenticateJWT, authorizeRole([UserRole.DESIGNER])], getCategory);
router.put('/:id', [authenticateJWT, authorizeRole([UserRole.DESIGNER])], updateCategory);
router.delete('/:id', [authenticateJWT, authorizeRole([UserRole.DESIGNER])], deleteCategory);
router.get('', [authenticateJWT, authorizeRole([UserRole.DESIGNER])], listCategories);

export default router;
