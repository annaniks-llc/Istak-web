'use client'
import React from "react";
import styles from "./subscribe.module.scss";
import Button from "../../../Button";
import Input from "../../../Input";


function Subscribe() {

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Բաժանորդագրվեք ISTAK-ի նորություններին</h3>
            <div className={styles.inputs}>
                <div className={styles.inputContainer}>
                    <Input placeholder="Անուն" />
                </div>
                <div className={styles.inputContainer}>
                <Input placeholder="Ազգանուն" />
                </div>
                <div className={styles.inputContainer}>
                <Input placeholder="Ծննդյան ամսաթիվ ՕՕ/ԱԱ/ՏՏՏՏ" />
                </div>
                <div className={styles.inputContainer}>
                <Input placeholder="Էլ․ հասցե*" />
                </div>
            </div>
            <p className={styles.description1}>Սեղմելով «Ուղարկել» կոճակը՝ համաձայնվում եմ ստանալ անձնականացված հաղորդագրություններ ISTAK-ից և մասնակցելու բացառիկ միջոցառումների հրավերներին։ Լավագույն սպասարկման համար հասկանում եմ, որ իմ տվյալները մշակվելու են և կարող են օգտագործվել ISTAK ապրանքանիշի և նրա գործընկերների կողմից։</p>
            <p className={styles.description2}>Ցանկացած պահի կարող եք հրաժարվել բաժանորդագրությունից՝ օգտվելով մեր կողմից տրամադրվող unsubscribe մեխանիզմից։ Լրացուցիչ տեղեկությունների համար այցելեք մեր Գաղտնիության քաղաքականություն էջը։»</p>
            <Button text="Ուղարկել" variant="primary" onClick={() => { }} />

        </div>
    );
}

export default Subscribe;
