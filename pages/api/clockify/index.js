export default async function handler(request, response) {
  if (request.method === "GET") {
    console.log("im GET request");
    const data = await getClockifyData();

    const timeEntries = data
      .map(({ id, timeInterval: { start, end } }) => ({
        id,
        start,
        end,
        day: new Date(start).getDate(),
        duration: cleverParseDuration(start, end),
      }))
      .reduce((acc, entry) => {
        const date = new Date(entry.start);
        const day = new Date(entry.start).getDate();
        const currentDayEntry = acc.find((entry) => entry.day === day);

        if (currentDayEntry) {
          currentDayEntry.duration += entry.duration;
        } else {
          acc.push({
            id: entry.id,
            date: date.toLocaleDateString(),
            week: getWeekNumber(date),
            day: day,
            weekDay: date.getDay(),
            duration: entry.duration,
          });
        }

        return acc;
      }, []);

    response.json(timeEntries);
  } else {
    response.json({ message: "Something went wrong" });
  }
}

async function getClockifyData() {
  const { API_KEY } = process.env;
  const userUrl = "https://api.clockify.me/api/v1/user";

  const userResponse = await fetch(userUrl, {
    headers: {
      "x-api-key": API_KEY,
    },
  });

  const { id: userId, activeWorkspace: workspaceId } =
    await userResponse.json();

  const date = new Date("2023/07/06");

  const currentMonth = (date.getMonth() + 1).toString().padStart(2, "0");
  const currentYear = date.getFullYear();
  console.log(currentYear);

  console.log(currentMonth);

  const response = await fetch(
    `https://api.clockify.me/api/v1/workspaces/${workspaceId}/user/${userId}/time-entries?start=${currentYear}-${currentMonth}-01T00:00:00Z`,
    {
      headers: {
        "x-api-key": API_KEY,
      },
    }
  );
  const data = await response.json();
  return data;
}

function parseDuration(time) {
  const hIndex = time.indexOf("H");
  const mIndex = time.indexOf("M");

  if (hIndex >= 0 && mIndex >= 0) {
    const hours = Number(time.slice(2, hIndex));
    const minutes = Number(time.slice(hIndex + 1, mIndex));
    return minutes + hours * 60;
  }

  if (hIndex >= 0) {
    const hours = Number(time.slice(2, hIndex));
    return hours * 60;
  }

  if (mIndex >= 0) {
    const minutes = Number(time.slice(2, mIndex));
    return minutes;
  }

  return 0;
}

function cleverParseDuration(start, end) {
  const time1 = new Date(start);
  const time2 = end ? new Date(end) : new Date();

  return Math.floor((time2 - time1) / (60 * 1000));
}

function getWeekNumber(currentDate) {
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

  return Math.ceil(days / 7);
}
