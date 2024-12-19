const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");


dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => { console.log("Connect To DB") })
    .catch((err) => { console.log("Error: ", err) })


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    location: { type: String }
})

const user = mongoose.model('user', userSchema);

app.get('/user', async (req, res) => {
    try {
        const users = await user.find();
        res.status(200).json({
            status: "success",
            user: users
        })
    }
    catch (err) {
        res.status(500);
        res.json({
            message: err.message
        })
        console.log("Error: ", err)
    }
})

app.post('/user', async (req, res) => {
    try {
        const userInfo = new user(req.body);
        await userInfo.save();
        res.status(200).json(userInfo);
    }
    catch (err) {
        console.log("Error: ", err);
        res.status(400);
        res.json({
            message: err.message
        })
    }
})

app.get('/user/:id', async (req, res) => {
    try {
        console.log("C");
        const users = await user.findById(req.params.id);
        console.log("CCX", users);
        if (!users)
            return res.status(404).json({ message: "user not found" });
        res.status(200).json(users);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})

app.put('/user/:id', async (req, res) => {
    try {
        const updatedData=req.body;
        console.log("C", updatedData);
        const users = await user.findByIdAndUpdate(req.params.id, updatedData);
        console.log("CCX", users);
        if (!users)
            return res.status(404).json({ message: "user not found" });
        res.status(200).json(users);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})

app.listen(process.env.PORT, () => {
    console.log("Server Started!")
})