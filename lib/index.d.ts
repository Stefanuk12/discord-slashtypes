import Discord, { ApplicationCommandOptionType, ApplicationCommandPermissionData, Snowflake } from "discord.js";
export declare enum ApplicationCommandOptionTypes {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10
}
export import OptionType = ApplicationCommandOptionTypes;
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
declare enum ApplicationCommandPermissionTypes {
    ROLE = 1,
    USER = 2
}
/**
    * Represents a permission
*/
export declare class Permission {
    id: Snowflake;
    type: Discord.ApplicationCommandPermissionType | ApplicationCommandPermissionTypes;
    permission: boolean;
    constructor(data: Discord.ApplicationCommandPermissionData);
    /**
        * Sets the permissions for the command
        * @param {Discord.Client} Client - Your bot client
        * @param {Slash | SubCommand} Command - The command to add the permissions too
    */
    add(Client: Discord.Client, Command: Slash | SubCommand): Promise<Discord.ApplicationCommandPermissions[]>;
    /**
        @returns {ApplicationCommandPermissionData} Converted Permission Class to ApplicationCommandPermissionData Object
    */
    convert(): ApplicationCommandPermissionData;
}
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
    addOption(data: Option | Discord.ApplicationCommandOptionData, returnOption?: boolean): Option;
    /**
        * Add a choice to the pre-existing choices
    */
    addChoice(data: Choice | Discord.ApplicationCommandOptionChoice, returnChoice?: boolean): this | Choice;
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
    addOption(data: Option | Discord.ApplicationCommandOptionData, returnOption?: boolean): this | Option;
    /**
        * Resolves SubCommand to one from the Discord.js thing
    */
    resolve(Client: Discord.Client): Promise<Discord.ApplicationCommand<{
        guild: Discord.GuildResolvable;
    }> | undefined>;
    /**
        * Set the permissions
    */
    setPermission(Client: Discord.Client, permission: Permission): Promise<this>;
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
    addOption(data: Option | Discord.ApplicationCommandOptionData, returnOption?: boolean): this | Option;
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
    /**
        * Resolves SubCommand to one from the Discord.js thing
    */
    resolve(Client: Discord.Client): Promise<Discord.ApplicationCommand<{
        guild: Discord.GuildResolvable;
    }> | undefined>;
    /**
        * Set the permissions
    */
    setPermission(Client: Discord.Client, permission: Permission): Promise<this>;
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
export {};
//# sourceMappingURL=index.d.ts.map