const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

const userRouter = require("./routes/userRoutes.js")
const todoRouter = require("./routes/todoRoutes.js")

const app = express();

app.use(express.json());
app.use(cors())



// CONNECT MOGNO
mongoose.connect(process.env.MONGO_CONNECT_URL, { useNewUrlParser: true, useUnifiedTopology: true })
// LISTEN SERVER
    .then(() => { console.log("CONNECTED MONGODB!"); app.listen(process.env.PORT, () => { console.log(`SERVER RUN ON PORT ${process.env.PORT}`) }); })
    .catch(err => { console.log(err) });


app.use("/users", userRouter)
app.use("/todos", todoRouter)
