import express from 'express'
import * as categoryController from '../controllers/category.controller.js'

const router = express.Router();

router.get('/', categoryController.getAllCategory);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;