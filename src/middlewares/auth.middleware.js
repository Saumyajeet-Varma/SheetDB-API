import dotenv from "dotenv"
import jwt from "jsonwebtoken";

dotenv.config()

export const authenticate = (req, res, next) => {

    const authHead = req.headers.authorization

    if (!authHead) {
        return res.status(401).json({
            success: false,
            message: "No token provided"
        })
    }

    const token = authHead.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded

        next()
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "No token provided"
        })
    }
}