// Dependencies
import Discord, { ApplicationCommandOptionType, Snowflake } from "discord.js"

//
export enum ApplicationCommandOptionTypes {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
}
export import OptionType = ApplicationCommandOptionTypes

/**
    * Removes all the registered slash commands. Make sure your bot is ready first
    * @param {Discord.Client} Client - Your bot client
*/
export async function removeAllSlashCommands(Client: Discord.Client, guildId?: string){
    // Make sure the client is ready
    if (!Client.isReady()){
        let error = new Error("Client is not ready yet")
        throw(error)
    }
    
    //
    let CommandManager = Client.application.commands
    CommandManager.cache.forEach((Command) => {
        CommandManager.delete(Command, guildId)
    })
}

/**
    * Refreshes all of your (/) commands, making them appear in Discord
    * @param {Discord.Client} Client - Your bot client
    * @param {Slash[]} allSlashCommands - An array with all of the slash commands
    * @param {Snowflake} guildId - The guild id you only want to initialise these commands in
*/
export async function initialise(Client: Discord.Client, allSlashCommands: Slash[], guildId?: Snowflake) {
    // Make sure the client is ready
    if (!Client.isReady()){
        let error = new Error("Client is not ready yet")
        throw(error)
    }

    //
    let CommandManager = Client.application.commands
    for (const SlashCommand of allSlashCommands){
        if (guildId){
            await CommandManager.create(SlashCommand.convert(), guildId)
        } else {
            await CommandManager.create(SlashCommand.convert())
        }
        
    }
}

// Choices
/**
    * Represents a Choice
*/
export class Choice {
    // Vars
    name: string
    value: string | number

    // Constructor
    constructor(data: Discord.ApplicationCommandOptionChoice) {
        this.name = data.name
        this.value = data.value
    }

    /**
        * Set the name of the Choice
    */
    setName(name: string) {
        this.name = name
    }

    /**
        * Set the description of the Choice
    */
    setValue(value: string) {
        this.value = value
    }
}

// Options
/**
    * Represents an Option
*/
export class Option {
    // Vars
    name: string
    description: string
    type: ApplicationCommandOptionType | ApplicationCommandOptionTypes
    required?: boolean
    choices?: Choice[]
    options?: Option[]

    // Constructor
    constructor(data: Discord.ApplicationCommandOptionData) {
        this.name = data.name
        this.description = data.description
        this.type = data.type
        this.required = data.required

        // Check if options was given
        if (data.options) {
            this.options = []
            for (let option of data.options) {
                this.options.push(new Option(option))
            }
        }

        // Check if choices was given
        if (data.choices){
            this.choices = []
            for (let choice of data.choices){
                this.choices.push(new Choice(choice))
            }
        }
    }

    /**
        * Set the name of the Option
    */
    setName(name: string) {
        this.name = name
    }

    /**
        * Set the description of the Option
    */
    setDescription(description: string) {
        this.description = description
    }

    /**
        * Set the type of the Option
    */
    setType(type: ApplicationCommandOptionTypes) {
        this.type = type
    }

    /**
        * Set whether the option is required
    */
    setRequired(required: boolean) {
        this.required = required
    }

    /**
        * Set the possible choices
    */
    setChoices(choices: Choice[]) {
        this.choices = choices
    }

    /**
        * Set options
    */
    setOptions(options: Option[]) {
        this.options = options
    }

    /**
        * Add an option to the pre-existing options
    */
    addOption(data: Option | Discord.ApplicationCommandOptionData) {
        // Make sure there is an option array
        if (!this.options) {
            this.options = []
        }

        // Convert option if Object
        let option: Option
        if (data instanceof Object) {
            option = new Option(data)
        } else {
            option = data
        }

        // Push
        this.options.push(option)
    }

    /**
        * Add a choice to the pre-existing choices
    */
    addChoice(data: Choice | Discord.ApplicationCommandOptionChoice) {
        // Make sure there is a choice array
        if (!this.choices) {
            this.choices = []
        }

        // Convert choice if Object
        let choice: Choice
        if (data instanceof Object) {
            choice = new Choice(data)
        } else {
            choice = data
        }

        // Add a choice
        this.choices.push(choice)

        // Return the choice
        return choice
    }
}

