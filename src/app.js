const express =require("express");

const app=express();

app.use("/hello",(req,res)=>{
    res.send("hello hello hello hello");
});

app.get("/user",(req,res)=>{
    res.send({firstName : "Abhishek",lastName : "kumar",email: "abc@gmail.com"});
});

app.post("/user",(req,res)=>{
    res.send("successfully saved the data!");
});

app.delete("/user",(req,res)=>{
    res.send("successfully deleted the data!");
});


app.listen(3000,()=>{
    console.log("server is successfully listening on port 3000...");
});

