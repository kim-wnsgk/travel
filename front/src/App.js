import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainTest from "./routes/MainTest.js";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Main from "./routes/Main.js";
import Mypage from "./routes/Mypage.js";
import Class from "./routes/Class.js";
import Login from "./routes/Login.js";
import Register from "./routes/Register.js";
import AddSchedule from "./routes/AddSchedule.js";

import Admin from "./routes/Admin.js";

import SearchDetail from "./routes/SearchDetail.js";

import RegionMain from "./routes/region/RegionMain";
import Regions from "./routes/region/Regions";
import RegionDetail from "./routes/region/RegionDetail";
import RegionAttraction from "./routes/region/RegionAttraction";

import BoardList from "./routes/board/BoardList.js";
import BoardView from "./routes/board/BoardView.js";
import BoardWrite from "./routes/board/BoardWrite.js";
import BoardList_party from "./routes/board_party/BoardList_party.js";
import BoardView_party from "./routes/board_party/BoardView_party.js";
import BoardWrite_party from "./routes/board_party/BoardWrite_party.js";

import Recommand from "./routes/recommand/Recommand.js";
import RecommandDetail from "./routes/recommand/RecommandDetail.js";
import Gathering from "./routes/gathering/Gathering.js";
import Gather_modi from "./routes/gathering/Gather_modi.js";
import Gather_new from "./routes/gathering/Gather_new.js";
import Floating from "./routes/schedule/Floating.js"
import AddSch from "./routes/schedule/AddSch.js";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Main />} />
        {/* 개발 초기 테스트용 페이지 전환할때 사용 */}
        <Route path="/main" element={<MainTest />} />
        {/* 추후에 path="/" 으로 변경 */}
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/class" element={<Class />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addschedule" element={<AddSchedule />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/searchDetail" element={<SearchDetail />} />

        <Route path="/regionmain" element={<RegionMain />} />
        <Route path="/regions" element={<Regions />} />
        <Route path="/regiondetail" element={<RegionDetail />} />
        <Route path="/regionattraction" element={<RegionAttraction />} />

        <Route path="/BoardList" element={<BoardList />} />
        <Route path="/BoardView" element={<BoardView />} />
        <Route path="/BoardWrite" element={<BoardWrite />} />
        <Route path="/BoardList_party" element={<BoardList_party />} />
        <Route path="/BoardView_party" element={<BoardView_party />} />
        <Route path="/BoardWrite_party" element={<BoardWrite_party />} />

        <Route path="/recommand" element={<Recommand />} />
        <Route path="/recommanddetail" element={<RecommandDetail />} />
        <Route path="/gathering" element={<Gathering />} />
        <Route path="/gather_modi" element={<Gather_modi />} />
        <Route path="/gather_new" element={<Gather_new />} />
        <Route path="/addSch" element={<AddSch/>} />
        <Route path="/floating" element={<Floating />} />
      </Routes>
    </Router>
  );
}

export default App;
