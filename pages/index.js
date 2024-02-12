import useSWR from "swr";
const start = new Date("2022/03/01").toISOString();
const end = new Date("2023/08/01").toISOString();

const url = `/api/clockify?start=${start}&end=${end}`;

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function Home() {
  const { data, isLoading } = useSWR(url, fetcher);

  if (isLoading) {
    return <h1>is Loading...</h1>;
  }
  if (!data) {
    return <h1>Error</h1>;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
