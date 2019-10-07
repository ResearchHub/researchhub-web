export function isValidEmail(email) {
  const re = /\S+@\S+\.edu/;
  return re.test(email);
}
