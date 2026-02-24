const express= require('express')
const app = express()
const PORT = 8383

let data= ['James']

//Middleware
app.use(express.json())

// Type 1 :Website endpoints (sending html and they typically comes when user enters url)

app.get('/',(req,res)=>{
    res.send(`
        <body>
        <h1>DATA</h1>
            <p>${JSON.stringify(data)}</p>
            <a href='/dashboard'>Dashboard</a>
        </body>
        <script>console.log('this is script')</script>
        `)

})

app.get('/dashboard',(req,res)=>{
    res.send(`<body>
        
        <h1>Dashboard</h1>
        <a href='/'>Home</a>
        </body>`)

})

// Type 2:API endpoints (non-visual)

app.get('/api/data',(req,res)=>{
    console.log('This is for data api')
    res.statusCode(201).send(data)
})

app.post('/api/data',(req,res)=>{
    //someone wants to create a user (for exa)
    const newEntry = req.body
    data.push(newEntry.name)
    res.sendStatus(201)
})

app.delete('/api/endpoint',(req,res)=>{
    data.pop()
    console.log("Deleted the element")
    res.sendStatus(203)
})




app.listen(PORT, ()=>console.log(`Server has started on : ${PORT}`))

