import { useEffect, useState } from "react";

// Assume this hook exists and works like useState but syncs with localStorage
import { useLocalStorage } from "./useLocalStorage";

export interface ConfigData {
  nftyTopic: string;
  emojis: string[];
}

export interface UseConfigData {
  config: ConfigData | null;
  loading: boolean;
  error: Error | null;
}

let sharedPromise: Promise<ConfigData> | null = null;
let sharedConfig: ConfigData | null = null;
let listeners: ((data: ConfigData) => void)[] = [];

function fetchConfig(): Promise<ConfigData> {
  if (sharedConfig) return Promise.resolve(sharedConfig);
  if (sharedPromise) return sharedPromise;
  sharedPromise = fetch("/config.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch config");
      return res.json();
    })
    .then((data: ConfigData) => {
      sharedConfig = data;
      listeners.forEach((cb) => cb(data));
      listeners = [];
      return data;
    })
    .catch((err) => {
      listeners = [];
      throw err;
    });
  return sharedPromise;
}

/** Asynchronously loads the application config, sharing requests and caching in localStorage. */
export function useConfig(): UseConfigData {
  const [localConfig, setLocalConfig] = useLocalStorage<ConfigData | null>(
    "config",
    null
  );
  const [config, setConfig] = useState<ConfigData | null>(localConfig);
  const [loading, setLoading] = useState(!localConfig);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Serve cached config immediately
    if (localConfig) {
      setConfig(localConfig);
      setLoading(true);
    }

    // Subscribe to shared config updates
    listeners.push((data) => {
      if (!cancelled) {
        setConfig(data);
        setLocalConfig(data);
        setLoading(false);
      }
    });

    fetchConfig()
      .then((data) => {
        if (!cancelled) {
          setConfig(data);
          setLocalConfig(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { config, loading, error };
}
