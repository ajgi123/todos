import { Dispatch, SetStateAction, useEffect, useState } from "react";

const usePropsRelatedState = <T>(
  prop: T,
  dependacyArr: any[]
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState(prop);

  useEffect(() => {
    setState(prop);
  }, [prop, ...dependacyArr]);

  return [state, setState];
};

export default usePropsRelatedState;
