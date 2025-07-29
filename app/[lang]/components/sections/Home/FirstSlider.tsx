'use client'
import React, { useRef } from "react";
import Slider from "react-slick";
import styles from "./firstSlider.module.scss";

function FirstSlider() {
    const sliderRef = useRef<Slider>(null);
    const next = () => {
        sliderRef.current?.slickNext();
    };
    const previous = () => {
        sliderRef.current?.slickPrev();
    };
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    return (
        <div className={styles.containerForFirstSection}>
            <div className={styles.sliderContainer}>
                <Slider
                    ref={sliderRef}
                    {...settings}
                >
                    <div key={1}>
                        <h3>ISTAK - Ավանդույթի ուժով</h3>
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
    );
}

export default FirstSlider;
