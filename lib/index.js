"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = void 0;
// Dependencies
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
//
var Commands;
(function (Commands) {
    /**
        * Refreshes all of your (/) commands, making them appear in Discord
        * @param token The token of your bot
        * @param clientId The Client Id of your bot
        * @param guildId The Guild Id of where you want your commands to appear
        * @param allSlashCommands An array with all of the slash commands
    */
    async function initialise(token, clientId, guildId, allSlashCommands) {
        // Vars
        const rest = new rest_1.REST({ version: '9' }).setToken(token);
        //
        try {
            console.log("Started refreshing application (/) commands");
            await rest.put(v9_1.Routes.applicationGuildCommands(clientId, guildId), { body: allSlashCommands });
            console.log("Sucessfully reloaded application (/) commands");
        }
        catch (error) {
            console.log(error);
        }
    }
    Commands.initialise = initialise;
    /**
        * All of the types of options
    */
    let OptionType;
    (function (OptionType) {
        OptionType[OptionType["SUB_COMMAND"] = 1] = "SUB_COMMAND";
        OptionType[OptionType["SUB_COMMAND_GROUP"] = 2] = "SUB_COMMAND_GROUP";
        OptionType[OptionType["STRING"] = 3] = "STRING";
        OptionType[OptionType["INTEGER"] = 4] = "INTEGER";
        OptionType[OptionType["BOOLEAN"] = 5] = "BOOLEAN";
        OptionType[OptionType["USER"] = 6] = "USER";
        OptionType[OptionType["CHANNEL"] = 7] = "CHANNEL";
        OptionType[OptionType["ROLE"] = 8] = "ROLE";
        OptionType[OptionType["MENTIONABLE"] = 9] = "MENTIONABLE";
        OptionType[OptionType["NUMBER"] = 10] = "NUMBER";
    })(OptionType || (OptionType = {}));
    /**
        * Represents a Choice
    */
    class Choice {
        // Constructor
        constructor(data) {
            this.name = data.name;
            this.value = data.value;
        }
        /**
            * Set the name of the Choice
        */
        setName(name) {
            this.name = name;
        }
        /**
            * Set the description of the Choice
        */
        setValue(value) {
            this.value = value;
        }
    }
    /**
        * Represents an Option
    */
    class Option {
        // Constructor
        constructor(data) {
            this.name = data.name;
            this.description = data.description;
            this.type = data.type;
            this.required = data.required;
            this.choices = data.choices;
            // Check if options was given
            if (data.options) {
                this.options = [];
                for (let option of data.options) {
                    this.options.push(new Option(option));
                }
            }
        }
        /**
            * Set the name of the Option
        */
        setName(name) {
            this.name = name;
        }
        /**
            * Set the description of the Option
        */
        setDescription(description) {
            this.description = description;
        }
        /**
            * Set the type of the Option
        */
        setType(type) {
            this.type = type;
        }
        /**
            * Set whether the option is required
        */
        setRequired(required) {
            this.required = required;
        }
        /**
            * Set the possible choices
        */
        setChoices(choices) {
            this.choices = choices;
        }
        /**
            * Set options
        */
        setOptions(options) {
            this.options = options;
        }
        /**
            * Add an option to the pre-existing options
        */
        addOption(data) {
            // Make sure there is an option array
            if (!this.options) {
                this.options = [];
            }
            // Convert option if Object
            let option;
            if (data instanceof Object) {
                option = new Option(data);
            }
            else {
                option = data;
            }
            // Push
            this.options.push(option);
        }
        /**
            * Add a choice to the pre-existing choices
        */
        addChoice(data) {
            // Make sure there is a choice array
            if (!this.choices) {
                this.choices = [];
            }
            // Convert choice if Object
            let choice;
            if (data instanceof Object) {
                choice = new Choice(data);
            }
            else {
                choice = data;
            }
            // Add a choice
            this.choices.push(choice);
            // Return the choice
            return choice;
        }
    }
    /**
        * Represents a Sub Command
    */
    class SubCommand {
        // Constructor
        constructor(data) {
            this.type = OptionType.SUB_COMMAND;
            this.name = data.name;
            this.description = data.description;
            // Check if options was given
            if (data.options) {
                this.options = [];
                for (let option of data.options) {
                    this.options.push(new Option(option));
                }
            }
        }
        /**
            * Sets the name of the Sub Command
        */
        setName(name) {
            this.name = name;
        }
        /**
            * Sets the description of the Sub Command
        */
        setDescription(description) {
            this.description = description;
        }
        /**
            * Sets the options of the Sub Command
        */
        setOptions(options) {
            this.options = options;
        }
        /**
            * Add an option to the existing options of the Sub Command
        */
        addOption(data) {
            // Make sure there is an option array
            if (!this.options) {
                this.options = [];
            }
            // Convert option if Object
            let option;
            if (data instanceof Object) {
                option = new Option(data);
            }
            else {
                option = data;
            }
            // Add an option
            this.options.push(option);
            // Return the option
            return option;
        }
    }
    /**
        * Represents a Slash Command
    */
    class Slash {
        // Constructor
        constructor(data) {
            this.name = data.name;
            this.description = data.description;
            // Check if options was given
            if (data.options) {
                this.options = [];
                for (let option of data.options) {
                    if (option instanceof Option) {
                        this.options.push(new Option(option));
                    }
                    else if (option instanceof SubCommandGroup) {
                        this.options.push(new SubCommandGroup(option));
                    }
                    else if (option instanceof SubCommand) {
                        this.options.push(new SubCommandGroup(option));
                    }
                }
            }
        }
        /**
            * Sets the name of the Slash Command
        */
        setName(name) {
            this.name = name;
        }
        /**
            * Sets the description of the Slash Command
        */
        setDescription(description) {
            this.description = description;
        }
        /**
            * Sets the options of the Slash Command
        */
        setOptions(options) {
            this.options = options;
        }
        /**
            * Adds an options to the existing options of the Slash Command
        */
        addOption(data) {
            // Make sure there is an option array
            if (!this.options) {
                this.options = [];
            }
            // Convert option if Object
            let option;
            if (data instanceof Object) {
                option = new Option(data);
            }
            else {
                option = data;
            }
            // Add an option
            this.options.push(option);
            // Return the option
            return option;
        }
        /**
            * Creates a Sub Command Group and adds it to the Slash Command
        */
        addSubCommandGroup(data) {
            // Make sure there is an option array
            if (!this.options) {
                this.options = [];
            }
            // Convert subcommandgroup if Object
            let subCommandGroup;
            if (data instanceof Object) {
                subCommandGroup = new SubCommandGroup(data);
            }
            else {
                subCommandGroup = data;
            }
            // Add the subcommandgroup
            this.options.push(subCommandGroup);
            // Return the subcommandgroup
            return subCommandGroup;
        }
        /**
            * Creates a Sub Command and adds it to the Slash Command
        */
        addSubCommand(data) {
            // Make sure there is an option array
            if (!this.options) {
                this.options = [];
            }
            // Convert subcommandgroup if Object
            let subCommand;
            if (data instanceof Object) {
                subCommand = new SubCommand(data);
            }
            else {
                subCommand = data;
            }
            // Add the subCommand
            this.options.push(subCommand);
            // Return the subCommand
            return subCommand;
        }
    }
    /**
        * Represents a Sub Command Group
    */
    class SubCommandGroup extends Slash {
        constructor() {
            super(...arguments);
            this.type = OptionType.SUB_COMMAND_GROUP;
        }
    }
})(Commands = exports.Commands || (exports.Commands = {}));
//# sourceMappingURL=index.js.map