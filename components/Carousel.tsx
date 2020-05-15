import React, { ButtonHTMLAttributes } from "react";
import styles from "./carousel.module.css";
import useCarousel from "./useCarousel";

interface Props {
  children: React.ReactNodeArray;
  LeftButton: React.FC<ButtonProps>;
  RightButton: React.FC<ButtonProps>;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

interface PaginationProps {
  length: number;
  unit: number;
  shift: number;
}

const Pagination: React.FC<PaginationProps> = ({ length, unit, shift }) => (
  <div className={styles.pagination}>
    <span className={styles.dots}>
      {[...Array(length / unit)].map((_, i) => {
        if (i * unit === Math.abs(shift) % length) {
          return <div key={i} className={styles.dotActive} />;
        }
        return <div key={i} className={styles.dot} />;
      })}
    </span>
  </div>
);

const Carousel: React.FC<Props> = ({ children, LeftButton, RightButton }) => {
  const { state, api } = useCarousel({ children });

  const { amount, shift, unit, disableButtons } = state;
  const { handleLeft, handleRight } = api;

  return (
    <div className={styles.component}>
      <span className={styles.button}>
        <LeftButton onClick={handleLeft} disabled={disableButtons} />
      </span>

      <div className={styles.carousel}>
        <div
          className={styles.slider}
          style={{
            transform: `translate(${amount}%)`,
          }}
        >
          {children}
          {children}
          {children}
        </div>
      </div>

      <span className={styles.button}>
        <RightButton onClick={handleRight} disabled={disableButtons} />
      </span>

      <Pagination length={children.length} unit={unit} shift={shift} />
    </div>
  );
};

export default Carousel;
