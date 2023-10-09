const fs = require('fs');
const { AsciiTable3 } = require('ascii-table3');

module.exports = (client) => {

  fs.readdirSync('./events/').forEach(async folder => {
    var table = new AsciiTable3()
      .setHeading(`${folder}`, 'Load Status')
      .setAlignCenter(2)

    fs.readdirSync(`./events/${folder}`).forEach((f) => {
      if (!f.endsWith(".js")) return;
      const event = require(`../events/${folder}/${f}`);
      let eventName = f.split(".")[0];
      if (!event.bind) return table.addRow(eventName, 'NULL!')
      table.addRow(eventName, 'GOOD!')
      client.on(eventName, event.bind(null, client));
      delete require.cache[require.resolve(`../events/${folder}/${f}`)];
    });

    table.setStyle('unicode-round');
    console.log(table.toString());
  });
}   