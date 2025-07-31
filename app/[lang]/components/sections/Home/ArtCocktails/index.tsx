'use client'
import React from "react";
import styles from "./artcocktails.module.scss";
import Button from "../../../Button";


function ArtCocktails() {

    return (
        <div className={styles.container}>
            <img className={styles.image} src="/img/png/artImg.png"/>
            <div className={styles.learnMore}>
                <h3 className={styles.title}>LImited Edition</h3>
                <p className={styles.description}>202 Dry Gin Բացահայտեք արվեստի և համի բացառիկ համադրությունը։
                    Այս սահմանափակ թողարկմամբ 202 Dry Gin-ը ստեղծվել է հայ ճանաչված նկարիչ Տիգրան Ցիտողծյանի հեղինակած արտիստիկ պիտակով՝ ընդգծելու մեր ջինի վարպետությունն ու նրբագեղությունը։</p>
                <Button text="Իմանալ ավելին" variant="primary" onClick={() => { }} />
            </div>

        </div>
    );
}

export default ArtCocktails;
