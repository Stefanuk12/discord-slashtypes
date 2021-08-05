import Discord, { ApplicationCommandOptionType, Snowflake } from "discord.js";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
export declare type OptionType = ApplicationCommandOptionTypes;
/**
    * Removes all the registered slash commands. Make sure your bot is ready first
    * @param {Discord.Client} Client - Your bot client
*/
export declare function removeAllSlashCommands(Client: Discord.Client, guildId?: string): Promise<void>;
/**
    * Refreshes all of your (/) commands, making them appear in Discord
    * @param {Discord.Client} Client - Your bot client
    * @param {Slash[]} allSlashCommands - An array with all of the slash commands
    * @param {Snowflake} guildId - The guild id you only want to initialise these commands in
*/
export declare function initialise(Client: Discord.Client, allSlashCommands: Slash[], guildId?: Snowflake): Promise<void>;
/**
    * Represents a Choice
*/
export declare class Choice {
    name: string;
    value: string | number;
    constructor(data: Discord.ApplicationCommandOptionChoice);
    /**
        * Set the name of the Choice
    */
    setName(name: string): void;
    /**
        * Set the description of the Choice
    */
    setValue(value: string): void;
}
/**
    * Represents an Option
*/
export declare class Option {
    name: string;
    description: string;
    type: ApplicationCommandOptionType | ApplicationCommandOptionTypes;
    required?: boolean;
    choices?: Choice[];
    options?: Option[];
    constructor(data: Discord.ApplicationCommandOptionData);
    /**
        * Set the name of the Option
    */
    setName(name: string): void;
    /**
        * Set the description of the Option
    */
    setDescription(description: string): void;
    /**
        * Set the type of the Option
    */
    setType(type: ApplicationCommandOptionTypes): void;
    /**
        * Set whether the option is required
    */
    setRequired(required: boolean): void;
    /**
        * Set the possible choices
    */
    setChoices(choices: Choice[]): void;
    /**
        * Set options
    */
    setOptions(options: Option[]): void;
    /**
        * Add an option to the pre-existing options
    */
    addOption(data: Option | Discord.ApplicationCommandOptionData): void;
    /**
        * Add a choice to the pre-existing choices
    */
    addChoice(data: Choice | Discord.ApplicationCommandOptionChoice): Choice;
}
/**
    * Represents a Sub Command
*/
export declare class SubCommand {
    name: string;
    description: string;
    readonly type: ApplicationCommandOptionTypes;
    options?: (Option)[];
    constructor(data: Discord.ApplicationCommandData);
    /**
        * Sets the name of the Sub Command
    */
    setName(name: string): void;
    /**
        * Sets the description of the Sub Command
    */
    setDescription(description: string): void;
    /**
        * Sets the options of the Sub Command
    */
    setOptions(options: Option[]): void;
    /**
        * Add an option to the existing options of the Sub Command
    */
    addOption(data: Option | Discord.ApplicationCommandOptionData): Option;
}
/**
    * Represents a Slash Command
*/
export default class Slash {
    name: string;
    description: string;
    options?: (Discord.ApplicationCommandOptionData)[];
    defaultPermissions?: boolean;
    constructor(data: Discord.ApplicationCommandData);
    /**
        * Sets the name of the Slash Command
    */
    setName(name: string): void;
    /**
        * Sets the description of the Slash Command
    */
    setDescription(description: string): void;
    /**
        * Sets the options of the Slash Command
    */
    setOptions(options: Option[]): void;
    /**
        * Adds an options to the existing options of the Slash Command
    */
    addOption(data: Option | Discord.ApplicationCommandOptionData): Option;
    /**
        * Creates a Sub Command Group and adds it to the Slash Command
    */
    addSubCommandGroup(data: SubCommandGroup | Discord.ApplicationCommandData): SubCommandGroup;
    /**
        * Creates a Sub Command and adds it to the Slash Command
    */
    addSubCommand(data: SubCommand | Discord.ApplicationCommandData): SubCommand;
    /**
        * Converts it into a Discord.ApplicationCommandData Object
    */
    convert(): Discord.ApplicationCommandData;
}
/**
    * Represents a Sub Command Group
*/
export interface ISubCommandGroup extends Discord.ApplicationCommandData {
    readonly type: number;
}
export declare class SubCommandGroup extends Slash {
    readonly type: number;
}
//# sourceMappingURL=index.d.ts.map