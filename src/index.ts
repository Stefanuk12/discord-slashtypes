// Dependencies
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

//
namespace Commands {
    /**
        * Refreshes all of your (/) commands, making them appear in Discord
        * @param token The token of your bot
        * @param clientId The Client Id of your bot
        * @param guildId The Guild Id of where you want your commands to appear
        * @param allSlashCommands An array with all of the slash commands
    */
    export async function initialise(token: string, clientId: string, guildId: string, allSlashCommands: Slash[]){
        // Vars
        const rest = new REST({version: '9'}).setToken(token)

        //
        try {
            console.log("Started refreshing application (/) commands")

            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                {body: allSlashCommands}
            )

            console.log("Sucessfully reloaded application (/) commands")
        } catch (error) {
            console.log(error)
        }
    }

    /**
        * All of the types of options
    */
    export enum OptionType {
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

    // Choices
    export interface IChoice {
        name: string
        value: string
    }
    /**
        * Represents a Choice
    */
    export class Choice {
        // Vars
        name: string
        value: string

        // Constructor
        constructor(data: IChoice){
            this.name = data.name
            this.value = data.value
        }

        /**
            * Set the name of the Choice
        */
        setName(name: string){
            this.name = name
        }

        /**
            * Set the description of the Choice
        */
        setValue(value: string){
            this.value = value
        }
    }

    // Options
    export interface IOption {
        name: string
        description: string
        type: OptionType
        required?: boolean
        choices?: Choice[]
        options?: IOption[]
    }
    /**
        * Represents an Option
    */
    export class Option {
        // Vars
        name: string
        description: string
        type: OptionType
        required?: boolean
        choices?: Choice[]
        options?: Option[]

        // Constructor
        constructor(data: IOption){
            this.name = data.name
            this.description = data.description
            this.type = data.type
            this.required = data.required
            this.choices = data.choices

            // Check if options was given
            if (data.options){
                this.options = []
                for (let option of data.options){
                    this.options.push(new Option(option))
                }
            }
        }

        /**
            * Set the name of the Option
        */
        setName(name: string){
            this.name = name
        }

        /**
            * Set the description of the Option
        */
        setDescription(description: string){
            this.description = description
        }

        /**
            * Set the type of the Option
        */
        setType(type: OptionType){
            this.type = type
        }

        /**
            * Set whether the option is required
        */
        setRequired(required: boolean){
            this.required = required
        }

        /**
            * Set the possible choices
        */
        setChoices(choices: Choice[]){
            this.choices = choices
        }

        /**
            * Set options
        */
        setOptions(options: Option[]){
            this.options = options
        }

        /**
            * Add an option to the pre-existing options
        */
        addOption(data: Option | IOption){
            // Make sure there is an option array
            if (!this.options){
                this.options = []
            }

            // Convert option if Object
            let option: Option
            if (data instanceof Object){
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
        addChoice(data: Choice | IChoice){
            // Make sure there is a choice array
            if (!this.choices){
                this.choices = []
            }

            // Convert choice if Object
            let choice: Choice
            if (data instanceof Object){
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

    // SubCommand
    export interface ISubCommand {
        name: string
        description?: string
        options?: Option[]
    }
    /**
        * Represents a Sub Command
    */
    export class SubCommand {
        // Vars
        name: string
        description?: string
        readonly type: OptionType = OptionType.SUB_COMMAND
        options?: (Option)[]

        // Constructor
        constructor(data: ISubCommand){
            this.name = data.name
            this.description = data.description

            // Check if options was given
            if (data.options){
                this.options = []
                for (let option of data.options){
                    this.options.push(new Option(option))
                }
            }
        }

        /**
            * Sets the name of the Sub Command
        */
        setName(name: string){
            this.name = name
        }

        /**
            * Sets the description of the Sub Command
        */
        setDescription(description: string){
            this.description = description
        }

        /**
            * Sets the options of the Sub Command
        */
        setOptions(options: Option[]){
            this.options = options
        }

        /**
            * Add an option to the existing options of the Sub Command
        */
        addOption(data: Option | IOption){
            // Make sure there is an option array
            if (!this.options){
                this.options = []
            }

            // Convert option if Object
            let option: Option
            if (data instanceof Object){
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
    export interface ISlash {
        name: string
        description?: string
        options?: (Option | SubCommand | SubCommandGroup)[]
    }
    /**
        * Represents a Slash Command
    */
    export class Slash {
        // Vars
        name: string
        description?: string
        options?: (Option | SubCommand | SubCommandGroup)[]

        // Constructor
        constructor(data: ISlash){
            this.name = data.name
            this.description = data.description

            // Check if options was given
            if (data.options){
                this.options = []
                for (let option of data.options){
                    if (option instanceof Option){
                        this.options.push(new Option(option))
                    } else if (option instanceof SubCommandGroup) {
                        this.options.push(new SubCommandGroup(option))
                    } else if (option instanceof SubCommand){
                        this.options.push(new SubCommandGroup(option))
                    }
                }
            }
        }

        /**
            * Sets the name of the Slash Command
        */
        setName(name: string){
            this.name = name
        }

        /**
            * Sets the description of the Slash Command
        */
        setDescription(description: string){
            this.description = description
        }

        /**
            * Sets the options of the Slash Command
        */
        setOptions(options: Option[]){
            this.options = options
        }

        /**
            * Adds an options to the existing options of the Slash Command
        */
        addOption(data: Option | IOption){
            // Make sure there is an option array
            if (!this.options){
                this.options = []
            }

            // Convert option if Object
            let option: Option
            if (data instanceof Object){
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
        addSubCommandGroup(data: SubCommandGroup | ISubCommandGroup){
            // Make sure there is an option array
            if (!this.options){
                this.options = []
            }

            // Convert subcommandgroup if Object
            let subCommandGroup: SubCommandGroup
            if (data instanceof Object){
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
        addSubCommand(data: SubCommand | ISubCommand){
            // Make sure there is an option array
            if (!this.options){
                this.options = []
            }

            // Convert subcommandgroup if Object
            let subCommand: SubCommand
            if (data instanceof Object){
                subCommand = new SubCommand(data)
            } else {
                subCommand = data
            }

            // Add the subCommand
            this.options.push(subCommand)

            // Return the subCommand
            return subCommand
        }
    }

    // SubCommandGroup
    export interface ISubCommandGroup extends ISlash {}

    /**
        * Represents a Sub Command Group
    */
    export class SubCommandGroup extends Slash {
        readonly type: number = OptionType.SUB_COMMAND_GROUP
    }
}

// Export
module.exports = Commands