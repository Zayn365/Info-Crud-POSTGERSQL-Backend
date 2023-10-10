const express = require('express');
const cors = require('cors');
const port = 5000;
const app = express();
const user = require('./routes/userRoutes');

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.use('/user' , user );



app.listen(port , () => {
    try{
     console.log('SERVER RUNNING ON ' + port);
    }
    catch(e) {
      console.log(e.message)
    }
});


