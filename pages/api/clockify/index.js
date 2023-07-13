export default async function handler(request, response) {
  if (request.method === "GET") {
    console.log("im GET request");
    const data = await getClockifyData();

    console.log(parseDuration(time));
    response.json(data);
  } else {
    response.json({ message: "Something went wrong" });
  }
}

async function getClockifyData() {
  const { API_KEY } = process.env;
  const userId = "6401f50f6f72072d66fdfcfd";
  const workspaceId = "6401f50f6f72072d66fdfcfe";
  const response = await fetch(
    `https://api.clockify.me/api/v1/workspaces/${workspaceId}/user/${userId}/time-entries?start=2023-07-01T00:00:00Z`,
    {
      headers: {
        "x-api-key": API_KEY,
      },
    }
  );
  const data = await response.json();
  return data;
}
const time = "PT10H3M";
function parseDuration(time) {
  const hIndex = time.indexOf("H");
  const mIndex = time.indexOf("M");

  const hours = Number(time.slice(2, hIndex));
  const minutes = Number(time.slice(hIndex + 1, mIndex));

  const result = minutes + hours * 60;
  return result;
}
