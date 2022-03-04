export type MappedSet<Set extends string, T = string> = {
  [key in Set]: T;
};
