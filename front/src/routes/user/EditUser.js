import Header from '../../components/Header';
import styles from './EditUser.module.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import * as dayjs from 'dayjs';


function EditUser() {
    const [user, setUser] = useState('');
    const [profile, setProfile] = useState();

    useEffect(() => {
        axios
            .get(`http://localhost:3001/user/getUser`, { withCredentials: true })
            .then(function (response) {
                const { data } = response;
                setUser(data.user); // 데이터를 상태에 설정
            });
    }, [user]);

    useEffect(() => {
        axios
            .get(`http://localhost:3001/user/getProfile`, {
                params: {
                    id: user
                }
            })
            .then(function (response) {
                const { data } = response;
                console.log(data[0])
                setProfile(data[0]); // 데이터를 상태에 설정
            });
    }, [user]);
    return (
        <div className={styles.container}>
            <Header />
            <div>
                {user}
            </div>
            <div>
                {profile?.name}
            </div>
            <div>
                {profile?.gender === 1 ? "남" : "여"}
            </div>
            <div>
                {dayjs(profile?.year).format("YYYY-MM-DD")}
            </div>
        </div>
    );
}

export default EditUser;