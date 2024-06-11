import {Router} from "express"  
const router = Router();
import { test } from "../controllers/user.controllers.js";

router.get('/', test)

export default router