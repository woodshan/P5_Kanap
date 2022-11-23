// Get order ID in URL
let idOrder = new URL(location.href).searchParams.get("orderId");

// Display order ID in DOM
let numberOrder = document.querySelector("#orderId");
numberOrder.textContent = idOrder;