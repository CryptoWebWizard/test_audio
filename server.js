
let express = require ('express');
let dbConnection = require('./config/db')
let userRoutes = require('./routes/user')
let musicRoutes = require('./routes/music')

var path = require('path');

const app = express();
let PORT = process.env.PORT || 3001;

let dir = path.join(__dirname, 'public');

console.log(dir , "this is dir")
app.use(express.static(dir));

dbConnection.connection();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes and endpoints
 app.use('/api/v1/user', userRoutes);
 app.use('/api/v1/music', musicRoutes);


// default route of express app for heroku monitoring
app.get("/", (req, res) => {
   res.send("Testing......");
});


app.listen(PORT, () => {
    console.log(`server is listening on http://localhost:${PORT}`);
 })