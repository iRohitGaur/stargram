export const isValidEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
    ? true
    : false;
};

export const isValidPassword = (password: string) => {
  return password.length > 5;
};

export const isValidName = (name: string) => {
  return name.length > 2;
};

export const isValidUsername = (username: string) => {
  return username.length > 2;
};
