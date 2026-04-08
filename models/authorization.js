function can(user, feature, resource) {
  let authorized = false;

  // console.log("can(): user features=", user.features);
  // console.log("can(): resource=", user.resource);

  if (user.features.includes(feature)) {
    authorized = true;
  }

  if (feature === "update:user" && resource) {
    authorized = false;

    if (user.id == resource.id || can(user, "update:user:others")) {
      authorized = true;
    }
  }

  return authorized;
}

const authorization = {
  can,
};

export default authorization;
