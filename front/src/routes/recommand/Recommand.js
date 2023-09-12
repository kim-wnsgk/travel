import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import styles from "./css/Recommand.module.css";
import axios from "axios";
import { FaMonument } from "react-icons/fa"
import { AiFillShopping } from "react-icons/ai"
import { BiRun, BiSolidShoppingBags } from "react-icons/bi"
import { MdFastfood } from "react-icons/md"

import categoryData, { region } from "../datas";

function Recommand() {
  const navigate = useNavigate();

  const [selectedTopCategory, setSelectedTopCategory] = useState("");
  const [selectedMidCategory, setSelectedMidCategory] = useState("");

  const [resCount, setResCount] = useState(0);

  const handleTopCategorySelect = (topCategory) => {
    setSelectedTopCategory(topCategory);
    setSelectedMidCategory("");
  };

  const handleMidCategorySelect = (midCategory) => {
    setSelectedMidCategory(midCategory);
  };

  const [isRegion, setIsRegion] = useState(false);
  const [selectedDo, setSelectedDo] = useState("");
  const [selectedSi, setSelectedSi] = useState("");

  // 선택된 도 정보 변경 함수
  const handleDoSelect = (selectedDo) => {
    setSelectedDo(selectedDo);
    setSelectedSi(""); // 선택된 도 변경 시 선택된 시 초기화
  };

  // 선택된 시 정보 변경 함수
  const handleSiSelect = (selectedSi) => {
    setSelectedSi(selectedSi);
  };

  const initAll = () => {
    setSelectedTopCategory("");
    setSelectedMidCategory("");
    setSelectedDo("");
    setSelectedSi("");
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/data/recommand",
          {
            type: selectedTopCategory,
            cat: selectedMidCategory
              ? selectedMidCategory
              : "",
            region: selectedSi ? selectedSi : selectedDo ? selectedDo : "",
          }
        );
        setResCount(response.data.length);
      } catch (error) {
        console.log(error);
      }
    };

    console.log(categoryData)
    fetchData();
  }, [
    selectedTopCategory,
    selectedMidCategory,
    selectedDo,
    selectedSi,
  ]);

  return (
    <div>
      <Header />
      <div className={styles.contents}>
        <div>{resCount}개의 목적지가 존재합니다.</div>
        <div className={styles.regionSelect}>
          <div>지역을 선택하시겠습니까?</div>
          <div className={styles.selector}>
            <div className={styles.yesorno} onClick={() => setIsRegion(true)}>예</div>
            <div className={styles.yesorno} onClick={() => {
              setIsRegion(false);
              setSelectedDo("");
              setSelectedSi("");
            }
            }>아니오</div>
          </div>
          
          <div className={styles.regionContainer}>
            {isRegion && (
              <div className={styles.regionContainer}>
                <div className={styles.do}>
                  {region.map((item, index) => {
                    const doName = Object.keys(item)[0];
                    return (
                      <div
                        key={index}
                        className={`${styles.doName} ${selectedDo === doName ? styles.selected : ""}`}
                        onClick={() => handleDoSelect(doName)}
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
                      onClick={() => handleSiSelect("")}
                    >
                      전체
                    </div>
                    {region
                      .find((item) => Object.keys(item)[0] === selectedDo)[selectedDo]
                      .map((siName, index) => (
                        <div
                          key={index}
                          className={`${styles.siName} ${selectedSi === siName ? styles.selected : ""}`}
                          onClick={() => handleSiSelect(siName)}
                        >
                          {siName}
                        </div>
                      ))}
                  </div>
                )}
                
              </div>
            )}
          </div>
        </div>
        <div className={styles.topcat}>
          {Object.keys(categoryData).map((topCategory) => (
            <div 
              key={topCategory}
              className={`${styles.selectTopcat} ${selectedTopCategory === topCategory ? styles.selected : ""}`}
              onClick={() => handleTopCategorySelect(topCategory)}>
              <div className={styles.title}>
                {categoryData[topCategory].title}
              </div>
              {topCategory == 12 && <FaMonument size={'50px'}/>}
              {topCategory == 28 && <BiRun size={'50px'}/>}
              {topCategory == 38 && <AiFillShopping size={'50px'}/>}
              {topCategory == 39 && <MdFastfood size={'50px'}/>}
           </div>
          ))}
        </div>
        <div className={styles.midcat}>
          {selectedTopCategory &&
            Object.keys(categoryData[selectedTopCategory]).map(
              (midCategory) => (
                <div
                  key={midCategory}
                  className={`${styles.selectMidcat} ${selectedMidCategory === midCategory ? styles.selected : ""}`}
                  onClick={() => handleMidCategorySelect(midCategory)}
                >
                  {categoryData[selectedTopCategory][midCategory].title}
                </div>
              )
            )}
        </div>
        <button
          onClick={() => {
            console.log("type : " + selectedTopCategory + "\ncat : " + selectedMidCategory + "\nregion : " + selectedDo + selectedSi);
            axios.post("http://localhost:3001/data/recommand", {
              type: selectedTopCategory,
              cat: selectedMidCategory ? selectedMidCategory : "",
              region: selectedSi ? selectedSi : selectedDo ? selectedDo : "",
            })
              .then(function (response) {
                console.log(response.data.length + "개의 데이터 : ");
                try {
                  navigate('/recommandDetail', {
                    state: { datas: response.data }
                  });
                } catch (error) {
                  console.error(error);
                }
              });

          }}
        >
          검색
        </button>
        <button
          onClick={() => {
            initAll();
          }}
        >
          초기화
        </button>
      </div>
    </div>
  );
}

export default Recommand;
