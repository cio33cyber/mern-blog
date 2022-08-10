
//same initial dependencies as the posts
const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors');
const axios = require('axios');
//way to initiate express and use json handling
const app = express();
app.use(bodyParser.json());
app.use(cors());
//array to store comments
const commentsByPostId = {};

app.get('/posts/:id/comments',(req,res) =>{
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments',async (req,res) =>{
    const commentId = randomBytes(4).toString('hex'); //randomly generated id
    const {content} = req.body;

    const comments = commentsByPostId[req.params.id]  || []; //checks if comments have already been assigned to that id. if undefined, output empty array

    comments.push({id: commentId,content});

    commentsByPostId[req.params.id] = comments;

    await axios.post('http://localhost:4005/events',
        {type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id
        }
    })

    res.status(201).send(comments);

});

app.post('/events',(req,res)=>{
    console.log('Recieved Event',req.body.type);

    res.send({});
});

app.listen(4001,()=>{
    console.log('Listening on port 4001')
})