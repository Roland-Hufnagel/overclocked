import { css, styled } from "styled-components";

const VARIANTS = {
  NEG: "NEGATIVE",
  POS: "POSITIVE",
};

export default function WorkhoursBar({ goal = 160, max = 200, current }) {
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
    </Container>
  );
}

const Container = styled.div`
  border: solid 1px var(--c-on-surface);
  border-radius: 16px;
  display: grid;
  gap: 4px;
  height: 64px;
  padding: 4px;

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
