import { Router } from "express"
import multer from "multer"
import { authenticate } from "../middlewares/auth.middleware.js"
import { resolveTenant } from "../middlewares/tenant.middleware.js"
import { uploadExcelController } from "../controllers/excel.controller.js"

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post("/upload", authenticate, resolveTenant, upload.single("file"), uploadExcelController)

export default router