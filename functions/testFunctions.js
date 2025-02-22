const { getFunctions, httpsCallable, connectFunctionsEmulator } = require("firebase/functions");
const { initializeApp } = require("firebase/app");

// Configuração do Firebase para rodar no emulador
const firebaseConfig = {
  projectId: "gastrolink-fc652",
};
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
connectFunctionsEmulator(functions, "localhost", 5001); // Conectando ao emulador local

async function testCreateOrder() {
  const createOrder = httpsCallable(functions, "createOrder");

  try {
    const response = await createOrder({
      clienteId: "user123",
      businessId: "business123",
      produtos: [{ produtoId: "product123", nome: "Pizza Margherita", preco: 39.90 }],
      total: 39.90,
      formaPagamento: "pix",
      entrega: { tipo: "delivery", endereco: "Rua das Flores, 123" }
    });

    console.log("✅ Pedido criado:", response.data);
  } catch (error) {
    console.error("❌ Erro ao criar pedido:", error);
  }
}

// Executar a função de teste
testCreateOrder();