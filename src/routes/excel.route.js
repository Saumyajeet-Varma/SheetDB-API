import { Router } from "express"
import multer from "multer"
import { authenticate } from "../middlewares/auth.middleware.js"
import { uploadExcelController } from "../controllers/excel.controller.js"
import { connectUserDB } from "../middlewares/userDb.middleware.js"

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post("/upload", authenticate, connectUserDB, upload.single("file"), uploadExcelController)

export default router