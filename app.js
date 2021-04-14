const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const cors = require('cors');

const {getHomePage} = require('./routes/index');
const {addPlayerPage, addPlayer, deletePlayer, editPlayer, editPlayerPage} = require('./routes/player');

const port = 5000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'socka'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database successfully');
});

global.db = db;

app.set('port', process.env.port || port);                                                                                                                                     
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//app.use(require('connect').bodyParser()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


app.get('/', getHomePage);
app.get('/add', addPlayerPage);
app.get('/edit/:id', editPlayerPage);
app.get('/delete/:id', deletePlayer);
app.post('/add', addPlayer);
//app.post('/edit/:id', editPlayer);

app.post('/edit/:id', (req, res) => {
    var c = {first_name : req.body.first_name}
    console.log(c)
    console.log(req.body)
	console.log(req.body.first_name)
    console.log(req.params.id)
	res.send('Hello World!')
    
})

app.listen(port, ()=> {
    console.log(`Server running on port : ${port}`)
});