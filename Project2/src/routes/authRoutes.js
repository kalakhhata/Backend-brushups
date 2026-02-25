import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()


//Register a new user endpoint /auth/register
router.post('/register', async (req,res)=>{
    const {username,password} = req.body
    const hashedPassword = await bcrypt.hash(password,10)

    try{
        const insertUser = db.prepare(`INSERT INTO users (username,password) VALUES (?,?)`)
        const result = insertUser.run(username, hashedPassword)

        // default todo
        const defaultTodo = 'Welcome to your todo list!'
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?,?)`)
        insertTodo.run(result.lastInsertRowid, defaultTodo)  // ✅ fixed

        // JWT token
        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: '24h'})
        res.json({token})

    }catch(err){
        console.error(err)
        res.sendStatus(503)
    }
})

router.post('/login',(req,res)=>{
    const {username,password}= req.body

    try{
        const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`)
        const user = getUser.get(username)
        //if the user does not exist, return an error
        if (!user){
            return res.status(404).send('user not found')
        }

        const passwordMatch = bcrypt.compare(password,user.password)
        //if the password does not match, return an error
        if (!passwordMatch){
            return res.status(401).send('invalid password')

        }

        // then we have successfully authenticated the user, we can create a JWT token for them
        const token = jwt.sign({id: user.id},process.env.JWT_SECRET,{expiresIn:'24h'})
        res.json({token})  
    }
    catch(err){
     console.lon(err.message)
     res.sendStatus(503)
    }
})

export default router
