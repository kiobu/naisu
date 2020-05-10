const index = require("../index");
const Discord = require("discord.js");
const cheerio = require("cheerio")
const rq = require("request-promise")
const chalk = require("chalk");

const path = require("path");

const error = require("../lib/error");

exports.exec = function(msg, args) {

  if (args.length === 0) {
    error.NoArgsException(msg,args,"You need to specify a server IP or hostname and port.")
    return;
  }

  let sv = args;

  const config = {
    /* &showTopPlayers=1 -- show top players. */
    url: `https://www.gametracker.com/components/html0/?host=${sv}&bgColor=1F2642&fontColor=8790AE&titleBgColor=11172D&titleColor=FFFFFF&borderColor=333333&linkColor=FF9900&borderLinkColor=999999&showMap=1&currentPlayersHeight=100&showCurrPlayers=1&topPlayersHeight=100&showBlogs=0&width=240`,
    headers: {'user-agent': 'node.js'},
    transform: function (body) {
      return cheerio.load(body)
    }
  };

  rq(config)
    .then(($) => {

      $img = $('.item_float_left').find('img');
        let svcountry = $('img').attr('title')
        let svcountryimg = $('img').attr('src')

      let gamename = $('.item_float_right').find('img').attr('title')
      let mapimage = $('.image_160x120').attr('src');

      let playerList = [];

      $('.scrollable_on_c02').each(function(){
        playerList.push($(this).text().replace(/\s/g, ''));
      })

      let playerString = "";
      let MAX = 10;

      if (playerList.length <= 0) {
        playerString = "No online players."
      } else {
	if (playerList.length < MAX) {
		MAX = playerList.length;
	};
        for (let i = 0; i < MAX; i++) {
          playerString+= `${playerList[i]}\n`
        }
      }

      if (playerList.length > MAX) {
        playerString += `\n... and ${playerList.length-MAX} more.`
      }

      let svname = $('.server_name').text().replace(/\s/g,'')
      let data = $('.info_line').text().replace(/\s/g,'').replace(/:/g, ':\u00A0')
      let ip = data.substring(0, data.indexOf('Players'));
      last = ip.length;
      let players = data.substring(ip.length, data.indexOf('Rank'));
      last = last + players.length;
      let rank = data.substring(last, data.indexOf('Map'));
      last = last + rank.length;
      let map = data.substring(last, data.indexOf('Online'));
      last = last + map.length;
      let online = data.substring(last, data.indexOf('Top10'));
      last = last + online.length;

    index.logger.log(`User asked for info for ` + svname + ` in ` + msg.guild.name, "serverquery");
    let message = ''

    if (svname === '' || undefined) {
      message = (":warning: Server not found. Either it does not exist, or the string was malformed.");
      index.logger.log("Server not found.", "serverquery")
    } else if (ip.indexOf('9987') >-1 || ip.indexOf('8767') >-1 || ip.indexOf('4489') > -1) {
      message = (":warning: Voice servers are not supported.");
    } else {
    message = new Discord.RichEmbed()
      .setTitle(svname)
      .setDescription(gamename)
      .setAuthor(svcountry, `https:${svcountryimg}`)
      .setColor(0xff91fd)
      .addField("IP Address", ip.replace("IP:", ""))
      .addField("Playercount", players.replace("Players:", ""))
      .addField("Rank", rank.replace("Rank:", ""))
      .addField("Map", map.replace("Map:", ""))
      .addField("Player List", `\`\`\`css\n${playerString}\`\`\``)
      .setImage(`https:${mapimage}`)
      .setFooter(`If no map image is present, the GameTracker API limit has been exceeded.`)
    }

    msg.channel.send(message)

    })
    .catch((err) => {
      index.logger.error(`An error has occured. Stack: ${err.stack}`)
    })

}

exports.description = 'Query a server given an (IP:port) using the GameTracker website.'
exports.aliases = ["sq"]