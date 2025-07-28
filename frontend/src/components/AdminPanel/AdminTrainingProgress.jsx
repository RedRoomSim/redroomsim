import React, { useEffect, useState } from "react";
import useTableSortResize from "../../hooks/useTableSortResize";
import axios from "axios";

const AdminTrainingProgress = () => {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [scenarioMap, setScenarioMap] = useState({});

  const {
    sortConfig,
    handleSort,
    columnWidths,
    sortData,
    getSortSymbol,
  } = useTableSortResize({
    username: 200,
    name: 200,
    score: 120,
    result: 120,
    completed: 120,
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(
          "https://api.redroomsim.com/progress/all"
        );
        setRecords(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Failed to fetch progress", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const res = await axios.get("https://api.redroomsim.com/sim/list");
        const map = {};

        if (Array.isArray(res.data?.scenarios)) {
          for (const s of res.data.scenarios) {
            try {
              const detail = await axios.get(
                `https://api.redroomsim.com/sim/${s.id}`
              );
              map[s.id] = {
                name: s.name,
                steps: Array.isArray(detail.data?.steps)
                  ? detail.data.steps.length
                  : 0,
              };
            } catch (err) {
              map[s.id] = { name: s.name, steps: 0 };
            }
          }
        }

        setScenarioMap(map);
      } catch (err) {
        console.error("Failed to fetch scenario list", err);
      }
    };
    fetchScenarios();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    const result = records.filter((r) =>
      r.username.toLowerCase().includes(term)
    );
    setFiltered(result);
  }, [search, records]);

  const sorted = sortData(filtered);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Training Progress</h2>
      <input
        type="text"
        placeholder="Search by username..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
      />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto">
          <thead className="bg-gray-200 dark:bg-gray-700 text-left">
            <tr>
              <th style={{ width: columnWidths.username }} className="px-4 py-2">
                <div className="flex items-center">
                  <span className="cursor-pointer" onClick={() => handleSort('username')}>
                    User {getSortSymbol('username')}
                  </span>
                </div>
              </th>
              <th style={{ width: columnWidths.name }} className="px-4 py-2">
                <div className="flex items-center">
                  <span className="cursor-pointer" onClick={() => handleSort('name')}>
                    Training {getSortSymbol('name')}
                  </span>
                </div>
              </th>
              <th style={{ width: columnWidths.score }} className="px-4 py-2">
                <div className="flex items-center">
                  <span className="cursor-pointer" onClick={() => handleSort('score')}>
                    Score (%) {getSortSymbol('score')}
                  </span>
                </div>
              </th>
              <th style={{ width: columnWidths.result }} className="px-4 py-2">
                <div className="flex items-center">
                  <span className="cursor-pointer" onClick={() => handleSort('result')}>
                    Result {getSortSymbol('result')}
                  </span>
                </div>
              </th>
              <th style={{ width: columnWidths.completed }} className="px-4 py-2">
                <div className="flex items-center">
                  <span className="cursor-pointer" onClick={() => handleSort('completed')}>
                    Status {getSortSymbol('completed')}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, idx) => (
              <tr key={idx} className="border-t border-gray-300 dark:border-gray-600">
                <td style={{ width: columnWidths.username }} className="px-4 py-2">{r.username}</td>
                <td style={{ width: columnWidths.name }} className="px-4 py-2">{r.name}</td>
                <td style={{ width: columnWidths.score }} className="px-4 py-2">
                  {(() => {
                    const steps = scenarioMap[r.scenario_id]?.steps;
                    if (!steps || r.score === null || r.score === undefined) return '-';
                    const pct = Math.round((r.score / steps) * 100);
                    return `${pct}%`;
                  })()}
                </td>
                <td
                  style={{ width: columnWidths.result }}
                  className={(() => {
                    if (!r.completed) return 'px-4 py-2';
                    const steps = scenarioMap[r.scenario_id]?.steps;
                    if (!steps || r.score === null || r.score === undefined)
                      return 'px-4 py-2';
                    const pct = Math.round((r.score / steps) * 100);
                    return `px-4 py-2 ${pct >= 70 ? 'text-green-600' : 'text-red-600'}`;
                  })()}
                >
                  {(() => {
                    if (!r.completed) return '-';
                    const steps = scenarioMap[r.scenario_id]?.steps;
                    if (!steps || r.score === null || r.score === undefined) return '-';
                    const pct = Math.round((r.score / steps) * 100);
                    return pct >= 70 ? 'Pass' : 'Fail';
                  })()}
                </td>
                <td style={{ width: columnWidths.completed }} className="px-4 py-2">
                  {r.completed ? 'Completed' : 'Incomplete'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTrainingProgress;
