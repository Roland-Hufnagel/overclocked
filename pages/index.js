import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import useSWR from "swr";

const inter = Inter({ subsets: ["latin"] });
const url = "/api/clockify";
const fetcher = (url) => fetch(url).then((response) => response.json());

export default function Home() {
  const { data: timeEntries, isLoading, error } = useSWR(url, fetcher);

  if (isLoading) {
    return <h1>is Loading...</h1>;
  }
  if (!timeEntries) {
    return <h1>Error: {error.message}</h1>;
  }
  console.log(timeEntries);

  return (
    <main>
      <h1>OverClocked</h1>
      <section>
        <h2>Current Month</h2>
        <ul className="entry-list">
          {timeEntries.map((entry) => {
            const overTime = entry.duration - 4 * 60;
            return (
              <li className="entry" key={entry.id}>
                <h3>{entry.start}</h3>
                <p>{overTime} minutes</p>
                <div className="entry-bar-container">
                  <div
                    style={{
                      "--width": `${
                        ((Math.abs(overTime) / (2 * 60)) * 100) / 2
                      }%`,
                    }}
                    className={`entry-bar ${
                      overTime >= 0
                        ? "entry-bar--positive"
                        : "entry-bar--negative"
                    }`}
                  ></div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
