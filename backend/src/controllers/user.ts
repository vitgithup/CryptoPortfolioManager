import { RequestHandler } from "express";
import createHttpError from "http-errors";
// import UserModel from "../models/user";
import bcrypt from "bcrypt";

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: Number(req.session.userId),
            },
        });


        res.status(200).json({username: user.username});
    } catch (error) {
        next(error);
    }
};

interface SignUpBody {
    username: string,
    password: string,
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const passwordRaw = req.body.password;

    try {

        if (!username || !passwordRaw) {
            return res.status(400).json({ error: "Parameters missing" });
        }

        const existingUsername = await prisma.user.findFirst({
            where: {
                username: username,
            },
        });

        if (existingUsername) {
            return res.status(409).json({ error: "Username already taken. Please choose a different one or log in instead." });
        }


        const passwordHashed = await bcrypt.hash(passwordRaw, 10);


        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: passwordHashed,
            },
        });


        req.session.userId = newUser.id;
        delete newUser.password
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

interface LoginBody {
    username?: string,
    password?: string,
} 

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (!username || !password) {
            throw createHttpError(400, "Parameters missing");
        }


        const user = await prisma.user.findFirst({
            where: {
                username: username,
            },
        });


        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }


        req.session.userId = user.id;
        delete user.password
        // res.send(req.session.userId);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            res.status(500).json({ message: (error as Error).message });
            // next(error);
        } else {
            res.sendStatus(200);
        }
    });
};