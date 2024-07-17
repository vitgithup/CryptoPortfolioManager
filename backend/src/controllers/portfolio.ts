import { RequestHandler } from "express";
import createHttpError from "http-errors";
import getQuotes from "../util/crytoPrice";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

interface PortfolioResult {
    id: number,
    name: string,
    quantity: number,
    price: number,
    created_at: Date,
    updated_at: Date

}

export const getPortfolio: RequestHandler = async (req, res) => {

    try {
        const portfolioResult = await prisma.portfolio.findMany({
            where: { user_id: Number(req.session.userId) },
            orderBy: [
                {
                    id: 'asc',
                },
            ],
        });

        const portfolioResultPrice: PortfolioResult[] = await Promise.all(portfolioResult.map(async (obj: PortfolioResult) => {

            let price = await getQuotes(obj.name);
            return { ...obj, price: price }


        }))

        res.status(200).json(portfolioResultPrice);

    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};


interface CreatePortfolioBody {
    name: string,
    quantity: number
}

export const createPortfolio: RequestHandler<unknown, unknown, CreatePortfolioBody, unknown> = async (req, res) => {
    const name = req.body.name.trim();
    const quantity = req.body.quantity;

    try {
        // console.log("req.body",req.body)
        if (!name) {
            throw createHttpError(400, "Portfolio must have a name");
        }

        if (!quantity) {
            throw createHttpError(400, "Portfolio must have a quantity");
        }

        const newPortfolio = await prisma.portfolio.create({
            data: {
                name: name,
                quantity: quantity,
                user_id: req.session.userId 
            },
        });
        res.status(201).json(newPortfolio);

    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

interface UpdatePortfolioParams {
    id: string,
}

interface UpdatePortfolioBody {
    name: string,
    quantity: number,
}

export const updatePortfolio: RequestHandler<UpdatePortfolioParams, unknown, UpdatePortfolioBody, unknown> = async (req, res) => {
    const id = req.params.id;
    const newName = req.body.name.trim();
    const newQuantity = req.body.quantity;

    try {


        if (!newName) {
            throw createHttpError(400, "Portfolio must have a name");
        }

        if (!newQuantity) {
            throw createHttpError(400, "Portfolio must have a quantity");
        }

        const portfolio = await prisma.portfolio.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!portfolio) {
            throw createHttpError(404, "Portfolio not found");
        }

        const updatePortfolio = await prisma.portfolio.update({
            where: {
                id: Number(id),
            },
            data: {
                name: newName,
                quantity: newQuantity
            },
        });
        res.status(200).json(updatePortfolio);

    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deletePortfolio: RequestHandler = async (req, res) => {
    const id = req.params.id;

    try {

        const cryptocurrency = await prisma.portfolio.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!cryptocurrency) {
            throw createHttpError(404, "Cryptocurrency not found");
        }

        const cryptocurrencyRemove = await prisma.portfolio.delete({
            where: {
                id: Number(id),
            },
        });

        res.status(204).json(cryptocurrencyRemove);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};


