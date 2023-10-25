import React, { useState } from "react";

interface Intervals {
  xIntervals: React.ReactNode[];
  yIntervals: React.ReactNode[];
}

const Simulation = () => {
  const windowSize = { width: 800, height: 800 };

  const [objects, setObjects] = useState([
    { id: 1, positions: { x: 0, y: 0 }, init_v: { x: 0, y: 0 } },
  ]);

  const defaultCoSystem = { x: windowSize.width / 2, y: windowSize.height / 2 };
  const [coordinateSystem, setCoordinateSystem] = useState(defaultCoSystem);

  const [isDragging, setIsDragging] = useState(false);

  const [dragInitPos, setDragInitPos] = useState({ x: 0, y: 0 });

  const [axisIntervals, setAxisIntervals] = useState(10);

  const intervals: Intervals = {
    xIntervals: [],
    yIntervals: [],
  };

  for (let i = 1; i < axisIntervals - 1; i++) {
    const xPosition = ((coordinateSystem.x * 2) / axisIntervals) * (i + 1);
    const yPosition = ((coordinateSystem.y * 2) / axisIntervals) * (i + 1);

    if (xPosition - coordinateSystem.x !== 0) {
      intervals.xIntervals.push(
        <div
          key={`x-${i}`}
          className="axis-interval"
          style={{
            top: -3,
            left: xPosition,
          }}
        >
          {" "}
          <div className="axis-interval-label">
            {Number(xPosition - coordinateSystem.x).toFixed(2)}
          </div>
        </div>
      );
    }

    if (yPosition - coordinateSystem.y !== 0) {
      intervals.yIntervals.push(
        <div
          key={`y-${i}`}
          className="axis-interval"
          style={{
            left: -3,
            top: yPosition,
          }}
        >
          {" "}
          <div className="axis-interval-label">
            {Number(yPosition - coordinateSystem.y).toFixed(2)}
          </div>
        </div>
      );
    }

    //   const intervals = { x: [], y: [] };

    //   for (let i = 1; i < axisIntervals - 1; i++) {
    //     const xPosition = ((coordinateSystem.x * 2) / axisIntervals) * (i + 1);
    //     const yPosition = ((coordinateSystem.x * 2) / axisIntervals) * (i + 1);
    //     const xIntervals =
    //       xPosition - coordinateSystem.x === 0 ? (
    //         <div></div>
    //       ) : (
    //         <div
    //           key={`x-${i}`}
    //           className="axis-interval"
    //           style={{
    //             top: -3,
    //             left: xPosition,
    //           }}
    //         >
    //           {" "}
    //           <div className="axis-interval-label">
    //             {Number(xPosition - coordinateSystem.x).toFixed(2)}
    //           </div>
    //         </div>
    //       );
    //     const yIntervals =
    //       yPosition - coordinateSystem.y === 0 ? null : (
    //         <div
    //           key={`y-${i}`}
    //           className="axis-interval"
    //           style={{
    //             top: -3,
    //             left: yPosition,
    //           }}
    //         >
    //           {" "}
    //           <div className="axis-interval-label">
    //             {Number(yPosition - coordinateSystem.x).toFixed(2)}
    //           </div>
    //         </div>
    //       );
    //     intervals.x.push(xIntervals);
    //     intervals.y.push(yIntervals);
    //   }

    //   const xIntervals = Array.from({ length: axisIntervals - 1 }, (_, i) => {
    //     const position = ((coordinateSystem.x * 2) / axisIntervals) * (i + 1);
    //     return position - coordinateSystem.x === 0 ? null : (
    //       <div
    //         key={i}
    //         className="axis-interval"
    //         style={{
    //           top: -3,
    //           left: position,
    //         }}
    //       >
    //         {" "}
    //         <div className="axis-interval-label">
    //           {Number(position - coordinateSystem.x).toFixed(2)}
    //         </div>
    //       </div>
    //     );
    //   });
    //   const yIntervals = Array.from({ length: axisIntervals - 1 }, (_, i) => {
    //     const position = ((coordinateSystem.y * 2) / axisIntervals) * (i + 1);
    //     // const roundedPosition = Number(position.toFixed(2));
    //     return position - coordinateSystem.y === 0 ? null : (
    //       <div
    //         key={i}
    //         className="axis-interval"
    //         style={{
    //           left: -3,
    //           top: position,
    //         }}
    //       >
    //         {" "}
    //         <div className="axis-interval-label">
    //           {Number(position - coordinateSystem.y).toFixed(2)}
    //         </div>
    //       </div>
    //     );
    //   });

    const handleAxisIntervals = (event) => {
      setAxisIntervals(Number(event.target.value));
    };

    const handleMouseDown = (event) => {
      setIsDragging(true);
      setDragInitPos({ x: event.clientX, y: event.clientY });
    };

    const handleMouseMove = (event) => {
      if (isDragging) {
        const x = event.clientX;
        const y = event.clientY;

        const offsetX = dragInitPos.x - x;
        const offsetY = dragInitPos.y - y;
        setCoordinateSystem({
          x: coordinateSystem.x - offsetX * 0.1,
          y: coordinateSystem.y - offsetY * 0.1,
        });
      }
    };

    const handleMouseUp = (event) => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }

    return (
      <>
        <div
          className="simulation-window"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseDown={handleMouseDown}
          style={{ width: windowSize.width, height: windowSize.height }}
        >
          <div className="axis x-axis" style={{ top: coordinateSystem.y }}>
            x-axis
            {intervals.xIntervals}
          </div>
          <div className="axis y-axis" style={{ left: coordinateSystem.x }}>
            y-axis
            {intervals.yIntervals}
          </div>
          {/* <div
        className="axis-0"
        style={{ top: coordinateSystem.y - 2, left: coordinateSystem.x - 2 }}
      ></div> */}
        </div>
        <div className="simulation-settings">
          {" "}
          <label htmlFor="#axis-intervals">Axis intervals</label>
          <input
            id="axis-intervals"
            type="number"
            value={axisIntervals}
            onChange={handleAxisIntervals}
            min="0"
          />
          <button onChange={() => setCoordinateSystem(defaultCoSystem)}>
            Center axis
          </button>
        </div>
      </>
    );
  }
};

export default Simulation;
