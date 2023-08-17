import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import useSWR from "swr";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });
//const url = "/api/clockify";
//const fetcher = (url) => fetch(url).then((response) => response.json());

export default function Home() {
  const [data, setData] = useState();
  //const { data, isLoading } = useSWR(url, fetcher);
  const [view, setView] = useState("week");
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/clockify");
      const data = await response.json();
      setData(data);
    }
    fetchData();
  }, [view]);
  // if (isLoading) {
  //   return <h1>is Loading...</h1>;
  // }
  if (!data) {
    return <h1>Error</h1>;
  }
  if (view === "day") {
    for (let i = 0; i < data.length; i++) {
      if (data[i].day === data[i + 1]?.day) {
        data[i + 1].duration += data[i].duration;
        data.splice(i, 1);
      }
    }
  }
  if (view === "week") {
    console.log("in view: ", data);
    for (let i = 0; i < data.length; i++) {
      console.log(data[i].week);
      if (data[i].week === data[i + 1]?.week) {
        console.log("true. Delete ", i);
        data[i + 1].duration += data[i].duration;
        data.splice(i, 1);
      }
    }
  }
  console.log("DATA: ", data);
  // const days = JSON.parse(JSON.stringify(data));
  // const weeks = data.reduce((acc, entry) => {
  //   const currentWeek = entry.week;
  //   if (acc[0]?.week === entry.week) {
  //     acc[0].duration += entry.duration;
  //   } else {
  //     acc.unshift(entry);
  //   }
  //   return acc;
  // }, []);
  // console.log("weeks: ", weeks);
  return (
    <>
      <div>
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
          data.map((entry) => (
            <p key={entry.id}>
              {entry.start}: {entry.duration}
            </p>
          ))}
        {view === "week" &&
          data.map((entry) => (
            <p key={entry.id}>
              Woche {entry.week}: {entry.duration}
            </p>
          ))}
        <pre>{JSON.stringify(data, null, 2)}</pre>;
      </main>
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
