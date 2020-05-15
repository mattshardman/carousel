import React, { ButtonHTMLAttributes } from "react";
import styles from "./carousel.module.css";

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
  const unit = 3;
  const SPEED = 0.2;
  const divisor = children.length * 3;

  const initialShift = -Math.abs(children.length);
  const initialAmount = -Math.abs((100 / divisor) * initialShift);

  const [disableButtons, setDisableButtons] = React.useState(false);
  const [shift, setShift] = React.useState(0);
  const [amount, setAmount] = React.useState(initialAmount);
  const [target, setTarget] = React.useState(initialAmount);
  const [direction, setDirection] = React.useState<"left" | "right">("right");

  const requestRef = React.useRef<any>();
  const previousTimeRef = React.useRef<any>();

  const checkCompleted = () => {
    const absShift = Math.abs(shift);
    const rotationCompleted = absShift >= children.length;

    if (rotationCompleted) {
      setAmount(initialAmount);
      setTarget(initialAmount);
      setShift(0);
    }
  };

  const animate = (time: number) => {
    if (previousTimeRef.current != undefined) {
      if (direction === "right") {
        setAmount((prevCount) => {
          const movementAmount = prevCount - (100 / divisor) * SPEED;

          const hasReachedTarget =
            Math.round(movementAmount * 1000) <= Math.round(target * 1000);

          if (hasReachedTarget) {
            setDisableButtons(false);
            cancelAnimationFrame(requestRef.current);
            checkCompleted();
            return movementAmount;
          }
          requestAnimationFrame(animate);
          return movementAmount;
        });
      }

      if (direction === "left") {
        setAmount((prevCount) => {
          const movementAmount = prevCount + (100 / divisor) * SPEED;

          const hasReachedTarget =
            Math.floor(movementAmount * 1000) >= Math.floor(target * 1000);

          if (hasReachedTarget) {
            setDisableButtons(false);
            cancelAnimationFrame(requestRef.current);
            checkCompleted();
            return movementAmount;
          }
          requestAnimationFrame(animate);
          return movementAmount;
        });
      }
    } else {
      previousTimeRef.current = time;
      requestAnimationFrame(animate);
    }
  };

  React.useEffect(() => {
    if (target !== amount) {
      requestAnimationFrame(animate);
    }
  }, [target]);

  const handleLeft = () => {
    setDisableButtons(true);
    setShift((prev) => prev + unit);
    setDirection("left");
    setTarget(amount + (100 / divisor) * unit);
  };

  const handleRight = () => {
    setDisableButtons(true);
    setShift((prev) => prev - unit);
    setDirection("right");
    setTarget(amount - (100 / divisor) * unit);
  };

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
          <>
            {children}
            {children}
            {children}
          </>
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
