import { Router } from 'express';
import { listTodos, createTodo, updateTodo, setDone, removeTodo } from './todo.controller';

const router = Router();

router.get('/', listTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.patch('/:id/done', setDone);
router.delete('/:id', removeTodo);

export default router;
