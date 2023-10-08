import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Main from "./routes/Main.js";

import Mypage from "./routes/user/Mypage.js";
import Login from "./routes/user/Login.js";
import Register from "./routes/user/Register.js";
import Map from "./routes/schedule/MapSch.js"
import Admin from "./routes/Admin.js";

import SearchDetail from "./routes/SearchDetail.js";

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

import Schedule from "./routes/schedule/Schedule.js";
import ScheduleInfo from "./routes/schedule/ScheduleInfo.js";
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

        <Route path="/mypage" element={<Mypage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/searchDetail" element={<SearchDetail />} />
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

        <Route path="/schedule" element={<Schedule />} />
        <Route path="/schedule/info/:id" element={<ScheduleInfo />} />
        <Route path="/addSch" element={<AddSch />} />
        <Route path="/floating" element={<Floating />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </Router>
  );
}

export default App;
