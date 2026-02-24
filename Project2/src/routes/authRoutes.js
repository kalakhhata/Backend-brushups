import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()


//Register a new user endpoint /auth/register
router.post('/register', async (req,res)=>{
const {username,password} = req.body
const hashedPassword = await bcrypt.hash(password,10)
// save the new user and hashed password to the db
try{
    const insertUser = db.prepare(`INSERT INTO users (username,password) VALUES (  ?,?)`)
    const result = insertUser.run(username,hashedPassword)

    // now that we have the user , I want to create a first todo for the user
    const defaultTodo = 'Welcome to your todo list!'
    const insertTodo = db.prepare(`INSERT INTO todos (user_id,task) VALUES (?,?)`)
    insertTodo.run(result.lastInsertrowid,defaultTodo)

    // create a JWT token for the user
    const token = jwt.sign({id: result.lastInsertrowid},process.env.JWT_SECRET,{expiresIn:'24h'})
    res.json({token})

}catch(err) {
    console.error(err)
    res.sendStatus(503)
}
})

router.post('/login',(req,res)=>{})

export default router
