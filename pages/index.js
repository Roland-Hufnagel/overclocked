import WorkhoursBar from "@/components/WorkhoursBar";
import { useState } from "react";
import useSWR from "swr";

const start = new Date("2022/03/01").toISOString();
const end = new Date("2023/08/01").toISOString();

const url = `/api/clockify?start=${start}&end=${end}`;

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function Home() {
  const { data, isLoading } = useSWR(url, fetcher);
  const [exampleGoal, setExampleGoal] = useState(160);

  function handleGoalChange(newGoal) {
    setExampleGoal(newGoal);
  }

  if (isLoading) {
    return <h1>is Loading...</h1>;
  }
  if (!data) {
    return <h1>Error</h1>;
  }

  return (
    <>
      <WorkhoursBar
        current={120}
        goal={exampleGoal}
        dynamic
        onChange={setExampleGoal}
      />
      <WorkhoursBar current={40} />
      <pre>{JSON.stringify(data, null, 2)}</pre>;
    </>
  );
}
