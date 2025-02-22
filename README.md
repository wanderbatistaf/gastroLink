# 🍽️ GastroLink - Sistema de Cardápio e Pedidos Online

O **GastroLink** é um sistema web para restaurantes, docerias e similares, permitindo que clientes façam pedidos e pagamentos diretamente por um subdomínio personalizado (ex: `restaurante.gastrolink.com.br`).  

## 🚀 **Rodando o Projeto Localmente (Sem Custos)**

Para garantir que o desenvolvimento ocorra **sem gerar custos no Firebase**, utilize os **Emuladores do Firebase**.

### **1️⃣ Instalar as Dependências**
Se ainda não instalou as dependências, rode:

```sh
npm install
```

### **2️⃣ Iniciar os Emuladores do Firebase**
Para rodar o projeto **localmente**, utilize:

```sh
firebase emulators:start
```

Isso **iniciará os serviços localmente**, incluindo:
- **Firestore Emulator** (Banco de dados)
- **Cloud Functions Emulator** (API backend)
- **Firebase Authentication Emulator** (Autenticação)
- **Firebase Storage Emulator** (Upload de imagens)

🚀 **Dessa forma, o desenvolvimento será gratuito, sem consumir recursos do Firebase real.**

### **3️⃣ Testando as Cloud Functions**
Depois de iniciar os emuladores, acesse o painel local:

📌 **Emulator UI:** [`http://localhost:4000`](http://localhost:4000)  

Caso precise testar uma função específica, use:

```sh
curl http://localhost:5001/gastrolink-fc652/us-central1/helloWorld
```

---

## 🔥 **Evitar Custos no Firebase**
Se precisar fazer deploy no Firebase, siga as recomendações para evitar cobranças:
1. **Prefira rodar emuladores em vez do Firebase real** (`firebase emulators:start`).
2. **Caso precise fazer deploy, use a 1ª geração de Cloud Functions**:

   ```sh
   firebase deploy --only functions --gen 1
   ```

3. **Verifique o uso do Firebase antes de qualquer deploy**:

   ```sh
   firebase open billing
   ```

---

## 📌 **Outros Comandos Úteis**
| Comando | Descrição |
|---------|-------------|
| `npm install` | Instala as dependências do projeto |
| `firebase emulators:start` | Inicia os emuladores do Firebase (modo gratuito) |
| `firebase deploy --only functions` | Faz o deploy das funções para o Firebase |
| `firebase functions:secrets:set SERVICE_ACCOUNT_KEY` | Adiciona a chave de serviço ao Firebase |

---

## 📄 **Licença**

