import express from "express";
import * as PortfolioController from "../controllers/portfolio";

const router = express.Router();

router.get("/", PortfolioController.getPortfolio);

// router.get("/:cryptoId", PortfolioController.getCryptocurrency);

router.post("/", PortfolioController.createPortfolio);

router.put("/:id", PortfolioController.updatePortfolio);

router.delete("/:id", PortfolioController.deletePortfolio);

export default router;