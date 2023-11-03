import styles from "./RegionDetail.module.css";
import { useLocation,useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import AddSch from "../schedule/AddSch";


function RegionDetail() {
  const navigate = useNavigate();
  const API_KEY = process.env.REACT_APP_API_KEY;
  const location = useLocation();
  const [data, setData] = useState(location.state.data);
  const [intro, setIntro] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    setData(location.state?.data);
    const fetchData = async () => {
      const response = await axios.get(
        `https://apis.data.go.kr/B551011/KorService1/detailCommon1?serviceKey=${API_KEY}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${data.contentId}&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&numOfRows=1&pageNo=1`
      );
      console.log(response.data)
      const resData = response.data.response.body.items.item;
      setIntro(resData[0]);
    };
    fetchData();
  }, [location.state]);
  function createMarkup() {
    return { __html: intro.overview };
  }
  console.log(intro);
  console.log(data)
  return (
    <div className={styles.container}>
      <Header />

      {/** */}
      <div className={styles.contentContainer}>
        <div className={styles.titleModal}>
          <div className={styles.title}>{data.title}</div>
          <button className={styles.button} onClick={()=>navigate("/nearPlace",{state:{id:data.contentId}})}>주변보기</button>
          <button className={styles.modal} onClick={openModal}>+</button>
        </div>
        <div className={styles.date}></div>
        <div className={styles.viewAndWritedr}>
          <div className={styles.bar}> </div>
          <div className={styles.writer}>{data.addr}</div>
        </div>
        <div className={styles.contentBox}>
          <div className={styles.imgBox}>
            <img
              src={data.image ? data.image : "./defaultImage.png"}
              className={styles.image}
            />
          </div>
          <div dangerouslySetInnerHTML={createMarkup()} />
        </div>
      </div>
      <AddSch isOpen={isModalOpen} contentId={intro.contentid} contentName={data.title} closeModal={closeModal} />
      {/** */}
    </div>
  );
}

export default RegionDetail;
