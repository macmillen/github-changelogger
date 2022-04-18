export const getInputEventValue = (event: Event): string => {
  const target = event.target as unknown;

  if (target instanceof HTMLInputElement) {
    return target.value;
  }

  return "";
};
