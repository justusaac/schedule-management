const { useState } = React
var checkOverlap;
function EventForm(props){
	const [overlap, setOverlap] = useState('')

	checkOverlap = ()=> {
	    let day = document.getElementById('dayInput').value
	    let start = document.getElementById('startTimeInput').value
	    let end = document.getElementById('endTimeInput').value
	    fetch(`/eventInterferes?day=${day}&start=${start}&end=${end}`).then((response) => response.json()).then((info) => {
	        setOverlap(info)
	    })
	}

	return(
	<form id="addEvent" name="addEvent" method="post" action={props.endpoint || "/postEventEntry"}>
		<input type="hidden" name="id" defaultValue={props.event_id || 0} />
		<div className="form-group">
			<label for="nameInput" className="required-input">Event</label>
			<input className="form-control" id="nameInput" type="text" name="event" required="" defaultValue={props.event_event}/>
		</div>
		<div className="form-group">
			<label for="dayInput" className="required-input">Day of Week</label>
			<select className="form-control" id="dayInput" name="day" defaultValue={props.event_day}>
				{(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']).map(day=>
					<option>{day}</option>
				)}
			</select>
		</div>
		<div className="form-group">
			<label for="startTimeInput" className="required-input">Start</label>
			<input className="form-control" id="startTimeInput" type="time" name="start" required="" defaultValue={props.event_start} />
		</div>
		<div className="form-group">
			<label for="endTimeInput" className="required-input">End</label>
			<input className="form-control" id="endTimeInput" type="time" name="end" required="" defaultValue={props.event_end} />
		</div>
		<div className="form-group">
			<label for="phoneInput">Phone</label>
			<input className="form-control" id="phoneInput" type="text" name="phone" defaultValue={props.event_phone}/>
		</div>
		<div className="form-group">
			<label for="locationInput">Location</label>
			<input className="form-control" id="locationInput" type="text" name="location" defaultValue={props.event_location}/>
		</div>
		<div className="form-group">
			<label for="extraInput">Extra Info</label>
			<input className="form-control" id="extraInput" type="text" name="info" defaultValue={props.event_info}/>
		</div>
		<div className="form-group">
			<label for="urlInput">Enter URL for the Extra Info</label>
			<input className="form-control" id="urlInput" type="url" name="url" defaultValue={props.event_url}/>
		</div>
		<button className="btn btn-block btn-primary" type="submit">Submit</button>
		<button className="btn btn-block btn-secondary" type="button" onClick={checkOverlap} data-toggle="tooltip" data-placement="top" title="Checks if this event interferes with any on your existing schedule">Check for Overlap</button>
		<div className="container mt-3" id="overlapAlert" style={{display: (overlap!='' ? 'block' : 'none')}}>{
			overlap.length ?(
				<div className="alert alert-warning" role="alert" >
				This event interferes with {overlap.length} others:
				<ul className="list-group">
				{overlap.map(event =>
	            	<li className="list-group-item" key={event.id}>{event.event} from {event.start} to {event.end} on {event.day}</li>
	            )}
				</ul>
				</div>
			):(
				<div className="alert alert-success" role="alert">
				This event does not interfere with any others.
				</div>
			)
		}</div>
	</form>
	)
}


if(typeof(event_form_options) == 'undefined'){
  var event_form_options = {}
}
const event_form_root = ReactDOM.createRoot(document.getElementById('event-form-container'));
event_form_root.render(<EventForm {...event_form_options} />);