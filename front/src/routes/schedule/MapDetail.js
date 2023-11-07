import styles from "./MapDetail.module.css";
import axios from "axios";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
function Gather_new({ setModalOpen, contentId, title, image }) {
  const navigate = useNavigate()
    const API_KEY = process.env.REACT_APP_API_KEY;
    const [intro, setIntro] = useState();
    console.log(title, image)
    useEffect(() => {
      
        const fetchData = async () => {
          const response = await axios.get(
            `https://apis.data.go.kr/B551011/KorService1/detailCommon1?serviceKey=${API_KEY}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${contentId}&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&numOfRows=1&pageNo=1`
          );
          console.log(response)
          const resData = response.data.response.body.items.item;
          setIntro(resData[0]);
        };
        fetchData();
      }, []);
      function createMarkup() {
        return {__html: intro?.overview};
      }
    
    return (
        <div className={styles.modalBackground} onClick={()=>setModalOpen(false)}>

            <div className={styles.modalContainer}>
            <div className={styles.header}>{title}</div>
            <img
              src={image ? image : "./defaultImage.png"}
              className={styles.image}
            />
            <div className={styles.intro}dangerouslySetInnerHTML={createMarkup()} />
            <button className={styles.button} onClick={()=>navigate("/nearPlace",{state:{id:contentId}})}>주변보기</button>
            </div>
            
        </div>
    )
}
export default Gather_new