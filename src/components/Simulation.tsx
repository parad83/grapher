import React, { useState } from "react";

const Simulation = () => {
  const windowSize = { width: 800, height: 800 };

  const [objects, setObjects] = useState([
    { id: 1, positions: { x: 0, y: 0 }, init_v: { x: 0, y: 0 } },
  ]);

  const defaultCoSystem = { x: windowSize.width / 2, y: windowSize.height / 2 };
  const [coordinateSystem, setCoordinateSystem] = useState(defaultCoSystem);

  const [isDragging, setIsDragging] = useState(false);

  const [dragInitPos, setDragInitPos] = useState({ x: 0, y: 0 });

  const [axisIntervals, setAxisIntervals] = useState(9);
  const intervalsArray = Array(axisIntervals);
  const interval = windowSize.width / (axisIntervals + 1);

  for (let i = 0; i < axisIntervals / 2; i++) {
    intervalsArray[i] = interval * (i + 1);
    intervalsArray[axisIntervals - i] = interval * (axisIntervals - i);
  }

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
          {intervalsArray.map((interval, i) => (
            <div
              key={`y-${i}`}
              className="axis-interval"
              style={{
                top: -3,
                left: interval,
              }}
            >
              {" "}
              <div className="axis-interval-label">
                {Number(interval - coordinateSystem.x).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className="axis y-axis" style={{ left: coordinateSystem.x }}>
          {intervalsArray.map((interval, i) => (
            <div
              key={`y-${i}`}
              className="axis-interval"
              style={{
                left: -3,
                top: interval,
              }}
            >
              {" "}
              <div className="axis-interval-label">
                {Number(interval - coordinateSystem.y).toFixed(2)}
              </div>
            </div>
          ))}
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
        <button onClick={() => setCoordinateSystem(defaultCoSystem)}>
          Center axis
        </button>
      </div>
    </>
  );
};

export default Simulation;
