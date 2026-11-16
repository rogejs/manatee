type StorageConfig = "local" | "session";

interface PersistsConfig {
  name: string | null;
  storage: StorageConfig;
}

export type { StorageConfig, PersistsConfig };
