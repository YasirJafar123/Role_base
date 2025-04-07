const express = require('express');
const dotenv = require('dotenv');
const routes = require('./src/router/mainRoutes')
const path = require('path')
const dbconnect = require('./src/config/dbConn');
const cookieParser = require('cookie-parser');
const {authtoken} = require('./src/middleware/authMiddleware'); 
const {roleAccess,PermissionMiddleware} = require('./src/middleware/adminverifyMiddleware')
dbconnect();
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const static_path = path.join(__dirname, './public/uploads');
app.use(express.static(static_path));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(routes)
app.use(authtoken);
app.use(roleAccess);
app.use(PermissionMiddleware);



app.listen(port, ()=>{
    console.log(`Server live on Port ${port}`)
})