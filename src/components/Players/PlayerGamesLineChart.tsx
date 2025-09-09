import Chart from "chart.js/auto";
import { useEffect, useMemo } from "react";
import { useGames } from "../../hooks/useGames";
import { PlayerWithStats } from "../../state/Player";

type OwnProps = {
  player: PlayerWithStats;
};

export function PlayerGamesLineChart({ player }: OwnProps) {
  const { dbGames } = useGames();

  const playedGames = useMemo(() => {
    if (!dbGames) return [];
    return dbGames.filter((game) =>
      [
        game.player1.player,
        game.player2.player,
        game.player3.player,
        game.player4.player,
      ].includes(player.id)
    );
  }, [dbGames, player]);

  const wonGames = useMemo(() => {
    if (!dbGames) return [];
    return dbGames.filter(
      (game) =>
        (game.player1.player === player.id && game.player1.won) ||
        (game.player2.player === player.id && game.player2.won) ||
        (game.player3.player === player.id && game.player3.won) ||
        (game.player4.player === player.id && game.player4.won)
    );
  }, [dbGames, player]);

  const months = useMemo(() => {
    const months: string[] = [];
    for (const game of playedGames) {
      const dateObj = new Date(game.date);
      const monthStr = dateObj.toLocaleDateString("en-us", {
        month: "long",
        year: "numeric",
      });
      months.push(monthStr);
    }
    return months;
  }, [playedGames]);

  const gamesPlayed = useMemo(() => {
    const monthCounts: Record<string, number> = {};

    for (const month of months) {
      const games = playedGames.filter((game) => {
        const dateObj = new Date(game.date);
        const monthStr = dateObj.toLocaleDateString("en-us", {
          month: "long",
          year: "numeric",
        });
        return monthStr === month;
      });
      monthCounts[month] = games.length;
    }

    return monthCounts;
  }, [months, playedGames]);

  const gamesWon = useMemo(() => {
    const monthCounts: Record<string, number> = {};

    for (const month of months) {
      const games = wonGames.filter((game) => {
        const dateObj = new Date(game.date);
        const monthStr = dateObj.toLocaleDateString("en-us", {
          month: "long",
          year: "numeric",
        });
        return monthStr === month;
      });
      monthCounts[month] = games.length;
    }

    return monthCounts;
  }, [months, wonGames]);

  useEffect(() => {
    const canvas = document.getElementById("line-chart") as HTMLCanvasElement;
    let chart: Chart;

    if (canvas) {
      chart = new Chart(canvas, {
        type: "line",
        data: {
          labels: Object.keys(gamesPlayed),
          datasets: [
            {
              label: "Games Played",
              data: Object.values(gamesPlayed),
              borderColor: "#327dd7",
              pointBackgroundColor: "#327dd7",
              pointBorderColor: "white",
            },
            {
              label: "Games Won",
              data: Object.values(gamesWon),
              borderColor: "#5abe8c",
              pointBackgroundColor: "#5abe8c",
              pointBorderColor: "white",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          elements: {
            line: {
              tension: 0.3,
              borderWidth: 5,
            },
            point: {
              radius: 4,
              borderWidth: 2,
              hoverRadius: 5,
              hoverBorderWidth: 3,
            },
          },
          scales: {
            y: {
              type: "linear",
              max: Math.max(...Object.values(gamesPlayed)) + 1,
              min: 0,
              offset: true,
              ticks: {
                stepSize: 1,
                color: "#a1a1a1",
                padding: 10,
              },
              grid: {
                color: "#a1a1a1",
                lineWidth: 2,
              },
              border: {
                display: false,
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#a1a1a1",
              },
              border: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#a1a1a1",
                usePointStyle: true,
                pointStyleWidth: 10,
                boxHeight: 7,
                padding: 25,
              },
            },
          },
        },
      });
    }

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [gamesPlayed, gamesWon]);

  return <canvas id="line-chart" height="400" />;
}
