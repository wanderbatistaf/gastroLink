const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

// 🔥 Garante que o Firebase Admin não seja inicializado duas vezes
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * 🔥 Função para criar um novo pedido
 */
exports.createOrder = onCall(async (request, context) => {
  try {
    console.log("📥 Requisição recebida:", request.data);

    const { clienteId, businessId, produtos, total, formaPagamento, entrega } = request.data || {};

    if (!clienteId || !businessId || !Array.isArray(produtos) || produtos.length === 0 || !total || !formaPagamento) {
      console.error("❌ Erro: Dados incompletos para criar pedido!", {
        clienteId, businessId, produtos, total, formaPagamento, entrega
      });
      throw new Error("Dados incompletos para criar pedido");
    }

    const orderRef = db.collection("businesses").doc(businessId).collection("orders").doc();
    const orderId = orderRef.id;

    const timestampAtual = new Date(); // ✅ Alternativa segura para timestamp

    await orderRef.set({
      clienteId,
      produtos,
      total,
      status: "pendente",
      formaPagamento,
      entrega,
      dataPedido: timestampAtual, // ✅ Timestamp manual
      pagamento: { status: "pendente" }
    });

    console.log(`✅ Pedido criado com sucesso. ID: ${orderId}`);

    await db.collection("chats").doc(orderId).set({
      orderId,
      clienteId,
      restauranteId: businessId,
      status: "ativo",
      dataCriacao: timestampAtual // ✅ Timestamp manual
    });

    console.log(`💬 Chat criado para o pedido ${orderId}`);

    await db.collection("chats").doc(orderId).collection("messages").add({
      remetenteId: businessId,
      destinatarioId: clienteId,
      conteudo: "Olá! Seu pedido foi recebido. Estamos preparando!",
      tipo: "texto",
      lida: false,
      dataEnvio: timestampAtual // ✅ Timestamp manual
    });

    console.log(`📩 Mensagem inicial enviada para o chat do pedido ${orderId}`);

    return { success: true, orderId };
  } catch (error) {
    console.error("❌ Erro ao criar pedido:", error);
    throw new Error(`Erro ao criar pedido: ${error.message}`);
  }
});

/**
 * 🔥 Função para atualizar o status do pedido
 */
exports.updateOrderStatus = onCall(async (request, context) => {
  try {
    if (!context.auth) {
      throw new Error("Não autorizado");
    }

    const { businessId, orderId, status } = request.data || {};

    if (!businessId || !orderId || !status) {
      throw new Error("Dados incompletos para atualizar status do pedido");
    }

    const orderRef = db.collection("businesses").doc(businessId).collection("orders").doc(orderId);
    await orderRef.update({ status });

    // Enviar notificação para o cliente
    await sendNotification({
      destinatarioId: (await orderRef.get()).data().clienteId,
      mensagem: `O status do seu pedido foi atualizado para: ${status}`,
      pedidoId: orderId
    });

    return { success: true, status };
  } catch (error) {
    console.error("❌ Erro ao atualizar status do pedido:", error);
    throw new Error(`Erro ao atualizar status do pedido: ${error.message}`);
  }
});

/**
 * 🔥 Função para enviar mensagens no chat
 */
exports.sendMessage = onCall(async (request, context) => {
  try {
    if (!context.auth) {
      throw new Error("Não autorizado");
    }

    const { orderId, remetenteId, destinatarioId, conteudo, tipo } = request.data || {};

    if (!orderId || !remetenteId || !destinatarioId || !conteudo || !tipo) {
      throw new Error("Dados incompletos para enviar mensagem");
    }

    const chatRef = db.collection("chats").doc(orderId).collection("messages");
    await chatRef.add({
      remetenteId,
      destinatarioId,
      conteudo,
      tipo,
      lida: false,
      dataEnvio: admin.firestore.Timestamp.now() // 🔥 Alterado para evitar erro
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem:", error);
    throw new Error(`Erro ao enviar mensagem: ${error.message}`);
  }
});

/**
 * 🔥 Função para enviar notificações
 */
async function sendNotification({ destinatarioId, mensagem, pedidoId }) {
  try {
    await db.collection("notifications").add({
      destinatarioId,
      mensagem,
      pedidoId,
      status: "pendente",
      dataCriacao: admin.firestore.Timestamp.now() // 🔥 Alterado para evitar erro
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Erro ao enviar notificação:", error);
    throw new Error(`Erro ao enviar notificação: ${error.message}`);
  }
}