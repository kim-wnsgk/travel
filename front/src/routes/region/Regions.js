import styles from "./css/Regions.module.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import categoryData, { region } from "../datas";
import axios from "axios";
import AddSch from "../schedule/AddSch";

import { AiOutlinePlusSquare } from "react-icons/ai";

import Pagination from "react-js-pagination";

import Header from "../../components/Header";

function Regions() {
    const navigate = useNavigate();
    const [selectedDo, setSelectedDo] = useState("");
  const [selectedSi, setSelectedSi] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [data, setData] = useState(null);
  const [dataLength, setDataLength] = useState(0);
  const [sightId, setSightId] = useState(0);
  const [page, setPage] = useState(1);
  const [items] = useState(7);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentName, setContentName] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleDo = (value) => {
    setSelectedDo(value);
    setSelectedSi("");
    setSelectedCat("");
  };

  const handleSi = (value) => {
    setSelectedSi(value);
    setSelectedCat("");
  };

  const handleCat = (value) => {
    setSelectedCat(value);
  };

  useEffect(() => {
    axios
      .post("http://localhost:3001/data/recommand", {
        cat: selectedCat ? selectedCat : "",
        region: selectedSi ? selectedSi : selectedDo ? selectedDo : "",
      })
      .then(function (response) {
        setData(response.data);
        setDataLength(response.data.length);
      });
  }, [selectedDo, selectedSi, selectedCat]);

  console.log(data)

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.contents}>
        <div className={styles.select}>
            <h2 className={styles.h2}>지역별 관광지 보기</h2>
            <div className={styles.regionSelect}>
            <div className={styles.do}>
              <div
                className={`${styles.doName} ${selectedDo === '' ? styles.selected : ""}`}
                onClick={() => handleDo("")}
              >
                전체
              </div>
              {region.map((item, index) => {
                const doName = Object.keys(item)[0];
                const cities = item[doName]; // 도시 배열 추출

                return (
                  <div
                    key={index}
                    className={`${styles.doName} ${selectedDo === doName ? styles.selected : ""}`}
                    onClick={() => handleDo(doName)}
                  >
                    {doName}
                  </div>
                );
              })}
            </div>
            {selectedDo && (
              <div className={styles.si}>
                <div
                  className={`${styles.siName} ${selectedSi === '' ? styles.selected : ""}`}
                  onClick={() => handleSi("")}
                >
                  전체
                </div>
                {region
                  .find((item) => Object.keys(item)[0] === selectedDo)[selectedDo]
                  .map((siName, index) => (
                    <div
                      key={index}
                      className={`${styles.siName} ${selectedSi === siName ? styles.selected : ""}`}
                      onClick={() => handleSi(siName)}
                    >
                      {siName}
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className={styles.categorySelect}>
            <div className={`${styles.cat} ${selectedCat === '' ? styles.selected : ""}`} onClick={() => handleCat("")}>
              전체
            </div>
            {Object.keys(categoryData).map((topCategory) =>
              Object.keys(categoryData[topCategory]).map((midCategory) => (
                <div
                  key={midCategory}
                  className={`${styles.cat} ${selectedCat === midCategory ? styles.selected : ""}`}
                  onClick={() => handleCat(midCategory)}
                >
                  {categoryData[topCategory][midCategory]?.title}
                </div>
              ))
            )}
          </div>
        </div>
        <div className={styles.datas}>
          <div className={styles.banner}>
            총{" "}
            <span style={{ color: "blue", fontWeight: "bold" }}>
              {dataLength}
            </span>
            개의 데이터가 존재합니다.
          </div>
          <div className={styles.lists}>
            {data &&
              data.slice(items * (page - 1), items * (page - 1) + items).map((item, index) => (
                <div key={index} className={styles.list}>
                  
                  <div className={styles.imgBox}onClick={() => {
                    navigate('/regiondetail', {
                        state: { data:item }
                      });
                }}>
                    <img src={item.image?item.image:'defaultImage.png'} className={styles.img} />
                  </div>
                  <div className={styles.cont}>
                    <h3 className={styles.title}onClick={() => {
                    navigate('/regiondetail', {
                        state: { data:item }
                      });
                }}>{item.title}</h3>
                    <div className={styles.title}onClick={() => {
                    navigate('/regiondetail', {
                        state: { data:item }
                      });
                }}>{item.addr}</div>
                    <div className={styles.cat}onClick={() => {
                    navigate('/regiondetail', {
                        state: { data:item }
                      });
                }}>
                    {categoryData[item.contentTypeId]?.title}{" "}
                    {categoryData[item.contentTypeId]?.[item.cat]?.title}
                    </div>
                    <AiOutlinePlusSquare 
                    className={styles.icon} 
                    size={'30px'}
                    onClick={()=>{
                      setIsModalOpen(true);
                      setSightId(item.contentId);
                      setContentName(item.title)
                    }}
                    />
                  </div>
                </div>
              ))}
          </div>
          <AddSch isOpen={isModalOpen} contentId={sightId} contentName={contentName} closeModal={closeModal} />
          <div className={styles.PaginationBox}>
            <Pagination
              className={styles.Pagination}
              activePage={page}
              itemsCountPerPage={items}
              totalItemsCount={dataLength - 1}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
              prevPageText={"<"}
              nextPageText={">"}
            ></Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Regions;
