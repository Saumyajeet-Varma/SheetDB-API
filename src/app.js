import express from "express";
import authRouter from "./routes/auth.route.js"
import tenantRouter from "./routes/tenant.route.js"

const app = express();

app.use(express.json())

app.use("/auth", authRouter)
app.use("/tenant", tenantRouter)

app.get("/health", (req, res) => {
    res.send("Server is Alive !!")
})

export default app;