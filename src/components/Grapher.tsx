import React, { useState } from "react";

const Grapher = () => {
  const windowSize = { width: 800, height: 800 };

  const [clickedObject, setClickedObject] = useState(0);
  const [objectsWidth, setObjectsWidth] = useState(6);
  const [objectsColor, setObjectsColor] = useState("#FF0000");
  const [objects, setObjects] = useState([
    {
      id: 1,
      positions: { x: 0, y: 0 },
      styles: {
        backgroundColor: objectsColor,
        width: objectsWidth,
        height: objectsWidth,
      },
    },
  ]);
  const [objectsCounter, setObjectsCounter] = useState(2);

  const [scale, setScale] = useState(1);
  const [isMove, setIsMove] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isObjectsMenuOpen, setIsObjectsMenuOpen] = useState(false);
  const [isAxisSettingsMenuOpen, setIsAxisSettingsMenuOpen] = useState(false);

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
        x: coordinateSystem.x - offsetX * 0.2,
        y: coordinateSystem.y - offsetY * 0.2,
      });
    }
  };

  const handleMouseUp = (event) => {
    setIsDragging(false);
  };

  if (isMove) {
    document.body.style.cursor = "move";
  } else {
    document.body.style.cursor = "default";
  }

  const handleMove = () => {
    setIsMove(!isMove);
  };

  const handleZoomIn = () => {
    setScale(scale * 1.1);
    setIsMove(false);
  };

  const handleZoomOut = () => {
    setScale(scale / 1.1);
    setIsMove(false);
  };

  const handleResetCoordinateSystem = () => {
    setCoordinateSystem(defaultCoSystem);
    setScale(1);
    setIsMove(false);
  };

  const handleObjectsColor = (id, event) => {
    setObjectsColor(event.target.value);
    setObjects((prevObjects) =>
      prevObjects.map((object) =>
        object.id === id
          ? {
              ...object,
              styles: { ...object.styles, backgroundColor: event.target.value },
            }
          : object
      )
    );
  };

  const handleObjectsWidth = (id, event) => {
    const newWidth = Number(event.target.value);
    setObjectsWidth(newWidth);
    setObjects((prevObjects) =>
      prevObjects.map((object) =>
        object.id === id
          ? {
              ...object,
              styles: { ...object.styles, width: newWidth, height: newWidth },
            }
          : object
      )
    );
  };

  function randomInt() {
    return Math.floor(Math.random() * coordinateSystem.x);
  }

  const addObject = () => {
    const newObject = {
      id: objectsCounter,
      positions: { x: randomInt(), y: randomInt() },
      styles: {
        backgroundColor: objectsColor,
        width: objectsWidth,
        height: objectsWidth,
      },
    };
    setObjectsCounter(objectsCounter + 1);
    setObjects([...objects, newObject]);
  };

  const deleteObject = (id) => {
    const newObjects = objects.filter((object) => object.id !== id);
    setObjects(newObjects);
  };

  return (
    <>
      <div
        className="grapher-window"
        onMouseMove={isMove ? handleMouseMove : undefined}
        onMouseUp={isMove ? handleMouseUp : undefined}
        onMouseDown={isMove ? handleMouseDown : undefined}
        style={{ width: windowSize.width, height: windowSize.height }}
        onClick={() => clickedObject != 0 && setClickedObject(0)}
      >
        <div>
          {objects.map((object) => (
            <div
              onClick={() =>
                isDeleting
                  ? deleteObject(object.id)
                  : setClickedObject(object.id)
              }
              key={object.id}
              className="object"
              style={{
                top:
                  coordinateSystem.y +
                  object.positions.y * scale -
                  (object.styles.height * 1.0) / 2 +
                  0.5,
                left:
                  coordinateSystem.x +
                  object.positions.x * scale -
                  (object.styles.width * 1.0) / 2 +
                  0.5,
                ...object.styles,
              }}
            ></div>
          ))}
        </div>
        <div className="grapher-menu">
          <svg
            id="move"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-4 -4 24 24"
            width="24"
            fill="currentColor"
            onClick={handleMove}
            className={isMove ? "active" : ""}
          >
            <path d="M12.586 2H11a1 1 0 0 1 0-2h4a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V3.414L9.414 8 14 12.586V11a1 1 0 0 1 2 0v4a1 1 0 0 1-1 1h-4a1 1 0 0 1 0-2h1.586L8 9.414 3.414 14H5a1 1 0 0 1 0 2H1a1 1 0 0 1-1-1v-4a1 1 0 0 1 2 0v1.586L6.586 8 2 3.414V5a1 1 0 1 1-2 0V1a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H3.414L8 6.586 12.586 2z"></path>
          </svg>
          <svg
            id="reset-coordinate-system"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-1 -2 24 24"
            width="24"
            fill="currentColor"
            onClick={handleResetCoordinateSystem}
          >
            <path d="M19.347 7.24l.847-1.266a.984.984 0 0 1 1.375-.259c.456.31.58.93.277 1.383L19.65 10.38a.984.984 0 0 1-1.375.259L14.97 8.393a1.002 1.002 0 0 1-.277-1.382.984.984 0 0 1 1.375-.26l1.344.915C16.428 4.386 13.42 2 9.863 2c-4.357 0-7.89 3.582-7.89 8s3.533 8 7.89 8c.545 0 .987.448.987 1s-.442 1-.987 1C4.416 20 0 15.523 0 10S4.416 0 9.863 0c4.504 0 8.302 3.06 9.484 7.24z"></path>
          </svg>
          <svg
            id="zoom-in"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-2.5 -2.5 24 24"
            width="1"
            fill="currentColor"
            onClick={handleZoomIn}
          >
            <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zm6.32-1.094l3.58 3.58a1 1 0 1 1-1.415 1.413l-3.58-3.58a8 8 0 1 1 1.414-1.414zM9 7h2a1 1 0 0 1 0 2H9v2a1 1 0 0 1-2 0V9H5a1 1 0 1 1 0-2h2V5a1 1 0 1 1 2 0v2z"></path>
          </svg>
          <svg
            id="zoom-out"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-2.5 -2.5 24 24"
            width="24"
            fill="currentColor"
            onClick={handleZoomOut}
          >
            <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zm6.32-1.094l3.58 3.58a1 1 0 1 1-1.415 1.413l-3.58-3.58a8 8 0 1 1 1.414-1.414zM5 7h6a1 1 0 0 1 0 2H5a1 1 0 1 1 0-2z"></path>
          </svg>
          <svg
            id="objects-menu"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-2 -2 24 24"
            width="24"
            fill="currentColor"
            className={isObjectsMenuOpen ? "active" : ""}
            onClick={() => setIsObjectsMenuOpen(!isObjectsMenuOpen)}
          >
            <path d="M4 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4zm0-2h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4zm7 11v4a1 1 0 0 1-2 0v-4H5a1 1 0 0 1 0-2h4V5a1 1 0 1 1 2 0v4h4a1 1 0 0 1 0 2h-4z"></path>
          </svg>
          <svg
            id="delete-object"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-3 -2 24 24"
            width="24"
            fill="currentColor"
            onClick={() => setIsDeleting(!isDeleting)}
            className={isDeleting ? "active" : ""}
          >
            <path d="M6 2V1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1h4a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-.133l-.68 10.2a3 3 0 0 1-2.993 2.8H5.826a3 3 0 0 1-2.993-2.796L2.137 7H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4zm10 2H2v1h14V4zM4.141 7l.687 10.068a1 1 0 0 0 .998.932h6.368a1 1 0 0 0 .998-.934L13.862 7h-9.72zM7 8a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1z"></path>
          </svg>
          <svg
            id="axis-settings"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-2 -2 24 24"
            width="24"
            fill="currentColor"
            className={isAxisSettingsMenuOpen ? "active" : ""}
            onClick={() => setIsAxisSettingsMenuOpen(!isAxisSettingsMenuOpen)}
          >
            <path d="M14.95 7.879l-.707-.707a1 1 0 0 1 1.414-1.415l.707.707 1.414-1.414-2.828-2.828L2.222 14.95l2.828 2.828 1.414-1.414L5.05 14.95a1 1 0 0 1 1.414-1.414L7.88 14.95l1.414-1.414-.707-.708A1 1 0 0 1 10 11.414l.707.707 1.414-1.414-1.414-1.414a1 1 0 0 1 1.414-1.414l1.415 1.414 1.414-1.414zM.808 13.536L13.536.808a2 2 0 0 1 2.828 0l2.828 2.828a2 2 0 0 1 0 2.828L6.464 19.192a2 2 0 0 1-2.828 0L.808 16.364a2 2 0 0 1 0-2.828z"></path>
          </svg>
        </div>
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
              <div className="x-axis-interval-label">
                {Number(scale * (interval - coordinateSystem.x)).toFixed(2)}
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
              <div className="y-axis-interval-label">
                {Number(scale * (interval - coordinateSystem.y)).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        {clickedObject > 0 &&
          objects.map((object) => {
            return (
              object.id === clickedObject && (
                <>
                  {/* x-intercept */}
                  <div
                    className="intercept"
                    style={{
                      left: coordinateSystem.x + object.positions.x * scale - 2,
                      top: coordinateSystem.y - 2,
                    }}
                  >
                    <div className="x-axis-interval-label">
                      {Number(object.positions.x * scale).toFixed(2)}
                    </div>
                  </div>
                  {/* y-intercept */}
                  <div
                    className="intercept"
                    style={{
                      top: coordinateSystem.y + object.positions.y * scale - 2,
                      left: coordinateSystem.x - 2,
                    }}
                  >
                    <div className="y-axis-interval-label">
                      {Number(object.positions.y * scale).toFixed(2)}
                    </div>
                  </div>
                </>
              )
            );
          })}
        {/* <div
        className="axis-0"
        style={{ top: coordinateSystem.y - 2, left: coordinateSystem.x - 2 }}
      ></div> */}
      </div>
      {isObjectsMenuOpen && (
        <div className="menu-window">
          <div className="menu-heading">
            <div>Your objects</div>
            <svg
              className="close-menu-window"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-6 -6 24 24"
              width="24"
              fill="currentColor"
              onClick={() => setIsObjectsMenuOpen(false)}
            >
              <path d="M7.314 5.9l3.535-3.536A1 1 0 1 0 9.435.95L5.899 4.485 2.364.95A1 1 0 1 0 .95 2.364l3.535 3.535L.95 9.435a1 1 0 1 0 1.414 1.414l3.535-3.535 3.536 3.535a1 1 0 1 0 1.414-1.414L7.314 5.899z"></path>
            </svg>
          </div>
          <div className="objects-list">
            {objects.map((object) => (
              <>
                <div className="objects-list-item">
                  <div>
                    <div>ID:</div>
                    <div>COLOR:</div>
                    <div>WIDTH:</div>
                    <div>POSITION:</div>
                  </div>
                  <div>
                    <div>{object.id}</div>
                    <input
                      type="color"
                      value={object.styles.backgroundColor}
                      onChange={handleObjectsColor.bind(this, object.id)}
                      className="custom"
                    ></input>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={object.styles.width}
                      onChange={handleObjectsWidth.bind(this, object.id)}
                      className="custom"
                    ></input>
                    <div>
                      ({object.positions.x}, {object.positions.y})
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-4.5 -4.5 24 24"
            width="24"
            fill="currentColor"
            onClick={addObject}
          >
            <path d="M8.9 6.9v-5a1 1 0 1 0-2 0v5h-5a1 1 0 1 0 0 2h5v5a1 1 0 1 0 2 0v-5h5a1 1 0 1 0 0-2h-5z"></path>
          </svg>
        </div>
      )}
      {isAxisSettingsMenuOpen && (
        <div className="menu-window">
          <div className="menu-heading">
            <div>Axis settings</div>
            <svg
              className="close-menu-window"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-6 -6 24 24"
              width="24"
              fill="currentColor"
              onClick={() => setIsAxisSettingsMenuOpen(false)}
            >
              <path d="M7.314 5.9l3.535-3.536A1 1 0 1 0 9.435.95L5.899 4.485 2.364.95A1 1 0 1 0 .95 2.364l3.535 3.535L.95 9.435a1 1 0 1 0 1.414 1.414l3.535-3.535 3.536 3.535a1 1 0 1 0 1.414-1.414L7.314 5.899z"></path>
            </svg>
          </div>
          <label htmlFor="#axis-intervals">Axis intervals</label>
          <input
            id="axis-intervals"
            type="number"
            value={axisIntervals}
            onChange={handleAxisIntervals}
            min="0"
          />
        </div>
      )}
      <div className="grapher-settings"></div>
    </>
  );
};

export default Grapher;
