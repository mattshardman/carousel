import React, { ButtonHTMLAttributes } from "react";
import Carousel from "./Carousel";

import styles from "./component.module.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const LeftButton: React.FC<Props> = (props) => <button {...props}>Left</button>;
const RightButton: React.FC<Props> = (props) => (
  <button {...props}>Right</button>
);

const Component: React.FC = () => (
  <div className={styles.component}>
    <Carousel LeftButton={LeftButton} RightButton={RightButton}>
      <div className={styles.square}>
        <img
          src="https://www.pinclipart.com/picdir/middle/13-136062_coa-illustration-shield-triangular-svg-shield-clipart.png"
          alt=""
          height={300}
          width={300}
        />
      </div>
      <div className={styles.square}>2</div>
      <div className={styles.square}>3</div>
      <div className={styles.square}>4</div>
      <div className={styles.square}>5</div>
      <div className={styles.square}>6</div>
      <div className={styles.square}>7</div>
      <div className={styles.square}>8</div>
      <div className={styles.square}>9</div>
      <div className={styles.square}>10</div>
      <div className={styles.square}>11</div>
      <div className={styles.square}>12</div>
    </Carousel>
  </div>
);

export default Component;