/**
    * Represents a Sub Command
*/
export class SubCommand {
    // Vars
    name: string
    description: string
    readonly type: ApplicationCommandOptionTypes = ApplicationCommandOptionTypes.SUB_COMMAND
    options?: (Option)[]

    // Constructor
    constructor(data: Discord.ApplicationCommandData) {
        this.name = data.name
        this.description = data.description

        // Check if options was given
        if (data.options) {
            this.options = []
            for (let option of data.options) {
                this.options.push(new Option(option))
            }
        }
    }

    /**
        * Sets the name of the Sub Command
    */
    setName(name: string) {
        this.name = name
    }

    /**
        * Sets the description of the Sub Command
    */
    setDescription(description: string) {
        this.description = description
    }

    /**
        * Sets the options of the Sub Command
    */
    setOptions(options: Option[]) {
        this.options = options
    }

    /**
        * Add an option to the existing options of the Sub Command
    */
    addOption(data: Option | Discord.ApplicationCommandOptionData) {
        // Make sure there is an option array
        if (!this.options) {
            this.options = []
        }

        // Convert option if Object
        let option: Option
        if (data instanceof Object) {
            option = new Option(data)
        } else {
            option = data
        }

        // Add an option
        this.options.push(option)

        // Return the option
        return option
    }
}

// Slash
/**
    * Represents a Slash Command
*/
export default class Slash {
    // Vars
    name: string
    description: string
    options?: (Discord.ApplicationCommandOptionData)[]
    defaultPermissions?: boolean

    // Constructor
    constructor(data: Discord.ApplicationCommandData) {
        this.name = data.name
        this.description = data.description

        // Check if options was given
        if (data.options) {
            this.options = []
            for (let option of data.options) {
                if (option instanceof Option) {
                    this.options.push(new Option(option))
                } else if (option instanceof SubCommandGroup) {
                    this.options.push(new SubCommandGroup(option))
                } else if (option instanceof SubCommand) {
                    this.options.push(new SubCommandGroup(option))
                }
            }
        }
    }

    /**
        * Sets the name of the Slash Command
    */
    setName(name: string) {
        this.name = name
    }

    /**
        * Sets the description of the Slash Command
    */
    setDescription(description: string) {
        this.description = description
    }

    /**
        * Sets the options of the Slash Command
    */
    setOptions(options: Option[]) {
        this.options = options
    }

    /**
        * Adds an options to the existing options of the Slash Command
    */
    addOption(data: Option | Discord.ApplicationCommandOptionData) {
        // Make sure there is an option array
        if (!this.options) {
            this.options = []
        }

        // Convert option if Object
        let option: Option
        if (data instanceof Object) {
            option = new Option(data)
        } else {
            option = data
        }

        // Add an option
        this.options.push(option)

        // Return the option
        return option
    }

    /**
        * Creates a Sub Command Group and adds it to the Slash Command
    */
    addSubCommandGroup(data: SubCommandGroup | Discord.ApplicationCommandData) {
        // Make sure there is an option array
        if (!this.options) {
            this.options = []
        }

        // Convert subcommandgroup if Object
        let subCommandGroup: SubCommandGroup
        if (data instanceof Object) {
            subCommandGroup = new SubCommandGroup(data)
        } else {
            subCommandGroup = data
        }

        // Add the subcommandgroup
        this.options.push(subCommandGroup)

        // Return the subcommandgroup
        return subCommandGroup
    }

    /**
        * Creates a Sub Command and adds it to the Slash Command
    */
    addSubCommand(data: SubCommand | Discord.ApplicationCommandData) {
        // Make sure there is an option array
        if (!this.options) {
            this.options = []
        }

        // Convert subcommandgroup if Object
        let subCommand: SubCommand
        if (data instanceof Object) {
            subCommand = new SubCommand(data)
        } else {
            subCommand = data
        }

        // Add the subCommand
        this.options.push(subCommand)

        // Return the subCommand
        return subCommand
    }

    /**
        * Converts it into a Discord.ApplicationCommandData Object
    */
    convert(){
        let Object = JSON.parse(JSON.stringify(this))
        return <Discord.ApplicationCommandData>Object
    }
}

/**
    * Represents a Sub Command Group
*/
export interface ISubCommandGroup extends Discord.ApplicationCommandData {
    readonly type: number
}
export class SubCommandGroup extends Slash {
    readonly type: number = ApplicationCommandOptionTypes.SUB_COMMAND_GROUP
}