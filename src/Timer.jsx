import React, { useState, useEffect } from "react";

export default function Timer(props){
  const [milliseconds, setMilliseconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval;

    

    if (isActive) {
      interval = setInterval(() => {
        setMilliseconds((prevMilliseconds) => prevMilliseconds + 10);
      }, 10);
    } else if (!isActive && milliseconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, milliseconds]);

  
  useEffect(() => {
    if (props.win) {
      setIsActive(false);
    } else if (props.start) {
      setIsActive(true);
    }
  }, [props.win, props.start]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const milliseconds = Math.floor((ms % 1000) / 10);
    const formattedMilliseconds = milliseconds < 10 ? `0${milliseconds}` : milliseconds;
    return `${minutes}:${formattedSeconds}:${formattedMilliseconds}`;
  };

  return (
    <div>
      <div>{formatTime(milliseconds)}</div>
    </div>
  );
};

