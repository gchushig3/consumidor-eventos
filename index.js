const amqp = require("amqplib");

const QUEUE = "productos.consultados";

async function main() {
  const amqpUrl = process.env.AMQP_URL;
  if (!amqpUrl) throw new Error("Falta configurar AMQP_URL");

  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE, { durable: false });

  console.log("Escuchando eventos en la cola:", QUEUE);

  channel.consume(QUEUE, (msg) => {
    if (msg !== null) {
      const evento = JSON.parse(msg.content.toString());
      console.log("[Consumidor] Evento recibido:", evento);
      channel.ack(msg);
    }
  });
}

main().catch((err) => console.error("Error en el consumidor:", err.message));