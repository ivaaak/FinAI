// src/routes/openBBRoutes.ts

import express from 'express';
import { OpenBBController } from '../controllers/openBBController';

const router = express.Router();
const openBBController = new OpenBBController();

router.post('/query', openBBController.query.bind(openBBController));
router.get('/stock-price/:symbol', openBBController.getStockPrice.bind(openBBController));
router.get('/company-revenue/:symbol', openBBController.getCompanyRevenue.bind(openBBController));

export default router;