import { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { getColor } from "./utils";

const ELEMENTS_NUMBER = 20;
const POINT_DIAMETER = 14;
const SCROLL_OFFSET = 10;
const GAP = 20;

const SNAP_AXIS = {
  NONE: "none",
  X: "x",
  Y: "y",
  // BLOCK: "block",
  // INLINE: "inline",
  BOTH: "both"
};

const SNAP_ALIGN = {
  START: "start",
  CENTER: "center",
  END: "end"
};

const BEAHAVIOR = {
  MANDATORY: "mandatory",
  PROXIMITY: "proximity"
};

const SCROLL_DIRECTION = {
  LEFT_TO_RIGHT: "ltr",
  RIGHT_TO_LEFT: "rtl"
};

export default function App() {
  const [align, setAlign] = useState(SNAP_ALIGN.START);
  const [behavior, setBehavior] = useState(BEAHAVIOR.MANDATORY);
  const [gap, setGap] = useState(GAP);
  const [showSnapPoints, setShowSnapPoints] = useState(true);
  const [snapAxis, setSnapAxis] = useState(SNAP_AXIS.X);

  const colorsArray = useMemo(
    () =>
      Array.from({ length: ELEMENTS_NUMBER }, (_, index) => getColor(index)),
    []
  );

  return (
    <div>
      <Scrollable dir="ltr" snapAxis={snapAxis} behavior={behavior} gap={gap}>
        {Array.from({ length: ELEMENTS_NUMBER }, (_, index) => (
          <Box
            key={index}
            color={colorsArray[index]}
            align={align}
            snapAxis={snapAxis}
          >
            {index + 1}
            <SnapPoints
              align={align}
              snapAxis={snapAxis}
              show={showSnapPoints}
            />
          </Box>
        ))}
      </Scrollable>
      <ControlPanel>
        <ConfigOptions>
          <div>Show Snap Points</div>
          <input
            type="checkbox"
            id="snap-points"
            checked={showSnapPoints}
            onChange={({ target }) => setShowSnapPoints(target.checked)}
          />
        </ConfigOptions>
        <ConfigOptions>
          <div>Snap axis</div>
          {Object.values(SNAP_AXIS).map((value, index) => (
            <div key={index}>
              <input
                type="radio"
                id={value}
                name="snap-axis"
                value={value}
                checked={snapAxis === value}
                onChange={({ target }) => setSnapAxis(target.value)}
              />
               <label htmlFor={value}>{value}</label>
            </div>
          ))}
        </ConfigOptions>
        <ConfigOptions>
          <div>Align Items</div>
          {Object.values(SNAP_ALIGN).map((value, index) => (
            <div key={index}>
              <input
                type="radio"
                id={value}
                name="snap-align"
                value={value}
                checked={align === value}
                onChange={({ target }) => setAlign(target.value)}
              />
               <label htmlFor={value}>{value}</label>
            </div>
          ))}
        </ConfigOptions>
        <ConfigOptions>
          <div>Behavior</div>
          {Object.values(BEAHAVIOR).map((value, index) => (
            <div key={index}>
              <input
                type="radio"
                id={value}
                name="behavior"
                value={value}
                checked={behavior === value}
                onChange={({ target }) => setBehavior(target.value)}
              />
               <label htmlFor={value}>{value}</label>
            </div>
          ))}
        </ConfigOptions>
      </ControlPanel>
    </div>
  );
}

function SnapPoints(props) {
  const { align, snapAxis, show } = props;

  if (snapAxis === "none" || !show) {
    return null;
  }

  return (
    <>
      <SnapPointStartX align={align} snapAxis={snapAxis} />
      <SnapPointEndX align={align} snapAxis={snapAxis} />
      <SnapPointCenter align={align} />
      <SnapPointStartY align={align} snapAxis={snapAxis} />
      <SnapPointEndY align={align} snapAxis={snapAxis} />
    </>
  );
}

// const Box = styled.div`
//   background-color: ${({ color }) => color};
//   position: relative;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: ${({ snapAxis }) => (snapAxis === SNAP_AXIS.X ? "350px" : "100%")};
//   height: ${({ snapAxis }) => (snapAxis === SNAP_AXIS.X ? "100%" : "350px")};
//   border-radius: 12px;
//   scroll-snap-align: ${({ align }) => align};
// `;

const Box = styled.div.attrs(({ color }) => ({
  style: {
    backgroundColor: color
  }
}))`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ snapAxis }) => (snapAxis === SNAP_AXIS.X ? "350px" : "100%")};
  height: ${({ snapAxis }) => (snapAxis === SNAP_AXIS.X ? "100%" : "350px")};
  border-radius: 12px;
  scroll-snap-align: ${({ align }) => align};
`;

const ControlPanel = styled.div`
  display: flex;
`;

const ConfigOptions = styled.div`
  padding: 20px;
`;

const Scrollable = styled.div`
  //scroll-padding: 30px;
  position: relative;
  padding: 50px;
  display: grid;
  grid-auto-flow: ${({ snapAxis }) =>
    snapAxis === SNAP_AXIS.X ? "column" : "row"};
  gap: ${({ gap }) => `${gap}px`};
  width: 100%;
  height: 400px;
  grid-template-columns: ${({ snapAxis }) =>
    snapAxis === SNAP_AXIS.BOTH ? "repeat(5, 400px)" : ""};
  overflow: auto;
  outline: 1px dashed lightgray;
  flex: none;
  scroll-snap-type: ${({ snapAxis, behavior }) => `${snapAxis} ${behavior}`};
`;

const SnapPoint = styled.div`
  position: absolute;
  height: ${POINT_DIAMETER}px;
  width: ${POINT_DIAMETER}px;
  background-color: blue;
  border-radius: 50%;

  &:before {
    content: "";
    position: absolute;
    height: ${POINT_DIAMETER}px;
    width: ${POINT_DIAMETER}px;
    background-color: lightblue;
    opacity: 0.5;
    border-radius: 50%;
    animation: createBox 1s infinite;

    @keyframes createBox {
      from {
        transform: scale(4);
      }
      to {
        transform: scale(1);
      }
    }
  }
`;

const SnapPointStartX = styled(SnapPoint)`
  top: calc(50% - ${POINT_DIAMETER / 2}px);
  left: -${POINT_DIAMETER / 2}px;

  ${({ align, snapAxis }) =>
    (snapAxis === SNAP_AXIS.Y || align !== SNAP_ALIGN.START) &&
    css`
      display: none;
    `}
`;

const SnapPointEndX = styled(SnapPoint)`
  top: calc(50% - ${POINT_DIAMETER / 2}px);
  right: -${POINT_DIAMETER / 2}px;

  ${({ align, snapAxis }) =>
    (snapAxis === SNAP_AXIS.Y || align !== SNAP_ALIGN.END) &&
    css`
      display: none;
    `}
`;

const SnapPointCenter = styled(SnapPoint)`
  top: calc(50% - ${POINT_DIAMETER / 2}px);
  left: calc(50% - ${POINT_DIAMETER / 2}px);

  ${({ align }) =>
    align !== SNAP_ALIGN.CENTER &&
    css`
      display: none;
    `}
`;

const SnapPointStartY = styled(SnapPoint)`
  top: -${POINT_DIAMETER / 2}px;
  left: calc(50% - ${POINT_DIAMETER / 2}px);

  ${({ align, snapAxis }) =>
    (snapAxis === SNAP_AXIS.X || align !== SNAP_ALIGN.START) &&
    css`
      display: none;
    `};
`;

const SnapPointEndY = styled(SnapPoint)`
  bottom: -${POINT_DIAMETER / 2}px;
  left: calc(50% - ${POINT_DIAMETER / 2}px);

  ${({ align, snapAxis }) =>
    (snapAxis === SNAP_AXIS.X || align !== SNAP_ALIGN.END) &&
    css`
      display: none;
    `}
`;
