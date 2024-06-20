function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState,
  useEffect
} = React;
var deleteEvent;
const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
function Table(props) {
  const [rows, setRows] = useState([]);
  const [day, setDay] = useState(week[0]);
  const [message, setMessage] = useState('');
  useEffect(() => {
    setMessage('');
    async function getRows() {
      let info = await fetch(`/getSchedule?day=${day.toLowerCase()}`).then(response => response.json());
      setRows(info);
    }
    getRows();
  }, [day]);
  deleteEvent = id => {
    let elem = document.querySelector(`#event-${id} > td`);
    if (!elem) {
      setMessage(`Error deleting event: not found`);
      return;
    }
    let event_name = elem.innerHTML;
    if (!window.confirm(`Really delete ${event_name}`)) {
      return;
    }
    fetch(`/deleteEvent?id=${id}`).then(response => {
      if (!response.ok) {
        return {
          success: false
        };
      }
      return response.json();
    }).then(info => {
      if (info.success) {
        setMessage('');
        setRows(rows.filter(row => row.id != id));
      } else {
        setMessage(`Error deleting ${event_name}`);
      }
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger",
    id: "delete-error-message",
    role: "alert",
    style: {
      display: message.length ? 'block' : 'none'
    }
  }, message), /*#__PURE__*/React.createElement("ul", {
    className: "nav nav-tabs nav-fill",
    id: "days"
  }, week.map(weekday => /*#__PURE__*/React.createElement("li", {
    className: "nav-item",
    key: weekday
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav-link" + (day == weekday ? " active" : ""),
    onClick: () => {
      setDay(weekday);
    }
  }, weekday)))), /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("table", {
    className: "table table-striped",
    id: "scheduleTable"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    key: "days"
  }, /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, "Name"), /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, "Time"), /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, "Location"), /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, "Phone"), /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, "Extra Information"), /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }))), /*#__PURE__*/React.createElement("tbody", null, rows.map(row => /*#__PURE__*/React.createElement(TableRow, _extends({
    key: row.id
  }, row)))))));
}
function TableRow(obj) {
  return /*#__PURE__*/React.createElement("tr", {
    id: `event-${obj.id}`,
    key: obj.id,
    className: "event-row"
  }, /*#__PURE__*/React.createElement("td", null, obj.event), /*#__PURE__*/React.createElement("td", null, obj.start, " - ", obj.end), /*#__PURE__*/React.createElement("td", null, obj.location), /*#__PURE__*/React.createElement("td", null, obj.phone), /*#__PURE__*/React.createElement("td", null, obj.url ? /*#__PURE__*/React.createElement("a", {
    href: obj.url
  }, obj.info || obj.url) : obj.info), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
    className: "btn btn-info",
    href: `/editForm?id=${obj.id}`
  }, "Edit"), /*#__PURE__*/React.createElement("span", null, " "), /*#__PURE__*/React.createElement("input", {
    type: "button",
    className: "btn btn-danger",
    value: "Delete",
    onClick: () => deleteEvent(`${obj.id}`)
  })));
}
const table_root = ReactDOM.createRoot(document.getElementById('table-container'));
table_root.render( /*#__PURE__*/React.createElement(Table, null));