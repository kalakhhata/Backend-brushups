import express from 'express'
import db from '../db.js'

const router = express.Router()

//Get all todos for a user
router.get('/',(req,res)=>{
    const getTodos = db.prepare(`SELECT * FROM todos WHERE user_id = ?`)
    const todos = getTodos.all(req.userId)
    res.json(todos)
})

//create a new todo for a user
router.post('/',(req,res)=>{
    const {task} = req.body
    const insertTodo = db.prepare(`INSERT INTO todos (user_id,task) VALUES (?,?)`)
    const result = insertTodo.run(req.userId,task)
    res.json({message:'Todo created',id:result.lastInsertRowid,task})
})

//update a todo for a user
router.put('/:id',(req,res)=>{
    const {task,completed} = req.body
    const updateTodo = db.prepare(`UPDATE todos SET task = ?, completed = ? WHERE id = ? AND user_id = ?`)
    const result = updateTodo.run(task,completed,req.params.id,req.userId)
})

//delete a todo for a user
router.delete('/:id',(req,res)=>{
    const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`)
    const result = deleteTodo.run(req.params.id,req.userId)
    res.json({message:'Todo deleted'})
})

export default router