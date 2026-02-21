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

    const hashedPassword = await bcrypt.hash(password, Number(process.env.HASH_ROUNDS))

    const [result] = await masterPool.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
    )

    const userId = result.insertId

    const dbName = `sheetdb_user_${userId}`

    await masterPool.query(
        `CREATE DATABASE \`${dbName}\``
    )

    await masterPool.query(
        "UPDATE users SET database_name = ? WHERE id = ?",
        [dbName, userId]
    )

    const token = jwt.sign(
        { userId: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
    );

    return token;
}

export const loginUserService = async (email, password) => {

    const [rows] = await masterPool.query(
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
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
    )

    return token
}