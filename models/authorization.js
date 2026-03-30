function can(user, feature) {
  let authorized = false;

  console.log("can(): user.features=", user.features);

  if (user.features.includes(feature)) {
    authorized = true;
  }

  return authorized;
}

const authorization = {
  can,
};

export default authorization;
