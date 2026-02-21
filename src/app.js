import express from "express";
import authRoute from "./routes/auth.route.js"
import excelRoute from "./routes/excel.route.js"
import tableRoute from "./routes/table.route.js"

const app = express();

app.use(express.json())

app.use("/auth", authRoute)
app.use("/excel", excelRoute)
app.use("/table", tableRoute)

app.get("/health", (req, res) => {
    res.send("Server is Alive !!")
})

export default app;