import {
  ActionRowBuilder,
  CommandInteraction,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  Routes,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

class PoolPartyBotEventService {
  /**
   * This function displays the event submission form to the requester
   * @param interaction
   */
  public async showEventSubmissionForm(
    interaction: CommandInteraction
  ): Promise<void> {
    const eventModal = this.createEventRequestForm();
    await interaction.showModal(eventModal);
  }

  /**
   * This function handles the submission of the event form
   * @param interaction
   */
  public async handleEventFormSubmission(
    interaction: ModalSubmitInteraction
  ): Promise<void> {
    if (interaction.customId === "eventModal") {
      await interaction.reply({
        content: "Your submission was received successfully!",
      });

      await this.createEventAndThread(interaction);
    }
  }
  /**
   * This function creates the event request form 
   * @returns modal form 
   */
  private createEventRequestForm(): ModalBuilder {
    const eventModal = new ModalBuilder()
      .setCustomId("eventModal")
      .setTitle("Event Proposal");

    // Create the text input components
    const nameOfEventInput = new TextInputBuilder()
      .setCustomId("nameOfEventInput")
      // The label is the prompt the user sees for this input
      .setLabel("Name of the Event")
      // Short means only a single line of text
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const date = new Date(Date.now());
    const dateText =
      date.getDate().toString() + (date.getMonth() + 1) + date.getFullYear();
    const dateInput = new TextInputBuilder()
      .setCustomId("dateInput")
      .setLabel("Date of the event (DDMMYYYY)")
      .setMinLength(8)
      .setMaxLength(8)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("DDMMYYYY")
      .setRequired(true)
      .setValue(dateText); //autocomplete current day

    const timeText = date.getHours().toString() + ":" + date.getMinutes();
    const timeInput = new TextInputBuilder()
      .setCustomId("timeInput")
      .setLabel("Time of the event (HH:MM)")
      .setMinLength(4)
      .setMaxLength(5)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("HH:MM")
      .setRequired(true)
      .setValue(timeText); //auto complete current time

    const minNumberOfPeopleInput = new TextInputBuilder()
      .setCustomId("peopleInput")
      .setLabel("Minimum number of people required")
      .setMaxLength(3)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const descriptionInput = new TextInputBuilder()
      .setCustomId("descriptionInput")
      .setLabel("Description the event")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Describe the event")
      .setRequired(true);

    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        nameOfEventInput
      );
    const secondActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        dateInput
      );
    const thirdActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        timeInput
      );
    const fourthActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        minNumberOfPeopleInput
      );
    const fithActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        descriptionInput
      );
    // Add components to modal
    eventModal.addComponents(
      firstActionRow,
      secondActionRow,
      thirdActionRow,
      fourthActionRow,
      fithActionRow
    );
    return eventModal;
  }

  /**
   * This function creates the event and generates a thread for the event 
   * @param interaction 
   */
  private async createEventAndThread(interaction: ModalSubmitInteraction) {
    const eventName = interaction.fields.getTextInputValue("nameOfEventInput");
    const message: any = await interaction.client.rest.post(
      Routes.channelMessages(String(process.env.CHANNEL_ID)),
      {
        body: {
          content: `${eventName} was created! Feel free to chat about it`,
          tts: false,
          embeds: [],
        },
      }
    );

    await interaction.client.rest.post(
      Routes.threads(String(process.env.CHANNEL_ID), message.id),
      {
        body: {
          name: eventName,
        },
      }
    );
  }
}

export const poolPartyEventService: PoolPartyBotEventService =
  new PoolPartyBotEventService();
