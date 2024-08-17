import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Scores } from "../types/types";

interface EndGameProps {
  images: string[];
}

const EndGame: React.FC<EndGameProps> = ({ images }: EndGameProps) => {
  const location = useLocation();
  const roomId = location.state.roomId;
  const [scores, setScores] = useState<Scores | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get<{ scores: Scores }>(
          "http://localhost:2000/api/getScores",
          {
            params: { roomId },
          }
        );
        setScores(response.data.scores);
      } catch (err) {
        setError("Failed to fetch scores");
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [roomId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const sortedScores = scores
    ? Object.entries(scores).sort((a, b) => a[1] - b[1])
    : [];

  return (
    <div>
      <h1>Room ID: {roomId}</h1>
      <h2>Scores</h2>
      {scores && (
        <ul>
          {sortedScores.map(([username, score]) => (
            <li key={username}>
              {username}: {score}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EndGame;
