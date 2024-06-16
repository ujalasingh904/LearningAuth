import {Router} from "express"  
import { test ,updateUser ,deleteUser } from "../controllers/user.controllers.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = Router();

router.get('/', test)
router.post('/update/:id', verifyToken, updateUser);
router.post('/delete/:id', verifyToken, deleteUser);

export default router