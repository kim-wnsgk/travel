import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Gathering() {
  const location = useLocation()
//   const [data, setData] = useState([]);
//   function drop(item) {
//     axios
//       .get("http://localhost:3001/gathering/drop", {
//         params: {
//           name: item,
//           user: 12345,
//         },
//       })
//       .then(function (response) {
//         console.log(response);
//         setData(response.data);
//       });
console.log(location.state)
  return (
    <div>
        {location.state.name}
        <br/>
        {location.state.admin}
    </div>
  );
}

export default Gathering;
