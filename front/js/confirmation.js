let idOrder = new URL(location.href).searchParams.get("orderId");

let numberOrder = document.querySelector("#orderId");
numberOrder.textContent = idOrder;