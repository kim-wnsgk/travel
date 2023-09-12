import styles from "./css/Regions.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";

import Header from "../../components/Header";

function Dropdown() {
    //db로 받아오기

    return (
        <>
            {/*db map.data로 */}
            <li className={styles.dropdown}><Link to="/regiondetail">regiondetail</Link></li>
            <li className={styles.dropdown}>지역이름</li>
            <li className={styles.dropdown}>지역이름</li>
            <li className={styles.dropdown}>지역이름</li>
            <li className={styles.dropdown}>지역이름</li>
            <li className={styles.dropdown}>지역이름</li>
            <li className={styles.dropdown}>지역이름</li>
            <li className={styles.dropdown}>지역이름</li>
            <li className={styles.dropdown}>지역이름</li>
            <li className={styles.dropdown}>지역이름</li>
            <li className={styles.dropdown}>지역이름</li>
            <li className={styles.dropdown}>지역이름</li>
            <li className={styles.dropdown}>지역이름</li>
            <li className={styles.dropdown}>지역이름</li>
            <li className={styles.dropdown}>지역이름</li>
            <li className={styles.dropdown}>지역이름</li>
            <li className={styles.dropdown}>지역이름</li>

        </>
    )
}
function Regions() {
    const [view, setView] = useState(false);

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.regions}>강원도</div>
            <div className={styles.outline}>
                대한민국의 도. 서쪽으로 경기도, 남서쪽으로 충청북도, 남쪽으로 경상북도, 동쪽으로 동해 바다와 맞닿아 있으며 북쪽으로는 북한 강원도와 맞닿아 있다. 휴전선 이북 지역을 제외한 실질 행정구역은 7시 11군으로 총 18개 시군으로 이루어진다. 이름의 유래는 조선시대 강원도의 주요 지역이었던 강릉과 원주 두 지역의 앞 글자를 따온 것이다.
            </div>
            <div className="">
                <div className={styles.list}>
                    <div className={styles.list}>
                        <button className={styles.listInner}>지역1</button>
                        <button className={styles.listInner}>지역2</button>
                        <button className={styles.listInner}>지역3</button>
                        <button className={styles.listInner}>지역4</button>
                        <button className={styles.listInner}>
                            <ul className={styles.menu} onClick={() => { setView(!view) }}>
                                더 보기{" "}
                                {view ? '⌃' : '⌄'}
                                {view && <Dropdown />}
                            </ul>
                        </button>
                    </div>
                </div>
            </div>
            <div className={styles.sight}>
                {/* 여기는 map말고 그냥 배열 번호로 해야할듯 */}
                <div className={styles.bg}>
                    <div className={styles.sg}>
                        <div className={styles.imageBox}>사진 넣기</div>
                        <div className={styles.textBox}>명소 이름</div>
                    </div>
                    <div className={styles.sg}>
                        <div className={styles.imageBox}></div>
                        <div className={styles.textBox}></div>
                    </div>
                    <div className={styles.sg}>
                        <div className={styles.imageBox}></div>
                        <div className={styles.textBox}></div>
                    </div>
                    <div className={styles.sg}>
                        <div className={styles.imageBox}></div>
                        <div className={styles.textBox}></div>
                    </div>
                </div>
                <div className={styles.bg}>
                    <div className={styles.sg}>
                        <div className={styles.imageBox}></div>
                        <div className={styles.textBox}></div>
                    </div>
                    <div className={styles.sg}>
                        <div className={styles.imageBox}></div>
                        <div className={styles.textBox}></div>
                    </div>
                    <div className={styles.sg}>
                        <div className={styles.imageBox}></div>
                        <div className={styles.textBox}></div>
                    </div>
                    <div className={styles.sg}>
                        <div className={styles.imageBox}></div>
                        <div className={styles.textBox}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Regions;