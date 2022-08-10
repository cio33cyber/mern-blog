
const express = require('express'); //requiring the express module
const {randomBytes} = require('crypto'); //for random id function
const bodyParser = require('body-parser'); //this is to puill out the body from the user's post method


const app = express(); //setting app equual to the express module
const cors = require('cors');
const axios = require('axios');


app.use(bodyParser.json()); //establishes format type of body input and responses
app.use(cors());

const posts = {}; //stores every post

//associating get and post requests with the app
app.get('/posts',(req,res) => {
    res.send(posts);//if get method is initiated, the posts object will be sent back
});

app.post('/posts',async (req,res) => {
    
    
    const id = randomBytes(4).toString('hex'); //randomly generate an id for post
    
    const {title} = req.body; //req is assuming {title:string} format
    //assigns id to user inputted object
    posts[id] = { //if post method is initiated, a post will be added to posts array
        id,title
    };
    await axios.post('http://localhost:4005/events',{type:'PostCreated',data:{id,title}});
    res.status(201).send(posts[id]);
});

app.post('/events',(req,res)=>{
    console.log('Recieved Event',req.body.type);

    res.send({});
});

app.listen(4000, () => { //this establishes a specific port for the app to listen on
    console.log('Listening on 4000');
});