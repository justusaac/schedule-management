const { useState, useEffect } = React

var deleteEvent;
const week = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

function Table(props){
	const [rows,setRows] = useState([])
	const [day, setDay] = useState(week[0])
	const [message, setMessage] = useState('')
	useEffect(()=>{
		setMessage('')
		async function getRows(){
			let info = await fetch(`/getSchedule?day=${day.toLowerCase()}`).then((response) => response.json())
			setRows(info)	
		}
		getRows()
	},[day])


	deleteEvent = (id) => {
	    let elem = document.querySelector(`#event-${id} > td`)
	    if (!elem) {
	        setMessage(`Error deleting event: not found`)
	        return
	    }
	    let event_name = elem.innerHTML;
	    if (!window.confirm(`Really delete ${event_name}`)) {
	        return
	    }
	    fetch(`/deleteEvent?id=${id}`).then((response) => {
	        if (!response.ok) {
	            return {
	                success: false
	            }
	        }
	        return response.json()
	    }).then((info) => {
	        if (info.success) {
	            setMessage('')
	            setRows(rows.filter(row=>(row.id!=id)))
	        }
	        else{
		        setMessage(`Error deleting ${event_name}`)
		    }
	    })
	}

	return (
		<>
		<div className="alert alert-danger" id="delete-error-message" role="alert" style={{display: (message.length ? 'block' : 'none')}}>{message}</div>
		<ul className="nav nav-tabs nav-fill" id="days">
			{
				week.map(weekday =>
					<li className="nav-item" key={weekday}><a className={"nav-link" + (day==weekday ? " active" : "")} onClick={()=>{setDay(weekday)}}>{weekday}</a></li>
				)
			}	
		</ul>
		<div className="container">
		<table className="table table-striped" id="scheduleTable">
			<thead>
				<tr key="days">
					<th scope="col">Name</th>
					<th scope="col">Time</th>
					<th scope="col">Location</th>
					<th scope="col">Phone</th>
					<th scope="col">Extra Information</th>
					<th scope="col"></th>
				</tr>
			</thead>
			<tbody>
				{rows.map(row => <TableRow key={row.id} {...row} />)}
			</tbody>
		</table>
		</div>
		</>
	)
}


function TableRow(obj){
	return (
		<tr id={`event-${obj.id}`} key={obj.id} className="event-row">
		<td>{obj.event}</td>
		<td>{obj.start} - {obj.end}</td>
		<td>{obj.location}</td>
		<td>{obj.phone}</td>
		<td>{obj.url ? <a href={obj.url}>{obj.info || obj.url}</a> : obj.info}</td>
		<td>
		<a className="btn btn-info" href={`/editForm?id=${obj.id}`}>Edit</a><span> </span>
		<input type="button" className="btn btn-danger" value="Delete" onClick={()=>deleteEvent(`${obj.id}`)}/>
		</td>
		</tr>
	)
}


const table_root = ReactDOM.createRoot(document.getElementById('table-container'))
table_root.render(<Table />)

