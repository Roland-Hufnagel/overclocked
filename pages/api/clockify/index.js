export default async function handler(request, response) {
  if (request.method === "GET") {
    const data = await getClockifyData(request.query.start, request.query.end);
    const timeEntries = data
      .map(({ id, timeInterval: { start, end } }) => ({
        id,
        start,
        end,
        duration: cleverParseDuration(start, end),
      }))
      .reduce((acc, entry) => {
        const date = new Date(entry.start);

        const currentDateEntry = acc.find(
          (entry) => entry.date === date.toLocaleDateString()
        );

        if (currentDateEntry) {
          currentDateEntry.duration += entry.duration;
        } else {
          acc.push({
            id: entry.id,
            day: date.getDate(),
            week: getWeekNumber(date),
            weekday: date.getDay(),
            month: date.getMonth(),
            year: date.getFullYear(),
            date: date.toLocaleDateString(),
            duration: entry.duration,
          });
        }

        return acc;
      }, []);

    response.json(timeEntries);
    return;
  }
  response.json({ message: "Something went wrong" });
}

async function getClockifyData(start, end) {
  const { API_KEY } = process.env;
  const userUrl = "https://api.clockify.me/api/v1/user";

  const userResponse = await fetch(userUrl, {
    headers: {
      "x-api-key": API_KEY,
    },
  });

  const { id: userId, activeWorkspace: workspaceId } =
    await userResponse.json();

  const response = await fetch(
    `https://api.clockify.me/api/v1/workspaces/${workspaceId}/user/${userId}/time-entries?page-size=0&start=${start}&end=${end}`,
    {
      headers: {
        "x-api-key": API_KEY,
      },
    }
  );
  const data = await response.json();
  return data;
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
