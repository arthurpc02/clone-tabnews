function status(request, response) {
  response.status(200).json({ chave: "valor são acima" });
}

export default status;
