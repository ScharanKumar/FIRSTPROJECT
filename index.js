const express = require("express");
const path = require("path");
 const cors=require("cors")
 const port = process.env.PORT || 3030

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json())
app.use(cors({
    origin:"http://localhost:3004"
}))

const dbPath = path.join(__dirname, "x.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(port, () => {
      console.log(`Server Running at http://localhost:${port}`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.post("/posted/",async(request,response)=>{
    const {id1,input1}=request.body
    const query=`insert into play(id2,para2)
    values('${id1}','${input1}');`
    const response1 = await db.run(query)
    const x = response1.lastId
    
    response.send({lastId:x})
})
app.get("/",async(request,response)=>{
    const query=`select * from wwe;`
    const response1= await db.all(query)
    response.send(response1)
})
app.get("/hi/",async(request,response)=>{
  const query=`select * from play;`
  const response1= await db.all(query)
  response.send(response1)
})
app.delete("/delete/:x/",async(request,response)=>{
  const {x} = request.params
  const query=`delete from play 
  where id2 like '${x}';`
  const res = await db.run(query)
  response.send("Successfully deleted")
})