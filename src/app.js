import express from "express";
import authRouter from "./routes/auth.route.js"
import excelRouter from "./routes/excel.route.js"

const app = express();

app.use(express.json())

app.use("/auth", authRouter)
app.use("/excel", excelRouter)

app.get("/health", (req, res) => {
    res.send("Server is Alive !!")
})

export default app;