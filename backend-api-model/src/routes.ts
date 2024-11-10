import express from 'express';
import financeController from './services/financeController';

const router = express.Router();

router.post("/finance", financeController.handleFinanceRequest.bind(financeController));

export default router;