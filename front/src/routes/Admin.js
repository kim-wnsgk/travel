import axios from "axios";
import { useState } from "react";

import Header from "../components/Header";

function Admin() {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const [data, setData] = useState([]);
  const insertData = async () => {
    try {
      const typeId = [12, 14, 28, 38, 39]; // 차례대로 관광지, 문화시설, 레포츠, 쇼핑, 음식점
      const responseData = [];
      for (const id of typeId) {
        const response = await axios.get(
          `https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=${API_KEY}&numOfRows=100000&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A&mapX=126.981611&mapY=37.568477&radius=100000000&contentTypeId=${id}`
        );
        const resData = response.data.response.body.items.item;
        console.log(`${id}에서 ${resData.length}개의 데이터를 받아왔습니다.`); // 받아온 데이터
        responseData.push(...resData);
      }

      setData(responseData);
      await axios.post("http://localhost:3001/data/insert", {
        data,
      });
      console.log("데이터 삽입 성공!");
    } catch (error) {
      console.error(`데이터 삽입 중 에러 발생: ${error}`);
    }
  };

  const showData = () => {
    axios.get("http://localhost:3001/data/show").then(function (response) {
      console.log(response.data.length + "개의 데이터 : ");
      console.log(response.data);
    });
  };

  const initData = () => {
    axios.get("http://localhost:3001/data/init").then(function (response) {
      console.log(response);
    });
  };

  const insertFestival = async () => {
    console.log("1111");
    try {
      console.log("2222");
      const response = await axios.get(
        `https://apis.data.go.kr/B551011/KorService1/searchFestival1?serviceKey=${API_KEY}&numOfRows=1000&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A&eventStartDate=${20230520}`
      );
      console.log("3333");
      console.log(response);
      const resData = response.data.response.body.items.item;
      console.log("4444");
      console.log(`${resData.length}개의 데이터를 받아왔습니다.`); // 받아온 데이터

      await axios.post("http://localhost:3001/festival/insert", {
        data: resData,
      });
      console.log("데이터 삽입 성공!");
    } catch (error) {
      console.error(`데이터 삽입 중 에러 발생: ${error}`);
    }
  };

  const showFestival = () => {
    axios.get("http://localhost:3001/festival/show").then(function (response) {
      console.log(response.data.length + "개의 데이터 : ");
      console.log(response.data);
    });
  };

  const initFestival = () => {
    axios.get("http://localhost:3001/data/init").then(function (response) {
      console.log(response);
    });
  };

  return (
    <div>
      <Header />
      <div>
        <button onClick={() => insertData()}>data 삽입</button>
        <button onClick={() => showData()}>data 출력</button>
        <button onClick={() => initData()}>data 초기화</button>
      </div>
      <div>
        <button onClick={() => insertFestival()}>festival 삽입</button>
        <button onClick={() => showFestival()}>festival 출력</button>
        <button onClick={() => initFestival()}>festival 초기화</button>
      </div>
      <div>
        <button
          onClick={() => {
            const response = axios.get(
              `https://apis.data.go.kr/B551011/KorService1/searchFestival1?serviceKey=${API_KEY}&numOfRows=1000&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A&eventStartDate=${20230511}`
            );
            const resData = response.data.response.body.items.item;
          }}
        >
          분류 조회
        </button>
      </div>
    </div>
  );
}

export default Admin;
