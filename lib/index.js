"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCommandGroup = exports.SubCommand = exports.Option = exports.Choice = exports.initialise = exports.removeAllSlashCommands = exports.OptionType = exports.ApplicationCommandOptionTypes = void 0;
//
var ApplicationCommandOptionTypes;
(function (ApplicationCommandOptionTypes) {
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["SUB_COMMAND"] = 1] = "SUB_COMMAND";
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["SUB_COMMAND_GROUP"] = 2] = "SUB_COMMAND_GROUP";
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["STRING"] = 3] = "STRING";
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["INTEGER"] = 4] = "INTEGER";
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["BOOLEAN"] = 5] = "BOOLEAN";
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["USER"] = 6] = "USER";
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["CHANNEL"] = 7] = "CHANNEL";
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["ROLE"] = 8] = "ROLE";
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["MENTIONABLE"] = 9] = "MENTIONABLE";
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["NUMBER"] = 10] = "NUMBER";
})(ApplicationCommandOptionTypes = exports.ApplicationCommandOptionTypes || (exports.ApplicationCommandOptionTypes = {}));
exports.OptionType = ApplicationCommandOptionTypes;
/**
    * Removes all the registered slash commands. Make sure your bot is ready first
    * @param {Discord.Client} Client - Your bot client
*/
async function removeAllSlashCommands(Client, guildId) {
    // Make sure the client is ready
    if (!Client.isReady()) {
        let error = new Error("Client is not ready yet");
        throw (error);
    }
    //
    let CommandManager = Client.application.commands;
    CommandManager.cache.forEach((Command) => {
        CommandManager.delete(Command, guildId);
    });
}
exports.removeAllSlashCommands = removeAllSlashCommands;
/**
    * Refreshes all of your (/) commands, making them appear in Discord
    * @param {Discord.Client} Client - Your bot client
    * @param {Slash[]} allSlashCommands - An array with all of the slash commands
    * @param {Snowflake} guildId - The guild id you only want to initialise these commands in
*/
async function initialise(Client, allSlashCommands, guildId) {
    // Make sure the client is ready
    if (!Client.isReady()) {
        let error = new Error("Client is not ready yet");
        throw (error);
    }
    //
    let CommandManager = Client.application.commands;
    for (const SlashCommand of allSlashCommands) {
        if (guildId) {
            await CommandManager.create(SlashCommand.convert(), guildId);
        }
        else {
            await CommandManager.create(SlashCommand.convert());
        }
    }
}
exports.initialise = initialise;
// Choices
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
exports.Choice = Choice;
// Options
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
        // Check if options was given
        if (data.options) {
            this.options = [];
            for (let option of data.options) {
                this.options.push(new Option(option));
            }
        }
        // Check if choices was given
        if (data.choices) {
            this.choices = [];
            for (let choice of data.choices) {
                this.choices.push(new Choice(choice));
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
exports.Option = Option;
/**
    * Represents a Sub Command
*/
class SubCommand {
    // Constructor
    constructor(data) {
        this.type = ApplicationCommandOptionTypes.SUB_COMMAND;
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
exports.SubCommand = SubCommand;
// Slash
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
    /**
        * Converts it into a Discord.ApplicationCommandData Object
    */
    convert() {
        let Object = JSON.parse(JSON.stringify(this));
        return Object;
    }
}
exports.default = Slash;
class SubCommandGroup extends Slash {
    constructor() {
        super(...arguments);
        this.type = ApplicationCommandOptionTypes.SUB_COMMAND_GROUP;
    }
}
exports.SubCommandGroup = SubCommandGroup;
//# sourceMappingURL=index.js.map