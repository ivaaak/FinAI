import express from 'express';
import { LlamaController } from '../controllers/llamaController';

const router = express.Router();
const llamaController = new LlamaController();

router.post('/', llamaController.handleChatPrompt.bind(llamaController));
router.post('/textPrompt', llamaController.handleChatPrompt.bind(llamaController));
router.post('/finPrompt', llamaController.handleFinPrompt.bind(llamaController));

export default router;