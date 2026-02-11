import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard", {
          method: "GET",
          credentials: "include", // required for cookies
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        setData(data);
      } catch (err) {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;
  if (!data) return null;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>{data.message}</p>
      <p>User ID: {data.userId}</p>
    </div>
  );
};

export default Dashboard;
