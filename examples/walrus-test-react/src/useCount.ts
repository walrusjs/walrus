import { useState, useCallback } from 'react';

type IUseCountResult = [number, () => void];

const useCount = (): IUseCountResult => {
  const [value, setValue] = useState(0);

  const count = useCallback(() => {
    setValue(value + 1);
  }, [setValue]);

  return [value, count];
};

export default useCount;

