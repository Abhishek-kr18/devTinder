const express =require("express");

const app=express();

app.get("/user",
    (req,res,next)=>{
        console.log("handling the 1 route user!");
   res.send("1st response");
    next();
},

(req,res,next)=>{
    console.log("handling the 2 route user!");
    res.send("2nd response");
    next();
},
(req,res,next)=>{
    console.log("handling the 3 route user!");
    res.send("3nd response");
    next();
},
(req,res)=>{
    console.log("handling the 4 route user!");
    res.send("4nd response");
}
);


app.listen(3000,()=>{
    console.log("server is successfully listening on port 3000...");
});

