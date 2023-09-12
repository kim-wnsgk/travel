import styles from "./RegionMain.module.css";


function RegionMain() {
    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.side}>
                    <div className={styles.side_image}>
                        <div className={styles.regionImage}></div>
                        <p className={styles.regionName}>서울</p>
                    </div>
                    <div className={styles.side_image}>
                        <div className={styles.regionImage}></div>
                        <p className={styles.regionName}>서울</p>
                    </div>
                    <div className={styles.side_image}>
                        <div className={styles.regionImage}></div>
                        <p className={styles.regionName}>서울</p>
                    </div>
                    <div className={styles.side_image}>
                        <div className={styles.regionImage}></div>
                        <p className={styles.regionName}>서울</p>
                    </div>
                </div>
                <div className={styles.center}></div>
                <div className={styles.side}>
                    <div className={styles.side_image}>
                        <div className={styles.regionImage}></div>
                        <p className={styles.regionName}>서울</p>
                    </div>
                    <div className={styles.side_image}>
                        <div className={styles.regionImage}></div>
                        <p className={styles.regionName}>서울</p>
                    </div>
                    <div className={styles.side_image}>
                        <div className={styles.regionImage}></div>
                        <p className={styles.regionName}>서울</p>
                    </div>
                    <div className={styles.side_image}>
                        <div className={styles.regionImage}></div>
                        <p className={styles.regionName}>서울</p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default RegionMain;