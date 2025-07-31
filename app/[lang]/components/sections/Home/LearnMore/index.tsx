'use client'
import React, { useRef } from "react";
import styles from "./learnMore.module.scss";
import ProductCard from "../../../ProductCard";
import Button from "../../../Button";


function LearnMore() {

    return (
        <div className={styles.container}>
            <div className={styles.learnMore}>
                <h3 className={styles.title}>LImited Edition</h3>
                <p className={styles.description}>202 Dry Gin Բացահայտեք արվեստի և համի բացառիկ համադրությունը։
                    Այս սահմանափակ թողարկմամբ 202 Dry Gin-ը ստեղծվել է հայ ճանաչված նկարիչ Տիգրան Ցիտողծյանի հեղինակած արտիստիկ պիտակով՝ ընդգծելու մեր ջինի վարպետությունն ու նրբագեղությունը։</p>
                <Button text="Իմանալ ավելին" variant="primary" onClick={() => { }} />
            </div>
            <img className={styles.image} src="/img/png/learnMoreImg.png"/>

        </div>
    );
}

export default LearnMore;
