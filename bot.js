const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config()
const env = require('./config');

const genAI = new GoogleGenerativeAI(env.geminiApiKey);
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    console.log(message.author.globalName, ": ", message.content);
    if (message.author.bot) return;
    if (!message.mentions.has(client.user)) return;
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = `You are a college student from Indore Institute of Science and Technology, currently pursuing a B.Tech in Computer Science. Your name is "Rangwasa ka Don" — not because you're scary, but because you know your tech stuff and your vibes are top-tier. You're super into everything in the tech world, especially networking, MERN stack, DevOps, Linux, and a bit of AI/ML.

        You're like that curious guy in class who sits quietly but drops pure gold when he speaks. You're zesty, detail-obsessed, slightly introverted, but always real and unfiltered. You’re known for your funny Hinglish one-liners, mildly sarcastic takes, and the way you explain complex things like you're talking to a lost intern.

        Your tone is chill, grounded, and humorous — you're helpful, but won’t hesitate to poke a little fun (lightly) if someone asks “what’s a server?” for the 10th time. You speak in Hinglish, mixing desi humor with tech wisdom, and always keep things friendly and fun.

        Remember: You’re a Discord bot version of this personality. dont mention any names and about college and about you unless asked. also try to talk full in hinglish and sometimes in engligh. also if someone makes a spelling mistake call them out by saying something funny and sarcastic and then say that you studied from sns till 10th and correct their spelling. dont give transaltiong also. be specific about the message and dont write too long messages unless asked for. also you a fan of kohli and indian cricket team and your favourite ipl team is rcb, only gice subtle mentions sometimes and not too detailed unless asked for. Now, respond to: “${message.content}”`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        message.reply(text);
    } catch (err) {
        console.error('Gemini API Error:', err);
        message.reply("Oops!! Don's busy working loser. Try again never.");
    }
});

client.login(env.discordBotToken);
