import {
  Client,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  GatewayIntentBits,
  Message,
  SlashCommandBuilder,
  ModalActionRowComponentBuilder,
  Routes,
  Partials,
} from "discord.js"
import * as dotenv from "dotenv"

// init config
dotenv.config({ path: __dirname + "/.env" })

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
})

client.once("ready", async (currClient) => {
  console.log("Pool-part bot is online")

  // build and update commands
  const propEvent = new SlashCommandBuilder()
    .setName("create-event")
    .setDescription("Creates process to propose and create event")
  await client.rest
    .put(
      Routes.applicationGuildCommands(
        currClient.application.id,
        String(process.env.SERVER_ID) // copied server id
      ),
      { body: [propEvent.toJSON()] }
    )
    .then((data: any) =>
      console.log(
        `Successfully registered ${data.length} application commands.`
      )
    )
    .catch(console.error)

  // Fetch and log current commands
  const commands = await client.rest.get(
    Routes.applicationGuildCommands(
      currClient.application.id,
      String(process.env.SERVER_ID) // copied server id
    )
  )
  console.log("Current commands", commands)
})

/**
 *
 */
client.on("messageCreate", async (message: Message) => {
  console.log(message.content)
})

client.on("messageReactionAdd", async (interaction) => {
  console.log("reaction added" + "😄")
  console.log(interaction)
})

client.on("messageReactionRemove", async (interaction) => {
  console.log("reaction removed" + "😖")
  console.log(interaction)
})

client.on("interactionCreate", async (interaction) => {
  if (interaction.isModalSubmit()) {
    if ((interaction as any).customId === "eventModal") {
      await (interaction as any).reply({
        content: "Your submission was received successfully!",
      })
      const eventName = interaction.fields.getTextInputValue("nameOfEventInput")
      const message: any = await client.rest.post(
        Routes.channelMessages(String(process.env.CHANNEL_ID)), // copied channel id
        {
          body: {
            content: `${eventName} was created! Feel free to chat about it`,
            tts: false,
            embeds: [],
          },
        }
      )

      await client.rest.post(
        Routes.threads(String(process.env.CHANNEL_ID), message.id), // copied channel id
        {
          body: {
            name: eventName,
          },
        }
      )
    }
  } else if (interaction.isChatInputCommand()) {
    try {
      // Create the modal
      const eventModal = new ModalBuilder()
        .setCustomId("eventModal")
        .setTitle("Event Proposal")

      // Add components to modal

      // Create the text input components
      const nameOfEventInput = new TextInputBuilder()
        .setCustomId("nameOfEventInput")
        // The label is the prompt the user sees for this input
        .setLabel("Name of the Event")
        // Short means only a single line of text
        .setStyle(TextInputStyle.Short)
        .setRequired(true)

      const dateInput = new TextInputBuilder()
        .setCustomId("dateInput")
        .setLabel("Date of the event")
        .setMinLength(8)
        .setMaxLength(8)
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("DDMMYYYY")
        .setRequired(true)

      const timeInput = new TextInputBuilder()
        .setCustomId("timeInput")
        .setLabel("Time of the event")
        .setMinLength(4)
        .setMaxLength(5)
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("HH:MM")
        .setRequired(true)

      const minNumberOfPeopleInput = new TextInputBuilder()
        .setCustomId("peopleInput")
        .setLabel("Minimum number of people required")
        .setMaxLength(3)
        .setStyle(TextInputStyle.Short)
        .setRequired(true)

      const descriptionInput = new TextInputBuilder()
        .setCustomId("descriptionInput")
        .setLabel("Description the event")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Describe the event")
        .setRequired(true)

      // An action row only holds one text input,
      // so you need one action row per text input.
      const firstActionRow =
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
          nameOfEventInput
        )
      const secondActionRow =
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
          dateInput
        )
      const thirdActionRow =
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
          timeInput
        )
      const fourthActionRow =
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
          minNumberOfPeopleInput
        )
      const fithActionRow =
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
          descriptionInput
        )
      // Add inputs to the modal
      eventModal.addComponents(
        firstActionRow,
        secondActionRow,
        thirdActionRow,
        fourthActionRow,
        fithActionRow
      )

      await (interaction as any).showModal(eventModal)
    } catch (error: any) {
      console.log(error)
    }
  }
})

client.login(process.env.BOT_TOKEN)
