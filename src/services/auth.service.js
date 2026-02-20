import bcrypt from "bcrypt"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import masterPool from "../config/masterDB.js";

dotenv.config()

export const registerUserService = async (name, email, password, tenantId) => {

    const [existing] = await masterPool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    )

    if (existing.length > 0) {
        throw new Error("user already exist")
    }

    const hashedPassword = await bcrypt.hash(password, process.env.HASH_ROUNDS)

    const result = await masterPool.query(
        "INSERT INTO users (name, email, password, tenantId) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, tenantId]
    )

    return {
        name: result.name,
        email: result.name,
        tenantId: result.tenantId
    }
}

export const loginUserService = async (email, password) => {

    const [rows] = masterPool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    )

    if (rows.length == 0) {
        throw new Error("invalid credentials")
    }

    const user = rows[0]

    const isCorrect = bcrypt.compare(password, user.password)

    if (!isCorrect) {
        throw new Error("invalid credentials")
    }

    const token = jwt.sign(
        {
            userId: user.id,
            tenantId: user.tenantId
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY
        }
    )

    return token
}