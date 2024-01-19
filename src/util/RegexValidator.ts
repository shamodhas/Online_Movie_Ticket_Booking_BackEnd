const objectIdRegex = new RegExp("^[0-9a-fA-F]{24}$");

export const ValidateObjectId = (id: string): boolean => {
  return objectIdRegex.test(id);
};
