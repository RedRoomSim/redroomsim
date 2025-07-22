import { useState, useCallback } from "react";

const useTableSortResize = (initialWidths = {}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [columnWidths, setColumnWidths] = useState(initialWidths);

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => {
      let direction = "asc";
      if (prev.key === key && prev.direction === "asc") direction = "desc";
      return { key, direction };
    });
  }, []);

  const handleMouseDown = useCallback(
    (key, e) => {
      e.preventDefault();
      const th = e.currentTarget.closest("th");
      const startX = e.clientX;
      const startWidth = columnWidths[key] || (th ? th.offsetWidth : 0);
      const onMouseMove = (ev) => {
        const newWidth = Math.max(50, startWidth + ev.clientX - startX);
        setColumnWidths((prev) => ({ ...prev, [key]: newWidth }));
      };
      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [columnWidths]
  );

  const getSortSymbol = useCallback(
    (key) => {
      if (sortConfig.key !== key) return "";
      return sortConfig.direction === "asc" ? "▲" : "▼";
    },
    [sortConfig]
  );

  const sortData = useCallback(
    (data) => {
      if (!sortConfig.key) return data;
      return [...data].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    },
    [sortConfig]
  );

  return {
    sortConfig,
    handleSort,
    columnWidths,
    handleMouseDown,
    sortData,
    getSortSymbol,
  };
};

export default useTableSortResize;
