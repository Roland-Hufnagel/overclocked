import { css, styled } from "styled-components";

const VARIANTS = {
  NEG: "NEGATIVE",
  POS: "POSITIVE",
};

export default function WorkhoursBar({
  dynamic = false,
  goal = 160,
  max = 200,
  current,
  onChange,
}) {
  const isOvertime = current >= goal;

  const toRelative = (value) => Math.round((value / max) * 100);
  return (
    <Container
      isOvertime={isOvertime}
      current={toRelative(current)}
      goal={toRelative(goal)}
    >
      <Bar />
      {!isOvertime && <Bar variant={VARIANTS.NEG} />}
      <GoalMark />
      {isOvertime && <Bar variant={VARIANTS.POS} />}
      {dynamic && (
        <Controls
          type="range"
          value={goal}
          max={max}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: grid;
  gap: 4px;
  height: 64px;
  padding: 4px;
  border: solid 1px var(--c-on-surface);
  border-radius: 16px;

  grid-template-columns: ${({ isOvertime, current, goal }) =>
    isOvertime
      ? css`
          calc(${goal}% + 4px) 3px ${Math.min(
          current - goal,
          100 - goal - 3
        )}% 1fr;
        `
      : css`
          ${current}% ${Math.abs(goal - current)}%3px 1fr;
        `};
`;

const Bar = styled.div`
  background-color: var(--c-neutral);
  border-radius: 12px;

  ${({ variant }) =>
    variant === VARIANTS.NEG &&
    css`
      background-color: var(--c-danger);
    `}

  ${({ variant }) =>
    variant === VARIANTS.POS &&
    css`
      background-color: var(--c-success);
    `}
`;

const GoalMark = styled.div`
  background-color: var(--c-on-surface);
  width: 3px;
  border-radius: 999px;
`;

const Controls = styled.input`
  position: absolute;
  width: calc(100% + 20px);
  margin-inline: 0px;
  height: 100%;

  background: transparent;
  border-color: transparent;
  color: transparent;

  -webkit-appearance: none;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    background-color: transparent;
    width: 48px;
    height: 100%;
    border: none;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    background-color: transparent;
    width: 48px;
    height: 100%;
    border: none;
    cursor: pointer;
  }
`;
