import express from 'express';
import employeeService from './employeeService';
import chatService from './llamaService';

const router = express.Router();

// Register your services
router.use('/employees', employeeService);
router.use('/chat', chatService);

export default router;
