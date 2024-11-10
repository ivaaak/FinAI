import express from 'express';
import openBBRoutes from './openBBRoutes';
import employeeRoutes from './employeeRoutes';
import llamaRoutes from './llamaRoutes';

const router = express.Router();

// Register your services
router.use('/api/llm', llamaRoutes);
router.use('/api/employees', employeeRoutes);
router.use('/api/openbb', openBBRoutes);

export default router;