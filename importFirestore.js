const admin = require("firebase-admin");
const fs = require("fs");

// Inicializar Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Dados iniciais para o Firestore
const initialData = {
  users: {
    user123: {
      nome: "João Silva",
      email: "joao@email.com",
      tipo: "cliente",
      telefone: "+55 11 99999-9999",
      dataCadastro: new Date(),
      enderecos: [
        {
          apelido: "Casa",
          rua: "Rua das Flores",
          numero: "123",
          bairro: "Centro",
          cidade: "São Paulo",
          estado: "SP",
          cep: "01010-000",
          complemento: "Apto 45"
        }
      ],
      cartoes: [
        {
          apelido: "Visa Final 1234",
          bandeira: "Visa",
          numeroMascarado: "**** **** **** 1234",
          validade: "12/27",
          token: "gateway_token_abc123"
        }
      ]
    }
  },
  businesses: {
    business123: {
      nome: "Restaurante Bom Sabor",
      dono: "user123",
      cnpj: "12.345.678/0001-99",
      telefone: "+55 11 91234-5678",
      endereco: {
        rua: "Av. Paulista",
        numero: "1000",
        bairro: "Bela Vista",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01310-100",
        complemento: "Loja 10"
      },
      subdominio: "bomsabor.gastrolink.com.br",
      dataCadastro: new Date(),
      formasPagamentoAceitas: ["pix", "cartao_credito", "cartao_debito", "dinheiro"],
      dadosPagamento: {
        pix: {
          chave: "bomsabor@banco.com",
          tipoChave: "email",
          titular: "Restaurante Bom Sabor LTDA",
          banco: "Banco X"
        },
        contaBancaria: {
          banco: "001 - Banco do Brasil",
          agencia: "1234",
          conta: "56789-0",
          tipoConta: "corrente",
          titular: "Restaurante Bom Sabor LTDA"
        }
      },
      configuracoesEntrega: {
        entrega: true,
        retirada: true,
        taxaEntregaFixa: 5.99,
        tempoEstimadoEntregaMinutos: 30
      }
    }
  }
};

// Função para inserir os dados no Firestore
async function importData() {
  try {
    console.log("📦 Iniciando importação de dados...");

    // Criar usuários
    for (const [userId, userData] of Object.entries(initialData.users)) {
      await db.collection("users").doc(userId).set(userData);
      console.log(`✅ Usuário ${userId} importado.`);
    }

    // Criar negócios
    for (const [businessId, businessData] of Object.entries(initialData.businesses)) {
      await db.collection("businesses").doc(businessId).set(businessData);
      console.log(`✅ Negócio ${businessId} importado.`);

      // Criar menu dentro do restaurante
      const menuRef = db.collection("businesses").doc(businessId).collection("menu");
      await menuRef.doc("product123").set({
        nome: "Pizza Margherita",
        descricao: "Pizza com molho de tomate, queijo e manjericão.",
        preco: 39.90,
        imagemUrl: "https://firebasestorage.googleapis.com/...",
        categoria: "Pizzas",
        disponibilidade: "ativo",
        variacoes: [
          { nome: "Pequena", precoAdicional: 0 },
          { nome: "Média", precoAdicional: 5.00 },
          { nome: "Grande", precoAdicional: 10.00 }
        ],
        adicionais: [{ nome: "Queijo Extra", preco: 3.50 }]
      });
      console.log(`✅ Produto importado para ${businessId}.`);

      // Criar pedidos dentro do restaurante
      const ordersRef = db.collection("businesses").doc(businessId).collection("orders");
      const orderId = "order123";
      await ordersRef.doc(orderId).set({
        clienteId: "user123",
        produtos: [
          {
            produtoId: "product123",
            nome: "Pizza Margherita",
            quantidade: 1,
            precoUnitario: 39.90,
            variacoes: ["Grande"],
            adicionais: ["Queijo Extra"]
          }
        ],
        total: 43.40,
        status: "pendente",
        formaPagamento: "pix",
        entrega: {
          tipo: "delivery",
          endereco: {
            rua: "Rua das Flores",
            numero: "123",
            bairro: "Centro",
            cidade: "São Paulo",
            estado: "SP",
            cep: "01010-000",
            complemento: "Apto 45"
          },
          taxaEntrega: 5.99
        },
        dataPedido: new Date(),
        pagamento: {
          status: "pendente",
          transacaoId: "gateway_tx_abc123"
        }
      });
      console.log(`✅ Pedido importado para ${businessId}.`);

      // Criar notificação para o restaurante sobre o novo pedido
      await db.collection("notifications").add({
        destinatarioId: businessId,
        tipoDestinatario: "restaurante",
        mensagem: `Novo pedido recebido! Total: R$43.40`,
        pedidoId: orderId,
        status: "pendente",
        dataCriacao: admin.firestore.Timestamp.now()
      });
      console.log(`📢 Notificação enviada para o restaurante ${businessId}`);

      // Criar notificação para o cliente sobre a criação do pedido
      await db.collection("notifications").add({
        destinatarioId: "user123",
        tipoDestinatario: "cliente",
        mensagem: `Seu pedido foi criado e está aguardando confirmação do restaurante.`,
        pedidoId: orderId,
        status: "pendente",
        dataCriacao: admin.firestore.Timestamp.now()
      });
      console.log(`📢 Notificação enviada para o cliente user123`);
    }

    console.log("🎉 Importação concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao importar dados:", error);
  }
}

// Executar importação
importData();