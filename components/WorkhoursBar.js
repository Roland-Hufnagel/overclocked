import { css, styled } from "styled-components";

const VARIANTS = {
  NEG: "NEGATIVE",
  POS: "POSITIVE",
};

export default function WorkhoursBar({
  goal = 160,
  max = goal * 1.25,
  current,
}) {
  const isOvertime = current > goal;

  const toRelative = (value) => Math.round((value / max) * 100);

  return (
    <Container>
      <Bar value={toRelative(Math.min(current, goal))} />
      {!isOvertime && (
        <Bar variant={VARIANTS.NEG} value={toRelative(goal - current)} />
      )}
      <GoalMark value={toRelative(goal)} />
      {isOvertime && (
        <Bar variant={VARIANTS.POS} value={toRelative(current - goal)} />
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  border: solid 1px var(--c-on-surface);
  border-radius: 16px;
  display: flex;
  padding: 4px;
  height: 64px;
  gap: 4px;
`;

const Bar = styled.div`
  background-color: var(--c-neutral);
  width: ${({ value }) => `${value}%`};
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
  top: 0;
  left: ${({ value }) => `${value}%`};
`;
