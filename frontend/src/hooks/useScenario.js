/**
 * Author: Umair Asad
 * Version: 1.0
 * Last Modified: 2025-06-10
 * Updated Functionality: Custom hook to fetch scenarios from API
 */

import { useEffect, useState } from "react";
import axios from "axios";

const useScenario = () => {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await axios.get("http://localhost:8000/scenarios");
        setScenarios(response.data);
      } catch (error) {
        console.error("Failed to fetch scenarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScenarios();
  }, []);

  return { scenarios, loading };
};

export default useScenario;
