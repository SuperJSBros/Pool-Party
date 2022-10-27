import {
  ActionRowBuilder,
  CommandInteraction,
  EmbedBuilder,
  GuildScheduledEvent,
  Message,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  Routes,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";
import { eventRepository } from "../repository/event-repository";

class EventService {
  private _modalReference = {
    modalId: "event-modal",
    eventNameInputId: "eventNameInput",
    dateInputId: "dateInput",
    timeInputId: "timeInput",
    minPeopleInputId: "minPeopleInput",
    descriptionInputId: "descriptionInput",
  };

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
    if (interaction.customId === this._modalReference.modalId) {
      const errors = this.validateEventFormInputs(interaction);
      if (errors.length > 0) {
        // Error
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `Your submission contains errors: ${errors.join(", ")}`
              ),
          ],
        });
      } else {
        try {
          await this.createEventAndThread(interaction);
          // Success
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Green")
                .setDescription("Your submission was received successfully!"),
            ],
          });
        } catch (e: any) {
          console.error(e.message);
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                  `Something went wrong during your submission, please try again later`
                ),
            ],
          });
        }
      }
    }
  }

  private validateEventFormInputs(
    interaction: ModalSubmitInteraction
  ): string[] {
    const timeRgx = new RegExp(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/); // validates mm:hh
    const dateRgx = new RegExp( // validates dd/mm/yyyy, dd-mm-yyyy or dd.mm.yyyy (See https://stackoverflow.com/questions/15491894/regex-to-validate-date-formats-dd-mm-yyyy-dd-mm-yyyy-dd-mm-yyyy-dd-mmm-yyyy)
      /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
    );

    const dateInput = interaction.fields.getTextInputValue(
      this._modalReference.dateInputId
    );
    const timeInput = interaction.fields.getTextInputValue(
      this._modalReference.timeInputId
    );
    let minPeopleInput = interaction.fields.getTextInputValue(
      this._modalReference.minPeopleInputId
    );
    const eventDate = this.createDateFromInputs(dateInput, timeInput);

    // validate inputs
    let errorMsg: string[] = [];
    if (!dateRgx.test(dateInput))
      errorMsg.push(`Invalid date value: ${dateInput}`);
    if (!timeRgx.test(timeInput))
      errorMsg.push(`Invalid time value: ${timeInput}`);
    if (eventDate < new Date())
      errorMsg.push(`DateTime value must be in the future`);
    if (isNaN(Number(minPeopleInput)))
      errorMsg.push(`Invalid number value: ${minPeopleInput}`);

    return errorMsg;
  }

  private createEventRequestForm(): ModalBuilder {
    const eventModal = new ModalBuilder()
      .setCustomId(this._modalReference.modalId)
      .setTitle("Pool Party Event Proposal");

    // Create the text input components
    const eventNameInput = new TextInputBuilder()
      .setCustomId(this._modalReference.eventNameInputId)
      // The label is the prompt the user sees for this input
      .setLabel("Name of the Event")
      // Short means only a single line of text
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const dateNow = new Date(Date.now() + 5 * 60000);
    const defaultDate: string = dateNow.toLocaleDateString("en-GB");
    const dateInput = new TextInputBuilder()
      .setCustomId(this._modalReference.dateInputId)
      .setLabel("Date of the event (DD/MM/YYYY)")
      .setMinLength(10)
      .setMaxLength(10)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("DD/MM/YYYY")
      .setRequired(true)
      .setValue(defaultDate); //autocomplete current day

    const hours = (dateNow.getHours() < 10 ? "0" : "") + dateNow.getHours(); // ensure format mm
    const minutes =
      (dateNow.getMinutes() < 10 ? "0" : "") + dateNow.getMinutes(); // ensure format mm
    const defaultTime: string = hours + ":" + minutes;
    const timeInput = new TextInputBuilder()
      .setCustomId(this._modalReference.timeInputId)
      .setLabel("Time of the event (HH:MM)")
      .setMinLength(5)
      .setMaxLength(5)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("HH:MM")
      .setRequired(true)
      .setValue(defaultTime); //auto complete current time

    const minPeopleInput = new TextInputBuilder()
      .setCustomId(this._modalReference.minPeopleInputId)
      .setLabel("Minimum number of people required")
      .setMaxLength(3)
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const descriptionInput = new TextInputBuilder()
      .setCustomId(this._modalReference.descriptionInputId)
      .setLabel("Description the event")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Describe the event")
      .setRequired(true);

    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        eventNameInput
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
        minPeopleInput
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

  private async createEventAndThread(interaction: ModalSubmitInteraction) {
    const eventName = interaction.fields.getTextInputValue(
      this._modalReference.eventNameInputId
    );
    const eventDescription = interaction.fields.getTextInputValue(
      this._modalReference.descriptionInputId
    );
    const minPeopleInput = interaction.fields.getTextInputValue(
      this._modalReference.minPeopleInputId
    );
    const dateInput = interaction.fields.getTextInputValue(
      this._modalReference.dateInputId
    );
    const timeInput = interaction.fields.getTextInputValue(
      this._modalReference.timeInputId
    );

    const eventStartDate = this.createDateFromInputs(dateInput, timeInput);
    const requester = interaction.user.username;

    const event = await this.postEvent(
      interaction,
      eventName,
      eventStartDate,
      eventDescription
    );
    const message = await this.postMsgAndThread(
      interaction,
      requester,
      eventDescription,
      eventName,
      minPeopleInput
    );
    // create db event
    eventRepository.createEvent(event, minPeopleInput, eventStartDate, interaction.user.id, message.id);
  }



  private async postEvent(
    interaction: ModalSubmitInteraction,
    eventName: string,
    eventStartDate: Date,
    eventDescription: string
  ):Promise<GuildScheduledEvent> {
    return await interaction.client.rest.post(
      Routes.guildScheduledEvents(String(process.env.SERVER_ID)),
      {
        body: {
          channel_id: process.env.VOICE_CHANNEL_ID,
          name: eventName,
          privacy_level: 2,
          scheduled_start_time: eventStartDate,
          description: eventDescription,
          entity_type: 2,
        },
      }
    ) as Promise<GuildScheduledEvent>;
  }

  private async postMsgAndThread(
    interaction: ModalSubmitInteraction,
    requester: string,
    eventDescription: string,
    eventName: string,
    minPeopleInput: string
  ):Promise<Message> {
    const numOfPeople = Number(minPeopleInput);
    const message: any = await interaction.client.rest.post(
      Routes.channelMessages(String(process.env.THREAD_CHANNEL_ID)),
      {
        body: {
          content: `${requester} created an event! Show your interest by reacting 🔥🚀, chatting 🗣️ and subscribing to the event's notifications 🔔\n`,
          tts: false,
          embeds: eventDescription
            ? [
                new EmbedBuilder()
                  .setColor("Blue")
                  .setDescription(
                    `Description: ${eventDescription}` +
                      (numOfPeople ? `\nCapacity: ${numOfPeople}` : "")
                  ),
              ]
            : [],
        },
      }
    );
    await interaction.client.rest.post(
      Routes.threads(String(process.env.THREAD_CHANNEL_ID), message.id),
      {
        body: {
          name: eventName,
        },
      }
    );
    return message;
  }

  private createDateFromInputs(dateInput: string, timeInput: string): Date {
    const dateStr = dateInput.split("/").reverse().join("-"); // convert to accepted format
    const timeStr = timeInput
      .split(":")
      .map((val) => (val.length < 2 ? "0" + val : val))
      .join(":");
    // Only the ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) is explicitly specified to be supported.
    const eventStartDate = new Date(Date.parse(`${dateStr}T${timeStr}`));
    return eventStartDate;
  }
}

export const eventService: EventService = new EventService();
