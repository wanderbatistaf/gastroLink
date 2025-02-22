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
      whatsapp: "+55 11 98888-7777",
      dataCadastro: new Date(),
      updatedAt: new Date(),
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
      whatsapp: "+55 11 91234-5678",
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
      updatedAt: new Date(),
      formasPagamentoAceitas: ["pix", "cartao_credito", "cartao_debito", "dinheiro"],
      dadosPagamento: {
        pix: {
          chave: "bomsabor@banco.com",
          tipoChave: "email",
          titular: "Restaurante Bom Sabor LTDA",
          banco: "Banco X"
        }
      },
      configuracoesEntrega: {
        entrega: true,
        retirada: true,
        taxaEntregaFixa: 5.99,
        tempoEstimadoEntregaMinutos: 30
      },
      configuracoesPlataforma: {
        bannerUrl: "https://firebasestorage.googleapis.com/.../banner.jpg",
        tema: "claro",
        corPrimaria: "#ff6600",
        corSecundaria: "#333333",
        descricao: "O melhor sabor da cidade!",
        slogan: "Qualidade e sabor em um só lugar"
      }
    }
  },
  coupons: {
    coupon123: {
      codigo: "DESCONTO10",
      descricao: "10% de desconto na primeira compra",
      desconto: 10,
      validadeInicio: new Date(),
      validadeFim: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      ativo: true,
      restricoes: null,
      updatedAt: new Date()
    }
  },
  promotions: {
    promo123: {
      titulo: "Promoção de Pizzas",
      descricao: "30% de desconto em todas as pizzas",
      desconto: 30,
      validadeInicio: new Date(),
      validadeFim: new Date(new Date().setDate(new Date().getDate() + 7)),
      ativo: true,
      produtosAplicaveis: ["product123"],
      updatedAt: new Date()
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
    }

    // Criar cupons
    for (const [couponId, couponData] of Object.entries(initialData.coupons)) {
      await db.collection("coupons").doc(couponId).set(couponData);
      console.log(`✅ Cupom ${couponId} importado.`);
    }

    // Criar promoções
    for (const [promoId, promoData] of Object.entries(initialData.promotions)) {
      await db.collection("promotions").doc(promoId).set(promoData);
      console.log(`✅ Promoção ${promoId} importada.`);
    }

    // Criar chat do pedido
    const chatRef = db.collection("chats").doc("order123");
    await chatRef.set({
      orderId: "order123",
      clienteId: "user123",
      restauranteId: "business123",
      status: "ativo",
      dataCriacao: new Date(),
      updatedAt: new Date()
    });
    console.log(`💬 Chat criado para o pedido order123.`);

    // Criar primeira mensagem no chat
    await chatRef.collection("messages").add({
      remetenteId: "business123",
      destinatarioId: "user123",
      conteudo: "Olá! Seu pedido foi recebido. Estamos preparando!",
      tipo: "texto",
      lida: false,
      dataEnvio: new Date()
    });
    console.log(`💬 Mensagem inicial do chat enviada.`);

    // Criar menu dentro do restaurante
    const menuRef = db.collection("businesses").doc("business123").collection("menu");
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
    console.log(`✅ Produto importado.`);

    // Criar pedidos dentro do restaurante
    const ordersRef = db.collection("businesses").doc("business123").collection("orders");
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
    console.log(`✅ Pedido importado.`);

    // Criar customização da plataforma
    await db.collection("businesses").doc("business123").update({
      configuracoesPlataforma: {
        logoUrl: "https://firebasestorage.googleapis.com/.../logo.png",
        bannerUrl: "https://firebasestorage.googleapis.com/.../banner.jpg",
        titulo: "Restaurante Bom Sabor",
        tema: "claro",
        corPrimaria: "#ff6600",
        corSecundaria: "#333333",
        descricao: "O melhor sabor da cidade!",
        slogan: "Qualidade e sabor em um só lugar"
      }
    });
    console.log(`🎨 Customização da plataforma adicionada.`);

    console.log("🎉 Importação concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao importar dados:", error);
  }
}

// Executar importação
importData();