function NavBar(props){
	const nav_links = {
		'Home':'/index.html',
		'Schedule':'/schedule.html',
		'Add Event':'/addEvent.html',
		'Log out':'/logout',
	}
	const current_location = window.location.pathname
	return (
		<ul className="nav nav-pills">
		{Object.keys(nav_links).map(name=>
			<li key={name}  className="nav-item"><a className={"nav-link" + (current_location==nav_links[name] ? ' active' : '')} href={nav_links[name]}>{name}</a></li>
		)}
		</ul>
	)
}

const navbar_root = ReactDOM.createRoot(document.querySelector('nav'))
navbar_root.render(<NavBar />)