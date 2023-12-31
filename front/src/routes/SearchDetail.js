// 이미지 없을시 기본이미지, 전화번호 없을시 문구?, 마우스 올릴시 소개글같은 추가정보 팝업창처럼, 
// 관광타입 숫자가아니라 글로 바꾸기

import axios from 'axios';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import styles from './SearchDetail.module.css'

function SearchDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState(location.state.searchText);

    const [res, setRes] = useState(null);

    useEffect(() => {
        console.log(searchText)
        axios.get(
            `/data/search`, {
            params: {
                text: searchText,
            },
        })
            .then(response => {
                setRes(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [searchText]);

    const [text, setText] = useState(location.state.searchText);
    const onSearchChange = (e) => {
        setText(e.target.value)
    }

    const enterKeyPress = e => {
        if (e.key === 'Enter') {
            setSearchText(text); // Enter 입력이 되면 클릭 이벤트 실행
        }
    };

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    value={text}
                    onChange={onSearchChange}
                    placeholder="검색어를 입력해주세요."
                    className={styles.search}
                    onKeyPress={enterKeyPress}
                />
            </div>
            <div className={styles.content}>
                {res ? (
                    <ul className={styles.lists}>
                        {res.map(item => (
                            <li key={item.contentid} className={styles.list}
                                onClick={() =>
                                    navigate("/regionDetail", {
                                        state: {
                                            data: {
                                                title: item.title,
                                                addr: item.addr,
                                                image: item.image,
                                                contentId: item.contentId
                                            }
                                        },
                                    })}>
                                <div className={styles.imageContainer}>
                                    <img src={item.image ? item.image : 'defaultImage.png'} width="200px" className={styles.image} />
                                </div>
                                <div className={styles.info}>
                                    <div>{item.title}</div>
                                    <div>{item.addr1} {item.addr}</div>
                                    <div>전화번호 : {item.tel}</div>
                                    <div>관광타입 : {item.contentTypeId}</div>
                                </div>

                            </li>
                        ))}
                    </ul>
                ) : (
                    <>
                        <div>검색된 데이터가 없습니다.</div>

                    </>
                )}
                <div>찾으시는 데이터가 없나요?</div>
                <button
                    onClick={() => navigate('/addRegion')}>
                    데이터 직접 추가하기
                </button>
            </div>
        </div>
    );
}

export default SearchDetail;
