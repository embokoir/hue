const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const IP = process.env.IP
const ID = process.env.ID
const DEFAULT_PARAMS = { on: true, bri: 96, xy: [0.15, 0.05], effect: 'none' }

const weather = require('./weather')

async function main() {
    const input = process.argv[2]

    const commands = {
        on:      { ...DEFAULT_PARAMS },
        off:     { ...DEFAULT_PARAMS, on: false },
        loop:    { ...DEFAULT_PARAMS, effect: 'colorloop' },
        stop:    { ...DEFAULT_PARAMS, effect: 'none' }, // equal to 'on'
        random:  { ...DEFAULT_PARAMS, xy: [Math.round(Math.random()*100)/100, Math.round(Math.random()*100)/100] },
        red:     { ...DEFAULT_PARAMS, xy: [0.69, 0.27] },
        weather: { ...DEFAULT_PARAMS, xy: await getXyWithWeather() }
    }

    // when command is empty or 'help'
    if (!input || input === 'help') {
        showCommands(commands)
        return
    }
    // when command exists
    for (let commandName in commands) {
        if (input === commandName) {
            turnHue(commands[commandName])
            return
        }
    }
    // when command doesn't exist
    console.log('command not exist' + '\n')
    showCommands(commands)

    return
}
main()

async function turnHue(params = DEFAULT_PARAMS) {
    axios({
        url: `http://${IP}/api/${ID}/lights/1/state`,
        method: 'PUT',
        headers: { "Content-Type" : 'application/json'},
        data: params
    })
        .then(res => console.log('Huuuuuuuuuue!'))
        .catch(err => console.log(err.response.data))
}

async function showCommands(commands) {
    const output =
        'usage: hue [command]' + '\n' +
        'available command ↓' + '\n' + '\n' +
        Object.keys(commands).map(commandName => ` hue ${commandName}`).join('\n')
    console.log(output)
}

async function getXyWithWeather() {
    const prec = await weather.getTomorrowPrecipitation()
    return prec <= 0 ? [0.638, 0.248] :
        prec <= 30 ? [0.425, 0.467] :
        prec <= 60 ? [0.313, 0.329] :
        prec <= 80 ? [0.130, 0.100] :
        [0.163, 0.026]
}
