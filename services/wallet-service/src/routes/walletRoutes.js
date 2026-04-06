import express from "express";
import WalletController from "../controllers/walletController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, WalletController.createWallet);
router.get("/:studentId", authMiddleware, WalletController.getWalletByStudentId);
router.post("/debit", authMiddleware, WalletController.debitWallet);

export default router;