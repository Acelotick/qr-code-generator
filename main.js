
let { readFileSync, existsSync, createWriteStream } = require('fs')
const { image } = require('qr-image')

const print = (rgb, text) => process.stdout.write(`\x1b[38;2;${rgb.split(' ')[0]};${rgb.split(' ')[1]};${rgb.split(' ')[2]}m${text}\x1b[0m`)
const log = (rgb, text) => print(rgb, text + '\n')

let ini = readFileSync('qrcode-gen.ini', { encoding: 'utf8' }).split('\n')

let ini2 = {
    first: ini[0].replace(/\r$/, ''),
    second: ini[1].replace(/\r$/, ''),
    mainColor: ini[2].replace(/\r$/, ''),
    color: ini[3].replace(/\r$/, '')
}

let time = String(new Date()).split(' ')
let filename_time = [time[2], time[4].split(':').join('.')].join('.')

log('255 255 255', 'INFO ## Создатель QR-Кодов от Acelotick')

let canrun = 1

if (!process.argv[2]) {
    log('255 100 100', 'ERR  ## Введите текст создаваемый в QR-Коде')
    canrun = 0
}

let text = process.argv.join(' ').substring(process.argv[0].length + process.argv[1].length + 2)
if (text.length > 452) {
    log('255 100 100', 'ERR  ## Невозможно создать QR-Код превышающий 452 символа')
    canrun = 0
}

canrun ? function() {
    log('255 255 255', 'INFO ## Создание QR кода..')
    let qr = image(text, { type: 'png', ec_level: 'L', margin: 0 })
    qr.on('end', () => {
        log('200 255 200', 'INFO ## QR Код создан!')
    })
    qr.on('error', (e) => {
        log('255 0 0', `ERROR # ${e.message}`)
    })

    qr.pipe(createWriteStream(`${ini2.second}${ini2.first} - ${filename_time}.png`))
}() : void 0
