import React from "react";

const useCarousel = ({ children, steps }) => {
  const unit = steps;
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
