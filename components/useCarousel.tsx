import React from "react";

interface Props {
  length: number;
  steps: number;
  speed: number;
  infinite: boolean;
}

const useCarousel = ({ length, steps, speed, infinite }: Props) => {
  const unit = steps;
  const SPEED = speed / 100;
  const divisor = length * 3;

  const initialShift = -Math.abs(length);
  const initialAmount = -Math.abs((100 / divisor) * initialShift);

  const [disableButtons, setDisableButtons] = React.useState({
    left: !infinite,
    right: false,
  });
  const [shift, setShift] = React.useState(0);
  const [direction, setDirection] = React.useState<"left" | "right">("right");

  const [amount, setAmount] = React.useState(initialAmount);
  const [target, setTarget] = React.useState(initialAmount);

  const requestRef = React.useRef<any>();
  const previousTimeRef = React.useRef<any>();

  const checkCompletedRotation = () => {
    const absShift = Math.abs(shift);
    const rotationCompleted = absShift >= length;

    if (rotationCompleted) {
      setAmount(initialAmount);
      setTarget(initialAmount);
      setShift(0);
    }
  };

  const checkReachedEnd = () => {
    const absShift = Math.abs(shift);
    const reachedEnd = absShift + 1 >= length; 

    if (reachedEnd && direction === "right") {
      setDisableButtons({ left: false, right: true });
    }

    if (!absShift) {
      setDisableButtons({ left: true, right: false });
    }
  }

  const animate = (time: number) => {
    if (previousTimeRef.current != undefined) {
      if (direction === "right") {
        setAmount((prevCount) => {
          const movementAmount = prevCount - (100 / divisor) * SPEED;

          const hasReachedTarget =
            Math.round(movementAmount * 1000) <= Math.round(target * 1000);

          if (hasReachedTarget) {
            setDisableButtons({ left: false, right: false });
            cancelAnimationFrame(requestRef.current);
            infinite ? checkCompletedRotation() : checkReachedEnd();
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
            setDisableButtons({ left: false, right: false });
            cancelAnimationFrame(requestRef.current);
            infinite ? checkCompletedRotation() : checkReachedEnd();
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
    setDisableButtons({ left: true, right: true });
    setShift((prev) => prev + unit);
    setDirection("left");
    setTarget(amount + (100 / divisor) * unit);
  };

  const handleRight = () => {
    setDisableButtons({ left: true, right: true });
    setShift((prev) => prev - unit);
    setDirection("right");
    setTarget(amount - (100 / divisor) * unit);
  };

  const state = {
    amount,
    unit,
    shift,
    disableButtons,
  };

  const api = {
    handleLeft,
    handleRight,
  };

  return { state, api };
};

export default useCarousel;
