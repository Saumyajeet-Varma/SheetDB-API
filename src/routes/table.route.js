import { Router } from "express"
import { authenticate } from "../middlewares/auth.middleware.js"
import { connectUserDB } from "../middlewares/userDb.middleware.js"
import { getTableData, listTables, saveChanges } from "../controllers/table.controller.js"

const router = Router()

router.get("/", authenticate, connectUserDB, listTables)

router.get("/:tableName", authenticate, connectUserDB, getTableData)

router.post("/:tableName/save", authenticate, connectUserDB, saveChanges)

export default router