'use client'
import React, { useRef } from "react";
import styles from "./productCard.module.scss";

interface IProductCard {
    src:string, title:string, prise:number, volume:number
}

function ProductCard({src, title, prise, volume}:IProductCard) {
    
    return (
        <div className={styles.item}>
            <div className={styles.imageCont}>
            <img src={ src } className={styles.image}/>

            </div>
            <div className={styles.bottom}>
                <span className={styles.title}>{title}</span>
                <div>
                <span className={styles.volume}>{prise} դր {volume} լ</span>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
