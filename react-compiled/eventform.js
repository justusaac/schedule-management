const {
  useState
} = React;
var checkOverlap;
function EventForm(props) {
  const [overlap, setOverlap] = useState('');
  checkOverlap = () => {
    let day = document.getElementById('dayInput').value;
    let start = document.getElementById('startTimeInput').value;
    let end = document.getElementById('endTimeInput').value;
    fetch(`/eventInterferes?day=${day}&start=${start}&end=${end}`).then(response => response.json()).then(info => {
      setOverlap(info);
    });
  };
  return /*#__PURE__*/React.createElement("form", {
    id: "addEvent",
    name: "addEvent",
    method: "post",
    action: props.endpoint || "/postEventEntry"
  }, /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "id",
    defaultValue: props.event_id || 0
  }), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    for: "nameInput",
    className: "required-input"
  }, "Event"), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "nameInput",
    type: "text",
    name: "event",
    required: "",
    defaultValue: props.event_event
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    for: "dayInput",
    className: "required-input"
  }, "Day of Week"), /*#__PURE__*/React.createElement("select", {
    className: "form-control",
    id: "dayInput",
    name: "day",
    defaultValue: props.event_day
  }, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => /*#__PURE__*/React.createElement("option", null, day)))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    for: "startTimeInput",
    className: "required-input"
  }, "Start"), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "startTimeInput",
    type: "time",
    name: "start",
    required: "",
    defaultValue: props.event_start
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    for: "endTimeInput",
    className: "required-input"
  }, "End"), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "endTimeInput",
    type: "time",
    name: "end",
    required: "",
    defaultValue: props.event_end
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    for: "phoneInput"
  }, "Phone"), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "phoneInput",
    type: "text",
    name: "phone",
    defaultValue: props.event_phone
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    for: "locationInput"
  }, "Location"), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "locationInput",
    type: "text",
    name: "location",
    defaultValue: props.event_location
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    for: "extraInput"
  }, "Extra Info"), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "extraInput",
    type: "text",
    name: "info",
    defaultValue: props.event_info
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    for: "urlInput"
  }, "Enter URL for the Extra Info"), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "urlInput",
    type: "url",
    name: "url",
    defaultValue: props.event_url
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-block btn-primary",
    type: "submit"
  }, "Submit"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-block btn-secondary",
    type: "button",
    onClick: checkOverlap,
    "data-toggle": "tooltip",
    "data-placement": "top",
    title: "Checks if this event interferes with any on your existing schedule"
  }, "Check for Overlap"), /*#__PURE__*/React.createElement("div", {
    className: "container mt-3",
    id: "overlapAlert",
    style: {
      display: overlap != '' ? 'block' : 'none'
    }
  }, overlap.length ? /*#__PURE__*/React.createElement("div", {
    className: "alert alert-warning",
    role: "alert"
  }, "This event interferes with ", overlap.length, " others:", /*#__PURE__*/React.createElement("ul", {
    className: "list-group"
  }, overlap.map(event => /*#__PURE__*/React.createElement("li", {
    className: "list-group-item",
    key: event.id
  }, event.event, " from ", event.start, " to ", event.end, " on ", event.day)))) : /*#__PURE__*/React.createElement("div", {
    className: "alert alert-success",
    role: "alert"
  }, "This event does not interfere with any others.")));
}
if (typeof event_form_options == 'undefined') {
  var event_form_options = {};
}
const event_form_root = ReactDOM.createRoot(document.getElementById('event-form-container'));
event_form_root.render( /*#__PURE__*/React.createElement(EventForm, event_form_options));