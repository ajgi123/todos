export const tryCatch = async <T extends Promise<any>>(
  promise: T
): Promise<[any, any]> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error];
  }
};
