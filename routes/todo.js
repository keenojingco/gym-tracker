import express from 'express';
import * as todoController from '../controllers/todoController';
import auth from '../middlewares/auth';

const router = express.Router();

router.route('/')
    .get(todoController.getTodos)
    .post(todoController.addTodo)
    .put(todoController.updateTodo);
router.route('/:id')
    .get(auth,todoController.getTodo)
    .delete(todoController.deleteTodo);

export default router;