import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import styles from "./Gather_modi.module.css";
import { useLocation } from "react-router-dom";

function Gather_modi() {
  const location = useLocation().state;
  const [data, setData] = useState([]);

  function fetchData() {
    axios
      .get("http://localhost:3001/gathering/selMem", {
        params: {
          user: 12345,
          name: location.name,
        },
      })
      .then(function (response) {
        console.log(response);
        setData(response.data);
      });
  }

  function deleteMem(user, admin) {
    axios
      .get("http://localhost:3001/gathering/delete", {
        params: {
          name: location.name,
          user: user,
          admin: admin,
        },
      })
      .then(function (response) {
        console.log(response);
        setData(response.data);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div style={{ margin: "10%" }}>
          {location.name}
          <br />
          <br />
          <div>
            {data.length === 1 ? (
              <p>함께 여행할 멤버를 찾아보세요!</p>
            ) : (
              data.map((item, index) =>
                item.user === item.admin ? (
                  <p></p>
                ) : (
                  <div>
                    <p>{item.user}</p>
                    <button onClick={() => deleteMem(item.user, item.admin)}>
                      x
                    </button>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gather_modi;
