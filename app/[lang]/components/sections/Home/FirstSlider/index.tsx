'use client';
import React, { useRef, useState } from 'react';
import Slider from 'react-slick';
import ReactPlayer from "react-player";
import { motion } from 'framer-motion';
import styles from './firstSlider.module.scss';
import Button from '../../../Button';

function FirstSlider() {
  const sliderRef = useRef<Slider>(null);
  const next = () => sliderRef.current?.slickNext();
  const previous = () => sliderRef.current?.slickPrev();

  const [play, setPlay] = useState(false);
  const videoRef = useRef(null);

  const videoPlay = () => {
    const player = videoRef.current;
    if (player) {
      // @ts-ignore
      const internalPlayer = player.getInternalPlayer();
      if (internalPlayer?.playVideo) internalPlayer.playVideo();     // YouTube
      else if (internalPlayer?.play) internalPlayer.play();          // MP4/MOV
    }
    setPlay(true);
  };

  const videoStop = () => {
    const player = videoRef.current;
    if (player) {
      // @ts-ignore
      const internalPlayer = player.getInternalPlayer();
      if (internalPlayer?.pauseVideo) internalPlayer.pauseVideo();   // YouTube
      else if (internalPlayer?.pause) internalPlayer.pause();        // MP4/MOV
    }
    setPlay(false);
  };


  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };
  const array = [
    {
      title: "ISTAK - Ավանդույթի ուժով",
      description: "Հայկական վարպետությամբ ստեղծված բարձրորակ օղի և ալկոհոլային խմիչքներ",
      src: "/img/png/sliderImg.png",
      buttonTitle: "Գնել հիմա",
      type: "image"
    },
    {
      title: "ISTAK - Ավանդույթի ուժով",
      description: "Հայկական վարպետությամբ ստեղծված բարձրորակ օղի և ալկոհոլային խմիչքներ",
      src: "https://www.youtube.com/watch?v=c6GV_vRlIIA",
      buttonTitle: "Գնել հիմա",
      type: "video"
    }
  ]

  return (
    <>
      <Slider ref={sliderRef} {...settings}>
        {array.map((el, ind) => {
          return <div key={ind} className="player-wrapper">

            <div className={styles.containerForFirstSection} style={{ backgroundImage: "url(" + el.src + ")" }}>
              {el.type === "video" && <ReactPlayer
                // @ts-ignore
                url="https://www.youtube.com/watch?v=c6GV_vRlIIA"
                className="reactPlayer"
                width={"100%"}
                height={"100%"}
              />}
              <div className={styles.container}>
                <motion.div
                  className={styles.sliderContainer}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  viewport={{ once: true, amount: 0.4 }}
                >
                  <div key={1} className={styles.sliderItem}>
                    <h3 className={styles.heading}>{el.title}</h3>
                    <p className={styles.title}>{el.description}</p>
                    <div className={styles.buttonContainer}>
                      <Button text={el.buttonTitle} variant="secondary" onClick={() => { }} />
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className={styles.sliderButtons}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  viewport={{ once: true, amount: 0.4 }}
                >
                  <button className={styles.sliderButton} onClick={previous}>
                    <img src="/img/svg/arrowleft.svg" alt="arrowleft" />
                  </button>
                  <button className={styles.sliderButton} onClick={next}>
                    <img src="/img/svg/arrowRight.svg" alt="arrowRight" />
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        })}

      </Slider>
    </>
    // <div className={styles.containerForFirstSection}>
    //   <div className={styles.container}>
    //     <motion.div
    //       className={styles.sliderContainer}
    //       initial={{ opacity: 0, y: 50 }}
    //       whileInView={{ opacity: 1, y: 0 }}
    //       transition={{ duration: 0.8, ease: 'easeOut' }}
    //       viewport={{ once: true, amount: 0.4 }}
    //     >
    //       <Slider ref={sliderRef} {...settings}>
    //         <div key={1} className={styles.sliderItem}>
    //           <h3 className={styles.heading}>ISTAK - Ավանդույթի ուժով</h3>
    //           <p className={styles.title}>Հայկական վարպետությամբ ստեղծված բարձրորակ օղի և ալկոհոլային խմիչքներ</p>
    //           <div className={styles.buttonContainer}>
    //             <Button text="Գնել հիմա" variant="secondary" onClick={() => { }} />
    //           </div>
    //         </div>

    //         {/* Optional: Other slides */}
    //       </Slider>
    //     </motion.div>

    //     <motion.div
    //       className={styles.sliderButtons}
    //       initial={{ opacity: 0, x: 50 }}
    //       whileInView={{ opacity: 1, x: 0 }}
    //       transition={{ duration: 0.6, ease: 'easeOut' }}
    //       viewport={{ once: true, amount: 0.4 }}
    //     >
    //       <button className={styles.sliderButton} onClick={previous}>
    //         <img src="/img/svg/arrowleft.svg" alt="arrowleft" />
    //       </button>
    //       <button className={styles.sliderButton} onClick={next}>
    //         <img src="/img/svg/arrowRight.svg" alt="arrowRight" />
    //       </button>
    //     </motion.div>
    //   </div>
    // </div>
  );
}

export default FirstSlider;
