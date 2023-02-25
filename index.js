const express = require("express")
require("dotenv").config()
const http = require("http")
const port = process.env.port || 4000
const cors = require("cors")
const auth_route = require("./route/auth")

const app = express();
const server = http.createServer(app)
app.use(express.json())
app.use(cors())


app.use("/api/auth", auth_route)


//handle error
app.use((error, req, res, next) => {
    res.status(error.status).json({ message: error.message })
})

server.listen(port, (error) => {
    if (error) {
        console.log("An error occured")
        return;
    }
    require("./mongoose/mongoose")
    console.log("Port started on " + port)
})