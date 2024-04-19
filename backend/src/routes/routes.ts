import express from 'express';
import llamaService from '../controllers/llamaService';
import employeeService from '../controllers/employeeService';

const router = express.Router();

// Register your services
router.use('/llm', llamaService);
router.use('/employees', employeeService);

export default router;