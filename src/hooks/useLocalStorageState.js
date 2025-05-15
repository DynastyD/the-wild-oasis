import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(function () {
    // 安全地访问localStorage
    if (typeof localStorage !== 'undefined') {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialState;
    }
    return initialState;
  });

  useEffect(
    function () {
      // 确保只在客户端存储数据
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    },
    [value, key]
  );

  return [value, setValue];
}
