import { loginUserService, registerUserService } from "../services/auth.service.js";

export const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "fill all fields"
            })
        }

        const token = await registerUserService(name, email, password)

        if (!token) {
            return res.status(500).json({
                success: false,
                message: "User cant be registered, try again"
            })
        }

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: { token }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "user registration failed"
        })
    }
}

export const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "fill all fields"
            })
        }

        const token = await loginUserService(email, password)

        res.status(200).json({
            success: true,
            message: "user logged in",
            data: { token }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "login failed"
        })
    }
}