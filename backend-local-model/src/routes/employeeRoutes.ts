import express from 'express';
import { EmployeeController } from '../controllers/employeeController';

const router = express.Router();
const employeeController = new EmployeeController();

router.get('/', employeeController.getAllEmployees.bind(employeeController));
router.post('/', employeeController.createEmployee.bind(employeeController));
router.put('/:id', employeeController.updateEmployee.bind(employeeController));
router.delete('/:id', employeeController.deleteEmployee.bind(employeeController));

export default router;