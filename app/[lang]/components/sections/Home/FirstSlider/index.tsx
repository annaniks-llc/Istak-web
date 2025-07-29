'use client'
import React, { useRef } from "react";
import Slider from "react-slick";
import styles from "./firstSlider.module.scss";
import Button from "../../../Button";

function FirstSlider() {
    const sliderRef = useRef<Slider>(null);
    const next = () => {
        sliderRef.current?.slickNext();
    };
    const previous = () => {
        sliderRef.current?.slickPrev();
    };
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows:false
    };
    return (
        <div className={styles.containerForFirstSection}>
            <div className={styles.container}>
            <div className={styles.sliderContainer}>
                <Slider
                    ref={sliderRef}
                    {...settings}
                >
                    <div key={1} className={styles.sliderItem}>
                        <h3 className={styles.heading}>ISTAK - Ավանդույթի ուժով</h3>
                        <p className={styles.title}>Հայկական վարպետությամբ ստեղծված բարձրորակ օղի  ևվ ալկոհոլային խմիչքներ</p>
                    
    <div className={styles.buttonContainer}>
    <Button text={"Գնել հիմա"} variant="secondary" onClick={() => { }}/>                   
    </div>
     </div>
                    <div key={2}>
                        <h3>2</h3>
                    </div>
                    <div key={3}>
                        <h3>3</h3>
                    </div>
                    <div key={4}>
                        <h3>4</h3>
                    </div>
                    <div key={5}>
                        <h3>5</h3>
                    </div>
                    <div key={6}>
                        <h3>6</h3>
                    </div>
                </Slider>
            </div>
            <div className={styles.sliderButtons}>
                <button className={styles.sliderButton} onClick={previous}>
                    <img src='/img/svg/arrowleft.svg' alt="arrowleft" />
                </button>
                <button className={styles.sliderButton} onClick={next}>
                    <img src='/img/svg/arrowRight.svg' alt="arrowRight" />
                </button>
            </div>
            </div>
        </div>
    );
}

export default FirstSlider;
