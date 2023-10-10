import axios from 'axios';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import styles from './RecommandDetail.module.css'
import AddSch from '../schedule/AddSch';
import { AiOutlinePlusSquare } from "react-icons/ai";

function RecommandDetail() {
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contentName, setContentName] = useState('');
    const [sightId, setSightId] = useState(0);

    const seed = new Date().getTime();

    const [datas, setDatas] = useState(null);


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        setDatas(location.state?.datas);
        console.log(datas)
    }, [location.state]);

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                {datas ? (
                    <ul className={styles.lists}>
                        {datas
                            .sort(() => Math.random() - 0.5) // 아이템의 순서를 무작위로 섞습니다
                            .slice(0, 10) // 처음 10개 아이템을 선택합니다
                            .map((item) => (
                                <li key={item.contentid} className={styles.list}>
                                    <div className={styles.imageContainer}>
                                        <img
                                            src={`${item.image}`}
                                            width="200px"
                                            className={styles.image}
                                        />
                                    </div>
                                    <div className={styles.info}>
                                        <div>{item.title}</div>
                                        <div>{item.addr}</div>
                                        <div>contentId: {item.contentId}</div>
                                        <div>관광타입: {item.contentTypeId}</div>
                                        <AiOutlinePlusSquare
                                            className={styles.icon}
                                            size={'30px'}
                                            onClick={() => {
                                                setIsModalOpen(true);
                                                setSightId(item.contentId);
                                                setContentName(item.title)
                                        }}
                                        />
                                    </div>
                                </li>
                            ))}
                    </ul>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            <AddSch isOpen={isModalOpen} contentId={sightId} contentName={contentName} closeModal={closeModal} />
        </div>
    );
}

export default RecommandDetail;
