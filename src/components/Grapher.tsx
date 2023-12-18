import React, { useState } from "react";
import MenuWindow from "./MenuWindow";

type Operator = "+" | "-" | "*" | "/";

const stringToOperator = {
  "+": function (x: number, y: number) {
    return x + y;
  },
  "-": function (x: number, y: number) {
    return x - y;
  },
  "*": function (x: number, y: number) {
    return x * y;
  },
  "/": function (x: number, y: number) {
    return x / y;
  },
  "^": function (x: number, y: number) {
    return x ** y;
  },
};

interface Point {
  id: number;
  positions: { x: number; y: number };
  styles: {
    backgroundColor: string;
    width: number;
    height: number;
  };
}

interface Line {
  id: number;
  positions: { x: number; y: number };
  styles: {
    backgroundColor: string;
    width: string;
    height: number;
    transform: string;
  };
}

const Grapher = () => {
  const windowSize = { width: 800, height: 800 };

  const [isEquationMenuOpen, setIsEquationMenuOpen] = useState(false);
  const [equation, setEquation] = useState("");

  const [isAddingObject, setIsAddingObject] = useState(false);
  const [addingObjectPos, setAddingObjectPos] = useState({ x: 0, y: 0 });

  const [clickedObject, setClickedObject] = useState({ x: 0, y: 0 });
  let hasClickedObject = clickedObject.x !== 0 && clickedObject.y !== 0;

  const [pointsWidth, setPointsWidth] = useState(6);
  const [pointsColor, setPointsColor] = useState("#FF0000");
  const [pointsArray, setPointsArray] = useState<Point[]>([]);
  const [pointsCounter, setPointsCounter] = useState(1);

  const [linesArray, setLinesArray] = useState<Line[]>([]);
  const [linesCounter, setLinesCounter] = useState(1);
  const [linesColor, setLinesColor] = useState("#FF0000");

  const [scale, setScale] = useState(1);
  const [isMove, setIsMove] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isPointsMenuOpen, setIsPointsMenuOpen] = useState(false);
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

  // for different point so they have different colors :)
  const colors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#800000",
    "#008000",
    "#000080",
    "#808000",
  ];

  const handleAxisIntervals = (event) => {
    setAxisIntervals(Number(event.target.value));
  };

  const handleMouseDown = (event) => {
    if (isAddingObject) {
      addObject(
        addingObjectPos.x - coordinateSystem.x,
        windowSize.height - addingObjectPos.y - coordinateSystem.y
      );
      setIsAddingObject(false);
    }
    if (isMove) {
      setIsDragging(true);
      setDragInitPos({
        x: event.clientX,
        y: windowSize.height - event.clientY,
      });
    }
  };

  const handleMouseMove = (event) => {
    console.log(isAddingObject);
    if (isDragging) {
      const x = event.clientX;
      const y = windowSize.height - event.clientY;

      const offsetX = dragInitPos.x - x;
      const offsetY = dragInitPos.y - y;
      setCoordinateSystem({
        x: coordinateSystem.x - offsetX * 0.2,
        y: coordinateSystem.y - offsetY * 0.2,
      });
    } else if (isAddingObject) {
      // hardcoded value for 1em lol (because of the margin that i set for the div lmao)
      setAddingObjectPos({ x: event.clientX - 16, y: event.clientY - 16 });
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
    setScale(scale * 0.5); // doesnt work yet
    setIsMove(false);
  };

  const handleZoomOut = () => {
    setScale(scale * 2); // doesnt work yet
    setIsMove(false);
  };

  const handleResetCoordinateSystem = () => {
    setCoordinateSystem(defaultCoSystem);
    setScale(1);
    setIsMove(false);
  };

  const handlePointsColor = (id, event) => {
    setPointsColor(event.target.value);
    setPointsArray((prevPoints) =>
      prevPoints.map((object) =>
        object.id === id
          ? {
              ...object,
              styles: { ...object.styles, backgroundColor: event.target.value },
            }
          : object
      )
    );
  };

  const handlePointsWidth = (id, event) => {
    const newWidth = Number(event.target.value);
    setPointsWidth(newWidth);
    setPointsArray((prevPoints) =>
      prevPoints.map((object) =>
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

  const addRandomObject = () => {
    addObject(randomInt(), randomInt());
  };

  const addObject = (x: number, y: number) => {
    console.log("adding object");
    const newObject = {
      id: pointsCounter,
      positions: { x: x, y: y },
      styles: {
        backgroundColor: pointsColor,
        width: pointsWidth,
        height: pointsWidth,
      },
    };
    setPointsCounter(pointsCounter + 1);
    setPointsArray([...pointsArray, newObject]);
  };

  const deleteObject = (id) => {
    const newPoints = pointsArray.filter((object) => object.id !== id);
    setPointsArray(newPoints);
    setClickedObject({ x: 0, y: 0 });
  };

  const handleClearPoints = () => {
    setPointsCounter(1);
    setPointsArray([]);
  };

  const equationSolver = (equation: string[]) => {
    return 100;
  };

  const equationGrapher = (equation: string) => {
    for (let i = 0; i < windowSize.width; i += 100) {
      const x = i - coordinateSystem.x;
      const y = equationSolver(equation.split("")) * i;
      console.log(`equationSolver output for x=${x}:`, y); // Debug log
      addObject(x, y);
      console.log(`points after adding object for x=${x}:`, pointsArray); // Debug log
    }
  };

  // const equationSolver = (equation: string[]) =>  {
  //   const char = equation[0];
  //   // if (char === "-") {
  //   //   return -1 * equationSolver(equation.slice(1));
  //   // } else

  //   // final condition
  //   if (!equation[1]) {
  //     return char;
  //   }
  //   if (!char) {
  //     return 1;
  //   } else if (char.match(/\([a-z]\)/)) {   // check for independant variable

  //     return function(x, y) {
  //       if stringToOperator[equation[1]] {
  //         return Number(char) * equationSolver(equation.slice(1));
  //       }
  //     }
  //   } else if (typeof char.match(/d+/g)) {    // check for digit
  //     if (equation[1] && stringToOperator[equation[1]]) {
  //       return Number(char) * equationSolver(equation.slice(1));
  //     }
  //   }

  //     return stringToOperator[equation[1]](
  //       char,
  //       equationSolver(equation.slice(2))
  //     );
  //   }
  //   // return char;
  // };
  // console.log(equationSolver(["2x", "+", "3"]));

  // const handleEquation = () => {
  //   const listEquation = equation.split("=");
  //   const leftSide = listEquation[0];
  //   const rightSide = listEquation[1];
  //   const independantVariable = leftSide
  //     .match(/\([a-z]\/))
  //     ?.toString()
  //     .replace(/\(|\)/g, "");
  //   const dependantVariable = leftSide.split("").map((char) => {});
  //   console.log(independantVariable);
  //   // console.log(listEquation)/;
  //   // const independantVariable = leftSide.split('').forEach((char) => {

  //   // if rightSide.indexOf("x") !== -1 {
  //   //   return
  //   // }
  // };
  const addLine = (x: number, y: number, angle: number) => {
    const newLine = {
      id: linesCounter,
      positions: { x: x, y: y },
      styles: {
        backgroundColor: linesColor,
        width: "100vh",
        height: 2,
        transform: `rotate(${angle}deg)`,
      },
    };
    setLinesArray([...linesArray, newLine]);
    setLinesCounter(linesCounter + 1);
  };

  const handleEquation = () => {
    console.log("equation solver lol");
    // all sorts of regex lol
    console.log(equation);
    const pointRegex = /^\(\d+\,\s\d+\)$/; // (2, 3)
    const functionRegex = /^[a-z]\((x|y)\)=/; // f(x)=, g(y)=
    const numberRegex = /^x=\d+|^y=\d+/; // x=2, y=3

    if (equation.match(pointRegex)) {
      const point = equation.replace(/\(|\)/g, "").split(",");
      addObject(Number(point[0]), Number(point[1]));
    } else if (equation.match(numberRegex)) {
      console.log("number");
      const independantVariable = equation.match(/x|y/)?.toString();
      console.log(independantVariable);
      if (independantVariable === "x") {
        addLine(Number(equation.match(/\d+/)?.toString()), 0, 90);
        // addLine(Number(equation.match(/\d+/)?.toString()), 0);
      } else {
        addLine(0, Number(equation.match(/\d+/)?.toString()), 0);
        // addObject(0, Number(equation.match(/\d+/)?.toString()));
        // addLine(0, Number(equation.match(/\d+/)?.toString()));
      }
    } else if (equation.match(functionRegex)) {
      console.log("function");
    }

    const operatorRegex = /(\+|\-|\*|\/|\^)/;
    const variableRegex = /(x|y)/;
    const parenthesisRegex = /\(|\)/;
    // const functionRegex = /(sin|cos|tan)/;
    // console.log(equation.match(pointRegex));
    // console.log(equation.match(numberRegex));
  };

  return (
    <>
      <div
        className="grapher-window"
        onMouseMove={isMove || isAddingObject ? handleMouseMove : undefined}
        onMouseUp={isMove ? handleMouseUp : undefined}
        onMouseDown={isMove || isAddingObject ? handleMouseDown : undefined}
        style={{ width: windowSize.width, height: windowSize.height }}
      >
        <div>
          <div>
            {/* render lines */}
            {linesArray.map((object) => (
              <div
                key={`line-${object.id}`}
                className="line"
                style={{
                  bottom:
                    object.positions.y +
                    coordinateSystem.y -
                    (object.styles.height * 1.0) / 2 +
                    1,
                  left: object.positions.x + coordinateSystem.x,
                  ...object.styles,
                }}
              ></div>
            ))}
          </div>
          <div>
            {/* render points */}
            {pointsArray.map((object) => (
              <div
                onClick={() =>
                  isDeleting
                    ? deleteObject(object.id)
                    : clickedObject !== object.positions
                    ? setClickedObject(object.positions)
                    : setClickedObject({ x: 0, y: 0 })
                }
                key={`point-${object.id}`}
                className="point"
                style={{
                  bottom:
                    object.positions.y +
                    coordinateSystem.y -
                    (object.styles.height * 1.0) / 2 +
                    0.5,
                  left:
                    object.positions.x +
                    coordinateSystem.x -
                    (object.styles.width * 1.0) / 2 +
                    0.5,
                  // bottom:
                  //   coordinateSystem.y +
                  //   object.positions.y -
                  //   (object.styles.height * 1.0) / 2 +
                  //   0.5,
                  // left:
                  //   coordinateSystem.x +
                  //   object.positions.x -
                  //   (object.styles.width * 1.0) / 2 +
                  //   0.5,
                  ...object.styles,
                }}
              ></div>
            ))}
          </div>
        </div>
        {/* x-axis */}
        <div className="axis x-axis" style={{ bottom: coordinateSystem.y }}>
          {intervalsArray.map((interval, i) => (
            <div
              key={`y-${i}`}
              className="axis-interval"
              style={{
                bottom: -3,
                left: interval,
              }}
            >
              <div className="interval-label">
                {Number(interval - coordinateSystem.x).toFixed(2)}
              </div>
            </div>
          ))}
          {/* object's x-axis intercept */}
          {hasClickedObject && (
            <div
              className="intercept"
              style={{
                bottom: -2,
                left: coordinateSystem.x + clickedObject.x - 2,
              }}
            >
              <div className="interval-label">{clickedObject.x}</div>
            </div>
          )}
        </div>
        {/* y-axis */}
        <div className="axis y-axis" style={{ left: coordinateSystem.x }}>
          {intervalsArray.map((interval, i) => (
            <div
              key={`y-${i}`}
              className="axis-interval"
              style={{
                left: -3,
                bottom: interval,
              }}
            >
              <div className="interval-label">
                {Number(interval - coordinateSystem.y).toFixed(2)}
              </div>
            </div>
          ))}
          {/* object's y-axis intercept */}
          {hasClickedObject && (
            <div
              className="intercept"
              style={{
                bottom: coordinateSystem.y + clickedObject.y - 2,
                left: -2,
              }}
            >
              <div className="interval-label">{clickedObject.y}</div>
            </div>
          )}
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
            id="points-menu"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-2 -1.5 24 24"
            width="24"
            fill="currentColor"
            className={isPointsMenuOpen ? "active" : ""}
            onClick={() => setIsPointsMenuOpen(!isPointsMenuOpen)}
          >
            <path d="M10 20.565c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z"></path>
          </svg>
          <svg
            id="add-object"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-2 -2 24 24"
            width="24"
            fill="currentColor"
            className={isAddingObject ? "active" : ""}
            onClick={() => {
              setIsAddingObject(!isAddingObject);
              setIsMove(false);
            }}
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
            id="clear-points"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-1.5 -2.5 24 24"
            width="24"
            fill="currentColor"
            onClick={handleClearPoints}
          >
            <path d="M12.728 12.728L8.485 8.485l-5.657 5.657 2.122 2.121a3 3 0 0 0 4.242 0l3.536-3.535zM11.284 17H14a1 1 0 0 1 0 2H3a1 1 0 0 1-.133-1.991l-1.453-1.453a2 2 0 0 1 0-2.828L12.728 1.414a2 2 0 0 1 2.828 0L19.8 5.657a2 2 0 0 1 0 2.828L11.284 17z"></path>
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
          <svg
            id="equation"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-6 -6 24 24"
            width="24"
            fill="currentColor"
            className={isEquationMenuOpen ? "active" : ""}
            onClick={() => {
              setIsEquationMenuOpen(!isEquationMenuOpen);
            }}
          >
            <path d="M12,1 L12,3 C12,3.55228475 11.5522847,4 11,4 C10.4477153,4 10,3.55228475 10,3 L10,2 L7,2 L7,10 L8,10 C8.55228475,10 9,10.4477153 9,11 C9,11.5522847 8.55228475,12 8,12 L4,12 C3.44771525,12 3,11.5522847 3,11 C3,10.4477153 3.44771525,10 4,10 L5,10 L5,2 L2,2 L2,3 C2,3.55228475 1.55228475,4 1,4 C0.44771525,4 0,3.55228475 0,3 L0,1 C0,0.44771525 0.44771525,0 1,0 L11,0 C11.5522847,0 12,0.44771525 12,1 Z"></path>
          </svg>
        </div>
      </div>
      {isPointsMenuOpen && (
        <MenuWindow
          heading="Your Points"
          onCloseClick={() => setIsPointsMenuOpen(false)}
        >
          <div className="points-list">
            {pointsArray.map((object) => (
              <>
                <div className="points-list-item">
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
                      onChange={handlePointsColor.bind(this, object.id)}
                      className="custom"
                    ></input>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={object.styles.width}
                      onChange={handlePointsWidth.bind(this, object.id)}
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
            onClick={addRandomObject}
          >
            <path d="M8.9 6.9v-5a1 1 0 1 0-2 0v5h-5a1 1 0 1 0 0 2h5v5a1 1 0 1 0 2 0v-5h5a1 1 0 1 0 0-2h-5z"></path>
          </svg>
        </MenuWindow>
      )}
      {isAxisSettingsMenuOpen && (
        <MenuWindow
          heading="Axis settings"
          onCloseClick={() => setIsAxisSettingsMenuOpen(false)}
        >
          <label htmlFor="#axis-intervals">Axis intervals</label>{" "}
          <input
            id="axis-intervals"
            type="number"
            value={axisIntervals}
            onChange={handleAxisIntervals}
            min="0"
            className="custom"
          />
        </MenuWindow>
      )}
      {isEquationMenuOpen && (
        <MenuWindow
          heading="Input equation"
          onCloseClick={() => setIsEquationMenuOpen(false)}
        >
          <input
            id="equation-input  "
            type="text"
            value={equation}
            onChange={(event) => setEquation(event.target.value)}
            min="0"
            className="custom"
          />
          <div className="button" onClick={handleEquation}>
            Graph
          </div>
        </MenuWindow>
      )}
    </>
  );
};

export default Grapher;
