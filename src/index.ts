// Dependencies
import Discord, { ApplicationCommandOptionType, ApplicationCommandPermissionData, Collection, Snowflake } from "discord.js"

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
    let Commands = []
    for (const SlashCommand of allSlashCommands){
        let result

        if (guildId){
            result = await CommandManager.create(SlashCommand.convert(), guildId)
        } else {
            result = await CommandManager.create(SlashCommand.convert())
        }

        Commands.push(result)
    }

    //
    return Commands
}

enum ApplicationCommandPermissionTypes {
    ROLE = 1,
    USER = 2
}
/**
    * Represents a permission
*/
export class Permission {
    // Vars
    id: Snowflake
    type: Discord.ApplicationCommandPermissionType | ApplicationCommandPermissionTypes
    permission: boolean

    // Constructor
    constructor(data: Discord.ApplicationCommandPermissionData){
        this.id = data.id
        this.type = data.type
        this.permission = data.permission
    }

    /**
        * Sets the permissions for the command
        * @param {Discord.Client} Client - Your bot client
        * @param {Slash | SubCommand} Command - The command to add the permissions too
    */
    async add(Client: Discord.Client, Command: Slash | SubCommand){
        // Make sure client is ready
        if (!Client.isReady()){
            let error = new Error("Client is not ready yet")
            throw(error)
        }

        //
        let command = await Command.resolve(Client)
        
        //
        if (!command){
            let error = new Error("Could not resolve command")
            throw(error)
        }

        //
        if (!command.guild){
            let error = new Error("Could not resolve command guild")
            throw(error)
        }

        //
        let permission = this.convert()
        return command.permissions.add({
            guild: command.guild,
            permissions: [
                permission
            ]
        })
    }

    /**
        @returns {ApplicationCommandPermissionData} Converted Permission Class to ApplicationCommandPermissionData Object
    */
    convert(): ApplicationCommandPermissionData{
        let object = {
            id: this.id,
            type: this.type,
            permission: this.permission
        }

        return <ApplicationCommandPermissionData>object
    }
}

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
    addOption(data: Option | Discord.ApplicationCommandOptionData, returnOption: boolean = false) {
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

        // Return
        if (returnOption){
            return option
        } else {
            return this
        }
    }

    /**
        * Add a choice to the pre-existing choices
    */
    addChoice(data: Choice | Discord.ApplicationCommandOptionChoice, returnChoice: boolean = false) {
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

        // Return
        if (returnChoice){
            return choice
        } else {
            return this
        }
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
    addOption(data: Option | Discord.ApplicationCommandOptionData, returnOption: boolean = false) {
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

        // Return
        if (returnOption){
            return option
        } else {
            return this
        }
    }

    /**
        * Resolves SubCommand to one from the Discord.js thing 
    */
    async resolve(Client: Discord.Client){
        // Make sure the client is ready
        if (!Client.isReady()){
            let error = new Error("Client is not ready yet")
            throw(error)
        }

        //
        let Commands = await Client.application.commands.fetch()
        let Command

        // Check type
        if (Commands instanceof Collection){
            // Find the command
            Command = Commands.find(command => command.name === this.name && command.description === this.description && command.options == this.options)
        } else {
            Command = Commands
        }
        
        //
        return Command
    }

    /**
        * Set the permissions
    */
    async setPermission(Client: Discord.Client, permission: Permission){
        // Set the permission
        await permission.add(Client, this)

        // Return
        return this
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
    addOption(data: Option | Discord.ApplicationCommandOptionData, returnOption: boolean = false) {
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

        // Return
        if (returnOption){
            return option
        } else {
            return this
        }
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

    /**
        * Resolves SubCommand to one from the Discord.js thing 
    */
    async resolve(Client: Discord.Client){
        // Make sure the client is ready
        if (!Client.isReady()){
            let error = new Error("Client is not ready yet")
            throw(error)
        }

        //
        let Commands = await Client.application.commands.fetch()
        let Command

        // Check type
        if (Commands instanceof Collection){
            // Find the command
            Command = Commands.find(command => command.name === this.name && command.description === this.description && command.options == this.options)
        } else {
            Command = Commands
        }
        
        //
        return Command
    }

    /**
        * Set the permissions
    */
    async setPermission(Client: Discord.Client, permission: Permission){
        // Set the permission
        await permission.add(Client, this)

        // Return
        return this
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