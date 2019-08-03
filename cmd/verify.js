/*
force - force someone to be verified !DB
command - the command that should be typed to be verified !DB
channel - the channel where you must type the command to be verified !DB
enabled/disable !DB
role - select the role to assign !DB
get all data 
*/

const naisu = require('../index')
const SQLite = require('better-sqlite3')
const Discord = require('discord.js')

const sql = new SQLite('./data.sqlite')

function exec(msg, args) {

    const getRole = sql.prepare("SELECT role FROM verify WHERE serverid=?;").get(msg.guild.id);
    const getChannel = sql.prepare("SELECT channel FROM verify WHERE serverid=?;").get(msg.guild.id);
    const getCommand = sql.prepare("SELECT command FROM verify WHERE serverid=?;").get(msg.guild.id);
    const getEnabled = sql.prepare(`SELECT enabled FROM verify WHERE serverid = ? ;`).get(msg.guild.id);

    const getAll = sql.prepare("SELECT * FROM verify WHERE serverid=?;").get(msg.guild.id);

    const setRole = sql.prepare("INSERT OR REPLACE INTO verify (serverid, role) VALUES (@serverid, @role);")
    const setChannel = sql.prepare("INSERT OR REPLACE INTO verify (serverid, channel) VALUES (@serverid, @role);")
    const setCommand = sql.prepare("INSERT OR REPLACE INTO verify (serverid, command) VALUES (@serverid, @role);")
    const setEnabled = sql.prepare("INSERT OR REPLACE INTO verify (serverid, enabled) VALUES (@serverid, @role);")

    let command = args[0]

    msg.channel.send("This command is currently under development.")

}

module.exports = {
    exec: exec
}