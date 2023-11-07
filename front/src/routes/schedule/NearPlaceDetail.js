import React from "react";
import styles from "./NearPlaceDetail.module.css";
import axios from "axios";
import { useEffect,useState } from "react";
import useDidMountEffect from "../useDidMountEffect";
import AddSch from "./AddSch";
function NearPlaceDetail({ setModalOpen, id}) {
    console.log(id)
    const API_KEY = process.env.REACT_APP_API_KEY;
    const [intro, setIntro] = useState();
    const [data, setData] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        const fetchData = async () => {
          const response = await axios.get(
            `https://apis.data.go.kr/B551011/KorService1/detailCommon1?serviceKey=${API_KEY}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${id}&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&numOfRows=1&pageNo=1`
          );
          const resData = response.data.response.body.items.item;
          setIntro(resData[0]);
            getData(id);
        };
        
        fetchData();
      }, []);
      function createMarkup() {
        return {__html: intro?.overview};
      }
      const getData = async(id)=>{
        await axios.get('http://localhost:3001/schedule/getData',{params:{
            id:id
        }}
        ).then(function(response){
            setData(response.data[0])
        }
        )
    }
    console.log(isModalOpen)
    return (
        <>
        <div className={styles.modalBackground}>

            <div className={styles.modalContainer}>
            <div className={styles.header}>{data?.title}</div>
            <img
              src={data?.image ? data?.image : "./defaultImage.png"}
              className={styles.image}
            />
            <div className={styles.intro}dangerouslySetInnerHTML={createMarkup()} />
            <button className={styles.button} onClick={openModal}>일정추가</button>
            <button className={styles.closeButton} onClick={()=>setModalOpen(false)}>닫기</button>
            </div>
        </div>
         {isModalOpen && <AddSch  isOpen={openModal} contentName={data?.title} contentId={id} closeModal={closeModal}/>}
        </>
    )
}
export default NearPlaceDetail