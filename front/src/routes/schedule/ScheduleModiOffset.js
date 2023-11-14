import React, { useEffect } from "react"; 
import axios from "axios";
import useDidMountEffect from "../useDidMountEffect"; 
import styles from "./ScheduleModiOffset.module.css"; 
import { useState } from "react";
import { setDefaultLocale } from "react-datepicker";
import { useLocation } from "react-router-dom";

function ScheduleModiOffset() {
    const location = useLocation().state;
    const [data, setData] = useState();
    useDidMountEffect(() => {
        axios
            .get("/CheckDate",
            {params: {
                id : location.id
            }})
            .then(function (response) {
                setData(response.data)
                console.log(response.data)
            })
            .catch(function (error) {
            });
    }, []); 

    return (
        <div className={styles.container}>
           
        </div>
    );
}

export default ScheduleModiOffset;
