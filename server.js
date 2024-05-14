
var express = require("express");
var app = express();

var fs = require("fs");
var session = require('express-session');
var mysql = require("mysql");
const bcrypt = require('bcrypt');

require('dotenv').config()
const dbCon = mysql.createConnection({
	host: process.env.host,
	user: process.env.user,						 
	password: process.env.password, 
	database: process.env.database,					
	port: process.env.port
});

// apply the body-parser middleware to all incoming requests
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(session({
	secret: "csci4131secretkey",
	saveUninitialized: true,
	resave: false
}
));


//Load view engine
app.set('views', __dirname+"/views");
app.set('view engine', 'pug');


//Make the user need to be logged in to do certain things
function checkLoginMiddleware(req,res,next){
	if(req.session.user){
		next() 
	}
	else{
		res.redirect('/login')
	}
}
app.get(['/schedule.html','/addEvent.html','/getSchedule','/deleteEvent','/editForm','/eventInterferes'], checkLoginMiddleware)
app.post(['/postEventEntry','/postEditEvent'],checkLoginMiddleware)


app.post('/receiveLogin', (req,res)=>{
	let user = req.body.username
	let pwd = req.body.password
	dbCon.query('select acc_password from tbl_accounts where acc_name=?',[user],(err,rows)=>{
		if(err){throw err}
		if(rows.length>0 && bcrypt.compareSync(pwd,rows[0].acc_password)){
			req.session.user = user
			res.redirect('/schedule.html')
			res.write(JSON.stringify({success:true}))
		}
		else{
			res.write(JSON.stringify({success:false}))
		}
		res.end()
	})
})

//Functionality to add and return the events from the db
let json_fields = ['event','day','start','end','phone','location','info','url']
app.post('/postEventEntry',(req,res)=>{
	let values = []
	for(let key of json_fields){
		values.push(req.body[key])
	}
	dbCon.query("insert into tbl_events (event_event,event_day,event_start,event_end,event_phone,event_location,event_info,event_url) values (?,?,?,?,?,?,?,?)",values,(err,rows)=>{
		if(err){
			res.status(422)
			res.write(err)
			res.end()
			return
		}
		res.redirect('/schedule.html')
	})
})

app.post('/postEditEvent',(req,res)=>{
	let values = []
	for(let key of json_fields){
		values.push(req.body[key])
	} 
	values.push(req.body.id)
	dbCon.query("update tbl_events set event_event=?, event_day=?, event_start=?, event_end=?, event_phone=?, event_location=?, event_info=?, event_url=? where event_id=?",values,(err,rows)=>{
		if(err){
			res.status(422)
			res.write(JSON.stringify(err))
			res.end()
			return
		}
		if(rows.affectedRows==0){
			res.sendStatus(404);
			return
		}
		res.redirect('/schedule.html')
	})
})


app.get('/deleteEvent',(req,res)=>{
	dbCon.query("delete from tbl_events where event_id=?",[parseInt(req.query.id)],(err,rows)=>{
		if(err || rows.affectedRows==0){
			res.sendStatus(404);
			return
		}
		res.write(JSON.stringify({success:rows.affectedRows!=0}))
		res.end()
	})
})

function get_day(day, callback){
	dbCon.query("select * from tbl_events where event_day=? order by event_start",[day],(err,rows)=>{
		if(err){throw err}
		let answer = []
		for(let event of rows){
			let new_event = {}
			answer.push(new_event)
			for(let key in event){
				let new_key = key.substring(6)
				if(new_key=='id' || json_fields.includes(new_key)){
					new_event[new_key] = event[key]
				}
			}
		}
		callback(answer)
	})
}

app.get('/getSchedule',(req,res)=>{
	get_day(req.query.day,(events)=>{
		res.write(JSON.stringify(events))
		res.end()
	})
})


app.get('/editForm',(req,res)=>{
	dbCon.query("select * from tbl_events where event_id=?",[parseInt(req.query.id)],(err,rows)=>{
		if(err || rows.affectedRows==0){
			res.sendStatus(404);
			return
		}
		res.render("editEvent", rows[0])
	})
})

app.get("/logout", (req,res)=>{
	req.session.destroy((err)=>{
		if(err) { throw err }
		res.redirect('/login') 
	})
})

//Check for overlap between events
function convertTime(str){
	return parseFloat('.'+str.split(':').join(''))
}
let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
app.get("/eventInterferes",(req,res)=>{
	let day = req.query.day
	let start = convertTime(req.query.start)
	let end = convertTime(req.query.end)
	let answer = []

	let check = (events)=>{
		for(let evt of events){
			let start2 = convertTime(evt.start)
			let end2 = convertTime(evt.end)
			if(end2<start2){
				end2++
			}
			if(Math.sign(start2-end) != Math.sign(end2-start)){
				answer.push(evt)
			}
		}
	}

	get_day(day,(events)=>{
		let wrap = false
		if(end<start){
			end++
			wrap = true
		}
		check(events)
		if(wrap){
			start--
			end--
			let tomorrow = days[((days.indexOf(day)+1)%days.length)]
			get_day(tomorrow,(events)=>{
				check(events)
				res.write(JSON.stringify(answer))
				res.end()
			})
		}
		else{
			res.write(JSON.stringify(answer))
			res.end()
		}
	})

})

//Serving static files 
const file_paths = {}
for(let filename of ["addEvent","index","login","schedule","welcome"]){
	file_paths[`/${filename}.html`] = `${__dirname}/html/${filename}.html`
}
file_paths['/'] = file_paths['/welcome.html']
file_paths['/login'] = file_paths['/login.html']
for(let file in file_paths){
	app.get(file,function(req, res) {
		res.sendFile(file_paths[file]);
	});
}


app.get('*', function(req, res) {
	res.sendStatus(404);
});


// server listens on port 9007 for incoming connections
app.listen(9007, () => console.log('Listening on port 9007!'));



