import React, { ButtonHTMLAttributes } from "react";
import Carousel from "./Carousel";

import styles from "./component.module.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const LeftButton: React.FC<Props> = (props) => <button style={{ width: 100 }} {...props}>Left</button>;
const RightButton: React.FC<Props> = (props) => (
  <button style={{ width: 100 }} {...props}>Right</button>
);

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const Component: React.FC = () => (
  <div className={styles.component}>
    <Carousel
      LeftButton={LeftButton}
      RightButton={RightButton}
      speed={5}
      infinite={false}
    >
      {arr.map((each, i) => {
        return (
          <div className={styles.square} key={each}>
            {i}
          </div>
        );
      })}
    </Carousel>
  </div>
);

export default Component;
