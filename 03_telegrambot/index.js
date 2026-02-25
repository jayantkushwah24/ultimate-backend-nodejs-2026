import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("Swagat Hai Aapka! Jayant Kushwah Ke BOT Par."));

bot.command("hello", (ctx) => ctx.reply("Sita-Ram🫶🏻"));

bot.command("joke", async (ctx) => {
  const response = await axios.get(
    "https://official-joke-api.appspot.com/random_joke",
  );
  const setup = response.data.setup;
  const punchline = response.data.punchline;

  ctx.reply(setup);
  ctx.reply(punchline);
});

bot.on("sticker", (ctx) => ctx.reply("❤"));

bot.on("message", (ctx) => ctx.reply("Achaaa....Thik hai....Samaj gyaa...."));

bot.launch();
