📌 TODO - Planejamento do GastroLink

1️⃣ Desenvolvimento do Backend (Functions e Firestore)

✅ Criar estrutura básica do backend com Firebase Functions
✅ Implementar função createOrder para criar pedidos no Firestore
✅ Adicionar serverTimestamp corretamente nas funções
✅ Corrigir erro do Firestore Emulator vs Firestore Real
✅ Testar a criação de pedidos via script (testFunctions.js)
🟡 Validar se os pedidos estão sendo gravados no Firestore real
🟡 Revisar regras de segurança do Firestore para garantir acesso correto
🔲 Melhorar tratamento de erros e logs nas functions
🔲 Implementar notificação em tempo real via Firestore


2️⃣ Desenvolvimento do Frontend (Painel de Controle e Interface do Cliente)

🔲 Criar estrutura inicial do frontend (provavelmente com React ou Angular?)
🔲 Definir componentes principais (Login, Dashboard, Pedidos, Notificações)
🔲 Conectar o frontend com Firebase Auth para autenticação
🔲 Criar interface para restaurantes gerenciarem pedidos
🔲 Criar interface para clientes fazerem pedidos e acompanharem status


3️⃣ Testes e Ajustes Gerais

🔲 Verificar se os pedidos do Firestore real aparecem no frontend
🔲 Testar requisições para createOrder, updateOrderStatus, sendMessage no ambiente real
🔲 Rodar firebase functions:log e corrigir possíveis erros
🔲 Melhorar estrutura do banco de dados para futuras implementações
🔲 Testar regras do Firestore para garantir que tudo esteja seguro


4️⃣ Deploy e Integração

🔲 Configurar ambiente de produção e desenvolvimento no Firebase
🔲 Revisar custos no Firebase para manter tudo gratuito durante o desenvolvimento
🔲 Fazer firebase deploy --only functions e testar no ambiente real
🔲 Validar funcionamento das funções depois do deploy