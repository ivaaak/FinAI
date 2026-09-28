// src/routes.ts
import express from 'express';
import employeeController from './controllers/employeeController';
import financeController from './controllers/financeController';
import llamaController from './controllers/llamaController';
import openBBController from './controllers/openBBController';
import { isDatabaseConnected } from './data/database';
import llamaService from './services/llamaService';

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    claude: { hasApiKey: !!process.env.ANTHROPIC_API_KEY },
    localModel: { loaded: llamaService.isLoaded },
    database: { connected: isDatabaseConnected() },
  });
});

// Claude-powered finance analyst
router.get('/finance/models', financeController.listModels.bind(financeController));
router.post('/finance', financeController.handleFinanceRequest.bind(financeController));

// Local LLM (node-llama-cpp)
router.post('/llm', llamaController.handleChatPrompt.bind(llamaController));
router.post('/llm/textPrompt', llamaController.handleChatPrompt.bind(llamaController));
router.post('/llm/finPrompt', llamaController.handleFinPrompt.bind(llamaController));
router.get('/llm/prompts', llamaController.getPrompts.bind(llamaController));
router.get('/llm/status', llamaController.status.bind(llamaController));
router.post('/llm/reset', llamaController.reset.bind(llamaController));

// Sample MongoDB CRUD (requires ATLAS_URI)
router.get('/employees', employeeController.getAllEmployees.bind(employeeController));
router.post('/employees', employeeController.createEmployee.bind(employeeController));
router.put('/employees/:id', employeeController.updateEmployee.bind(employeeController));
router.delete('/employees/:id', employeeController.deleteEmployee.bind(employeeController));

// OpenBB helpers (requires OPENBB_PAT)
router.post('/openbb/query', openBBController.query.bind(openBBController));
router.get('/openbb/stock-price/:symbol', openBBController.getStockPrice.bind(openBBController));
router.get('/openbb/company-revenue/:symbol', openBBController.getCompanyRevenue.bind(openBBController));

export default router;
