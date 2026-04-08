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

function filterOutput(user, feature, output) {
  if (feature === "read:user") {
    return {
      id: output.id,
      username: output.username,
      features: output.features,
      created_at: output.created_at,
      updated_at: output.updated_at,
    };
  }
}

const authorization = {
  can,
  filterOutput,
};

export default authorization;
