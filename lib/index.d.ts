/**
    * Refreshes all of your (/) commands, making them appear in Discord
    * @param token The token of your bot
    * @param clientId The Client Id of your bot
    * @param guildId The Guild Id of where you want your commands to appear
    * @param allSlashCommands An array with all of the slash commands
*/
export declare function initialise(token: string, clientId: string, guildId: string, allSlashCommands: Slash[]): Promise<void>;
/**
    * All of the types of options
*/
export declare enum OptionType {
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
export interface IChoice {
    name: string;
    value: string;
}
/**
    * Represents a Choice
*/
export declare class Choice {
    name: string;
    value: string;
    constructor(data: IChoice);
    /**
        * Set the name of the Choice
    */
    setName(name: string): void;
    /**
        * Set the description of the Choice
    */
    setValue(value: string): void;
}
export interface IOption {
    name: string;
    description: string;
    type: OptionType;
    required?: boolean;
    choices?: Choice[];
    options?: IOption[];
}
/**
    * Represents an Option
*/
export declare class Option {
    name: string;
    description: string;
    type: OptionType;
    required?: boolean;
    choices?: Choice[];
    options?: Option[];
    constructor(data: IOption);
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
    setType(type: OptionType): void;
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
    addOption(data: Option | IOption): void;
    /**
        * Add a choice to the pre-existing choices
    */
    addChoice(data: Choice | IChoice): Choice;
}
export interface ISubCommand {
    name: string;
    description?: string;
    options?: Option[];
}
/**
    * Represents a Sub Command
*/
export declare class SubCommand {
    name: string;
    description?: string;
    readonly type: OptionType;
    options?: (Option)[];
    constructor(data: ISubCommand);
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
    addOption(data: Option | IOption): Option;
}
export interface ISlash {
    name: string;
    description?: string;
    options?: (Option | SubCommand | SubCommandGroup)[];
}
/**
    * Represents a Slash Command
*/
export default class Slash {
    name: string;
    description?: string;
    options?: (Option | SubCommand | SubCommandGroup)[];
    constructor(data: ISlash);
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
    addOption(data: Option | IOption): Option;
    /**
        * Creates a Sub Command Group and adds it to the Slash Command
    */
    addSubCommandGroup(data: SubCommandGroup | ISubCommandGroup): SubCommandGroup;
    /**
        * Creates a Sub Command and adds it to the Slash Command
    */
    addSubCommand(data: SubCommand | ISubCommand): SubCommand;
}
export interface ISubCommandGroup extends ISlash {
}
/**
    * Represents a Sub Command Group
*/
export declare class SubCommandGroup extends Slash {
    readonly type: number;
}
//# sourceMappingURL=index.d.ts.map