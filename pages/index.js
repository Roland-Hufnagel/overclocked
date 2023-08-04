import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import useSWR from "swr";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });
const url = "/api/clockify";
const fetcher = (url) => fetch(url).then((response) => response.json());

export default function Home() {
  const { data, isLoading } = useSWR(url, fetcher);
  //const [view, setView] = useState("day");

  if (isLoading) {
    return <h1>is Loading...</h1>;
  }
  if (!data) {
    return <h1>Error</h1>;
  }
  console.log("DATA: ", data);
  const days = JSON.parse(JSON.stringify(data));
  const weeks = data.reduce((acc, entry) => {
    const currentWeek = entry.week;
    if (acc[0]?.week === entry.week) {
      acc[0].duration += entry.duration;
    } else {
      acc.unshift(entry);
    }
    return acc;
  }, []);
  console.log("weeks: ", weeks);
  return (
    <>
      {/* <div>
        <button
          type="button"
          onClick={() => {
            setView("day");
          }}
        >
          Day
        </button>
        <button
          type="button"
          onClick={() => {
            setView("week");
          }}
        >
          Week
        </button>
        <button
          type="button"
          onClick={() => {
            setView("month");
          }}
        >
          Month
        </button>
      </div>
      <main>
        {view === "day" &&
          days.map((entry) => (
            <p key={entry.date}>
              {entry.date}: {entry.duration}
            </p>
          ))}
        {view === "week" &&
          weeks.map((entry) => (
            <p key={entry.date}>
              Woche {entry.week}: {entry.duration}
            </p>
          ))}
        <pre>{JSON.stringify(data, null, 2)}</pre>;
      </main> */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );

  if (view === "day") {
    return data.map((entry) => (
      <p key={entry.date}>
        {entry.date}: {entry.duration} Minuten
      </p>
    ));
  }
  if (view === "week") {
    return data
      .reduce((acc, entry) => {
        const currentWeek = entry.week;
        if (acc[0]?.week === entry.week) {
          acc[0].duration += entry.duration;
        } else {
          acc.unshift(entry);
          console.log("unshift: ", entry);
        }
        return acc;
      }, [])
      .map((entry) => (
        <p key={entry.date}>
          Woche {entry.week}: {entry.duration} Minuten
        </p>
      ));
  }
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
