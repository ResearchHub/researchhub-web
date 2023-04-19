export const toFormData = (obj: object): FormData => {
  const formData = new FormData();
  for (const key in obj) {
    let value = obj[key];
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    formData.append(key, value);
  }
  return formData;
};
