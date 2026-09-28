import { useEffect, useState } from 'react';
import { FALLBACK_MODELS, fetchModels } from '@/services/api';
import type { ModelOption } from '@/types/chat';

/** Loads the model list from the finance API, falling back to a built-in list if it's unreachable. */
export function useModels() {
  const [models, setModels] = useState<ModelOption[]>(FALLBACK_MODELS);

  useEffect(() => {
    let cancelled = false;
    fetchModels()
      .then(({ models }) => {
        if (!cancelled && models.length) setModels(models);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return models;
}
