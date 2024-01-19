const objectIdPattern = new RegExp("^[0-9a-fA-F]{24}$");
const emailPattern = new RegExp("^[\\w!#$%&'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$");

export const ValidateObjectId = (id: string | null | undefined): boolean => {
  return id ? objectIdPattern.test(id) : false;
};
export const validateEmail = (email: string | null | undefined): boolean => {
    return email ? emailPattern.test(email) : false;
};
