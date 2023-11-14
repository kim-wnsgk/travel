import { useState } from 'react';
import axios from 'axios';
import styles from './AddRegion.module.css'
import Header from '../../components/Header';
import categoryData, { region } from "../datas";

function AddRegion() {
    const [title, setTitle] = useState('');
    const [addr, setAddr] = useState('');
    const [cat, setCat] = useState('');
    const [selectedCat, setSelectedCat] = useState("A01010600");

    console.log(selectedCat);
    const onTitleChange = (e) => {
        setTitle(e.target.value)
    }
    const onAddrChange = (e) => {
        setAddr(e.target.value)
    }
    const onCatChange = (e) => {
        setCat(e.target.value)
    }

    const handleCat = (value) => {
        setSelectedCat(value);
    };

    const insertData = () => {
        console.log(title, addr, selectedCat, cat)
        axios
            .post(
                `http://localhost:3001/data/insertOne`, {
                title, addr, cat: selectedCat
            })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                <div className={styles.title}>
                    <span>장소명</span>
                    <input
                        type="text"
                        value={title}
                        onChange={onTitleChange}
                        placeholder="ex) 한라산"
                        className={styles.search}
                    />
                </div>
                <hr />

                <div className={styles.title}>
                    <span>주소</span>
                    <input
                        type="text"
                        value={addr}
                        onChange={onAddrChange}
                        placeholder="ex) 제주특별자치도 제주시 OO동 0번길 1"
                        className={styles.search}
                    />
                </div>
                <hr />

                <div className={styles.title}>
                    카테고리
                </div>
                {Object.keys(categoryData).map((topCategory) =>
                    Object.keys(categoryData[topCategory]).map((midCategory) => (
                        categoryData[topCategory][midCategory].title ?
                            <div
                                key={midCategory}
                                className={`${styles.cat} ${selectedCat === midCategory ? styles.selected : ""}`}
                                onClick={() => handleCat(midCategory)}
                            >
                                {categoryData[topCategory][midCategory]?.title}
                            </div> : <br />

                    ))
                )}
                <hr />

                <button className={styles.button} onClick={() => insertData()}>추가하기</button>
            </div>

        </div>
    );
}

export default AddRegion;