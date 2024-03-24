const express = require("express");
const uuid = require("uuid");

const port = 3000;
const app = express();
app.use(express.json());

const orders = [];

const checkOrderId = (request, response, next) => {
  // middleware para verificar se o ID existe, se não retorna erro de não encontrado
  // a const INDEX recebe a posição que o ID está no array ORDERS
  const { id } = request.params;

  const index = orders.findIndex((order) => order.id === id);

  if (index < 0) {
    return response.status(404).json({ error: "Order not found" });
  }

  request.orderIndex = index;
  request.orderId = id;

  next();
};

const checkMethodUrl = (request, response, next) => {
  // middleware para informar qual metodo ou porta está sendo utilizada e qual url
  const url = request.url;
  const method = request.method;

  console.log(`The method used is: ${method}, and the url used is: ${url}`);

  next();
};

app.get("/order", checkMethodUrl, (request, response) => {
  return response.json(orders); // get utilizado para vermos todos pedidos gerados
});

app.post("/order", checkMethodUrl, (request, response) => {
  const { orderClient, nameClient, priceOrder } = request.body; // criamos o pedido do cliente recebendo as informações pelo body

  const status = "Em Preparação";

  const order = { id: uuid.v4(), orderClient, nameClient, priceOrder, status }; // order criada, incluimos um id único e o status em preparação

  orders.push(order); // a order criada e empurrada para dentro do array orders

  return response.status(201).json(order);
});

app.put("/order/:id", checkOrderId, checkMethodUrl, (request, response) => {
  const { orderClient, nameClient, priceOrder } = request.body;
  const index = request.orderIndex;
  const id = request.orderId;

  const status = "Em Preparação";

  const updateOrder = { id, orderClient, nameClient, priceOrder, status }; // podemos fazer uma atualização no pedido existente, podendo alterar somente o orderClient, nameClient, priceOrder

  orders[index] = updateOrder; // empurramos o pedido atualizado para dentro do array

  return response.json(updateOrder);
});

app.delete("/order/:id", checkOrderId, checkMethodUrl, (request, response) => {
  const index = request.orderIndex;

  orders.splice(index, 1); // aqui podemos deletar um pedido pelo o seu ID que é único

  return response.status(204).json();
});

app.get("/order/:id", checkOrderId, checkMethodUrl, (request, response) => {
  const { orderClient, nameClient, priceOrder, status } = request.body;
  const index = request.orderIndex;
  const id = request.orderId;

  return response.json(orders[index]); // retornamos as informações somente do pedido pesquisado pela ID
});

app.patch("/order/:id", checkOrderId, checkMethodUrl, (request, response) => {
  const { orderClient, nameClient, priceOrder } = request.body;
  const index = request.orderIndex;
  const id = request.orderId;

  const orderReady = {
    id,
    orderClient: orders[index].orderClient,
    nameClient: orders[index].nameClient,
    priceOrder: orders[index].priceOrder,
    status: "Pedido Pronto",
  }; // pesquisamos o pedido existente pela ID e alteramos o status dele para PRONTO

  orders[index] = orderReady; // atualizamos a array que contem todos pedidos, inserindo o pedido com status pedido pronto

  return response.json(orderReady);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
