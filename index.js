const {
    WAConnection,
    MessageType,
    Mimetype,
    MessageOptions
} = require('@adiwajshing/baileys')
const { color, bgcolor } = require('./lib/color')
const { help } = require('./src/help')
const { wait } = require('./lib/functions')
const { getBuffer, fetchJson } = require('./lib/fetcher')
const fs = require('fs')
const client = new WAConnection()
const moment = require('moment-timezone')
const { exec } = require('child_process')
const kagApi = require('@kagchi/kag-api')
const fetch = require('node-fetch')
const imgbb = require('imgbb-uploader')
const speed = require('performance-now')

async function start() {
	client.on('qr', () => {
		console.log(color('[','white'), color('!','red'), color(']','white'), color('Scan the qr code above'))
	})

	client.on('credentials-updated', () => {
		fs.writeFileSync('./angga.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
	})

	fs.existsSync('./angga.json') && client.loadAuthInfo('./angga.json')

	await client.connect({timeoutMs: 30*1000})

	client.on('group-participants-update', async (anu) => {
		try {
			const mdata = await client.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				try {
					ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i.ibb.co/swr7r1z/IMG-20201211-WA0508-picsay.jpg'
				}
				teks = `Halo *${mdata.participants[1].notify}*\nSelamat Datang Di *${mdata.subject}*\nSaya Elaina[BOT] Silahkan Ketik !menu Untuk Melihat Menuku`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks})
			} else if (anu.action == 'remove') {
				try {
					ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i.ibb.co/swr7r1z/IMG-20201211-WA0508-picsay.jpg'
				}
				teks = `Jangan Lupain Aku Ya Beb`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
	client.on('message-new', async (mek) => {
		try {
			if (!mek.message) return
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			const apiKey = 'Apikey' 
			const vkey = 'ApiKey'       // Chat Me wa.me/6289636293927 To Get All Apikey
			const apinau = 'ApiKey'
			const msgType = MessageType
			const msgMim = Mimetype
			const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
			console.log(color('[','white'), color(time), color(']','white'), 'from', color(from.split('@')[0]), 'type' , color(type))
			if (mek.key.fromMe) return // replace (mek.key.fromMe) to (!mek.key.fromMe) for make self bot
			if (type == 'conversation') {
				const body = mek.message.conversation.toLowerCase()
				const args = body.split(' ')
				if (body.startsWith('!gtts ')) {
					rendom = `./mp3/${Math.floor(Math.random() * 10000)}.mp3`
					random = `./mp3/${Math.floor(Math.random() * 20000)}.ogg`
					if (args.length < 1) return client.sendMessage(from, 'Masukkan kode bahasanya juga mas e', msgType.text, {quoted: mek})
					const gtts = require('./lib/gtts')(args[1])
					const dtt = body.slice(8)
					if (!dtt) return client.sendMessage(from, 'Masukkan teks buat di jadiin suaranya juga mas e', msgType.text, {quoted: mek})
					if (dtt.length > 600) return client.sendMessage(from, 'Ngotak mas', msgType.text, {quoted: mek})
					gtts.save(rendom, dtt, function () {
						exec(`ffmpeg -i ${rendom} -ar 48000 -vn -c:a libopus ${random}`, (error, stdout, stder) => {
							let res = fs.readFileSync(random)
							client.sendMessage(from, res, msgType.audio, {ptt: true})
							fs.unlinkSync(random)
							fs.unlinkSync(rendom)
						})
					})
				} else if (body == '!ping') {
					const timestamp = speed();
					const latensi = speed() - timestamp
					exec(`neofetch --stdout`, (error, stdout, stderr) => {
						const child = stdout.toString('utf-8')
					  const teks = child.replace(/Memory:/, "Ram:")
					client.sendMessage(from, `${teks}\nSpeed: ${latensi.toFixed(4)} _Second_`, msgType.text, {quoted: mek})
					})
				} else if (body == 'gay') {
					const meme = await kagApi.memes()
					const buffer = await getBuffer(`https://imgur.com/${meme.hash}.jpg`)
					client.sendMessage(from, buffer, msgType.image, {quoted: mek})
				} else if (body == '!pokemon') {
					q7 = Math.floor(Math.random() * 890) + 1;
                    const buffer = await getBuffer(`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${q7}.png`)
				   client.sendMessage(from, buffer, msgType.image, {quoted: mek})
				} else if (body == '!neko') {
					q2 = Math.floor(Math.random() * 900) + 300;
                    q3 = Math.floor(Math.random() * 900) + 300;
                    const neko = 'http://placekitten.com/'+q3+'/'+q2
                    const buffer = await getBuffer(neko)
					client.sendMessage(from, buffer, msgType.image, {quoted: mek})
				} else if (body.startsWith('!buatqr')) {
					const teks = encodeURIComponent(body.slice(8))
						if (!teks) return client.sendMessage(from, 'Masukan Teks/Url Yang Ingin Di Buat QR', msgType.text, {quoted: mek})
						const buffer = await getBuffer(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${teks}`)
					    client.sendMessage(from, buffer, msgType.image, {quoted: mek})
				} else if (body == 'test') {
					console.log(from)
					const mek2 = `${mek} Hasil`
					client.sendMessage(from, mek, msgType.text, {quoted: mek})
				} else if (body == '!meme') {
					const buffer = await getBuffer(`http://api.naufalhosting.com/api/meme?apikey=${apinau}`)
					client.sendMessage(from, buffer, msgType.image, {quoted: mek})
				} else if (body.startsWith('!thunder')) {
					const teks = encodeURIComponent(body.slice(9))
						if (!teks) return client.sendMessage(from, 'Input teks yang ingin di tulis', msgType.text, {quoted: mek})
					const buffer = await getBuffer(`https://api.vhtear.com/thundertext?text=${teks}&apikey=${vkey}`)
					client.sendMessage(from, buffer, msgType.image, {quoted: mek})
			    } else if (body.startsWith('!tahta')) {
					const teks = encodeURIComponent(body.slice(7))
						if (!teks) return client.sendMessage(from, 'Input teks yang ingin di tulis', msgType.text, {quoted: mek})
					const buffer = await getBuffer(`https://api.vhtear.com/hartatahta?text=${teks}&apikey=${vkey}`)
					client.sendMessage(from, buffer, msgType.image, {quoted: mek})
				} else if (body.startsWith('!nulis ')) {
					try {
						const teks = encodeURIComponent(body.slice(7))
						if (!teks) return client.sendMessage(from, 'Input teks yang ingin di tulis', msgType.text, {quoted: mek})
						const anu = await fetchJson(`https://mhankbarbars.herokuapp.com/nulis?text=${teks}&apiKey=${apiKey}`, {method: 'get'})
						const buffer = await getBuffer(anu.result)
						client.sendMessage(from, buffer, msgType.image, {quoted: mek, caption: 'Sukses nulis ✓'})
					} catch (e) {
						console.log(`Error : ${e}`)
						client.sendMessage(from, 'Gagal nulis *X*', msgType.text, {quoted: mek})
					}
			    } else if (body.startsWith('!gtitle')) {
					try {
						const teks = body.slice(7)
						if (!teks) return client.sendMessage(from, 'Command Salah Masukan !gtitle JUDUL\n\n Contoh !gtitle GROUP ONLY VIP', msgType.text, {quoted: mek})
						await client.groupUpdateSubject(from, teks)
						var jids = [];
    mesaj = ``;
            mesaj += '@' + mek.participant.split('@')[0] + '\n ';
            jids.push(mek.participant.replace('c.us', 's.whatsapp.net'));
						client.sendMessage(from, `Nama Group Telah Di Ganti Ke ${teks}\nOleh ${mesaj}`, msgType.extendedText, {contextInfo: {mentionedJid: jids}, previewType: 0})
						} catch (e) {
						console.log(`Error : ${e}`)
						}
				} else if (body.startsWith('!gdesc')) {
					try {
						const teks = body.slice(7)
						if (!teks) return client.sendMessage(from, 'Command Salah Masukan !gdesc Isi Description\n\n Contoh !gdesc 1.peraturan masukan bot jika sudah bayar', msgType.text, {quoted: mek})
						client.sendMessage(from, tunggu, msgType.text, {quoted: mek})
				   await client.groupUpdateDescription(from, teks)
						var jids = [];
    mesaj = ``;
            mesaj += '@' + mek.participant.split('@')[0] + '\n ';
            jids.push(mek.participant.replace('c.us', 's.whatsapp.net'));
						client.sendMessage(from, ` Description Telah Di Ganti Ke ${teks}\nOleh ${mesaj}`, msgType.extendedText, {contextInfo: {mentionedJid: jids}, previewType: 0})
						} catch (e) {
						console.log(`Error : ${e}`)
						}
			   } else if (body.startsWith('!tagall')) {
					try {
						const teks = body.slice(8)
						const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
					grup = await client.groupMetadata(from);
    var jids = [];
    mesaj = `Di Tag Pada ${time}\n\n${teks}`;
    grup['participants'].map(
        async (uye) => {
            mesaj += '@' + uye.id.split('@')[0] + ' ';
            jids.push(uye.id.replace('c.us', 's.whatsapp.net'));
        }
    );
    await client.sendMessage(from, mesaj, MessageType.extendedText, {contextInfo: {mentionedJid: jids}, previewType: 0})
	} catch (e) {
						console.log(`Error : ${e}`)
						client.sendMessage(isOwner, `EROR:\n\n ${e}`, msgType.text, {quoted: mek})
						}
					// uncomment if you want to activate this feature
				/*} else if (body.startsWith('!tsticker ') || body.startsWith('!tstiker ')) {
					const teks = encodeURIComponent(body.slice(args[0].length))
					random = `${Math.floor(Math.random() * 10000)}.png`
					rendom = `${Math.floor(Math.random() * 20000)}.webp`
					if (!teks) return client.sendMessage(from, 'Input teks yang ingin dijadikan stiker', msgType.text, {quoted: mek})
					const anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/text2image?text=${teks}&apiKey=${apiKey}`, {method: 'get'})
					exec(`wget ${anu.result} -O ${random} && ffmpeg -i ${random} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rendom}`, (error, stdout, stderr) => {
						let buffer = fs.readFileSync(rendom)
						client.sendMessage(from, buffer, msgType.sticker, {quoted: mek})
						fs.unlinkSync(random)
						fs.unlinkSync(rendom)
					})*/
				} else if (body == '!help' || body == '!menu') {
					client.sendMessage(from, help(), msgType.text, {quoted: mek})
				} else if (body.startsWith('!downhentai')) {
					try {
						const teks = body.slice(12)
					const anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/nhentai?type=download&nuklir=${teks}&apiKey=${apiKey}`, {method: 'get'})
					const ids = `${anu.id}.pdf`
					exec(`wget ${anu.result} -O ${ids}`, (error, stdout, stderr) => {
			        const buffer = fs.readFileSync(ids)
                    client.sendMessage(from, buffer, msgType.document, {mimetype: Mimetype.pdf}, {quoted: mek})
                    })
                 } catch (e) {
						console.log(`Error : ${e}`)
						client.sendMessage(from, `Maaf Terjadi Masalah\n\n ${e}`, msgType.text, {quoted: mek})
						}
				} else if (body == '!getpp:') {
					const ppUrl = await client.getProfilePicture(from) // leave empty to get your own
					const buffer = await getBuffer(ppUrl)
					client.sendMessage(from, buffer, msgType.image, {quoted: mek, caption: `Ini PPnya`})
				} else if (body == '!tod' || body == '!truthordare') {
					            const diti = fs.readFileSync('./lib/data/per.json')
            const ditiJsin = JSON.parse(diti)
            const rindIndix = Math.floor(Math.random() * ditiJsin.length)
            const rindKiy = ditiJsin[rindIndix]
var data = `*${rindKiy.game}*\n\n${rindKiy.soal}`
					let buffer = fs.readFileSync('./temp/27420-truth-or-dare.jpg')
					client.sendMessage(from, buffer, msgType.image, {quoted: mek, caption: `${data}`})
					
				} else {
					return false
				}

			} else if (type == 'imageMessage') {
				const captimg = mek.message.imageMessage.caption.toLowerCase()
				if (captimg == '!stiker' || captimg == '!sticker') {
					media = await client.downloadAndSaveMediaMessage(mek)
					rendom = `./temp/${Math.floor(Math.random() * 10000)}.webp`
					exec(`ffmpeg -i ${media} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rendom}`, (error, stdout, stderr) => {
						let buffer = fs.readFileSync(rendom)
						client.sendMessage(from, buffer, msgType.sticker, {quoted: mek})
						fs.unlinkSync(rendom)
						fs.unlinkSync(media)
					})
				} else if (captimg == '!wait') {
					media = await client.downloadAndSaveMediaMessage(mek)
					let buffer = fs.readFileSync(media)
					await wait(buffer).then(res => {
						client.sendMessage(from, res.video, msgType.video, {caption: hasil.teks, quoted: mek})
						fs.unlinkSync(media)
					}).catch(err => {
						client.sendMessage(from, err, msgType.text, {quoted: mek})
						fs.unlinkSync(media)
					})
				} else if (captimg == 'Elaina') {
					media = await client.downloadAndSaveMediaMessage(mek)
			       await setProfilePicture(media)
			var jids = [];
    mesaj = `Terimakasih`;
            mesaj += '@' + mek.participant.split('@')[0] + '\n ';
            jids.push(mek.participant.replace('c.us', 's.whatsapp.net'));
			client.sendMessage(from, `${mesaj} Telah Mengganti Profil Ku`, msgType.text, {quoted: mek})
				} else if (captimg == '!gpp' || captimg == '!gprofile') {
					client.sendMessage(from, tunggu, msgType.text, {quoted: mek})
					media = await client.downloadAndSaveMediaMessage(mek)
			       await conn.updateProfilePicture (from, media)
			client.sendMessage(from, 'Sukses Mengganti Icon Group', msgType.text, {quoted: mek})
				} else {
					return
				}

			} else if (type == 'videoMessage') {
				const captvid = mek.message.videoMessage.caption.toLowerCase()
				if (captvid == '!stiker' || captvid == '!sticker') {
					media = await client.downloadAndSaveMediaMessage(mek)
					rendom = `./temp/${Math.floor(Math.random() * 100)}.webp`
					exec(`ffmpeg -i ${media} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rendom}`, (error, stdout, stderr) => {
						let buffer = fs.readFileSync(rendom)
						client.sendMessage(from, buffer, msgType.sticker, {quoted: mek})
						fs.unlinkSync(rendom)
						fs.unlinkSync(media)
					})
				} else {
					return
				}

			} else if (type == 'extendedTextMessage') {
				mok = JSON.parse(JSON.stringify(mek).replace('quotedM','m'))
				qtdMsg = mek.message.extendedTextMessage.text.toLowerCase()
				if (qtdMsg == '!stiker' || qtdMsg == '!sticker' && content.includes('imageMessage') || content.includes('videoMessage')) {
					media = await client.downloadAndSaveMediaMessage(mok.message.extendedTextMessage.contextInfo)
					rendom = `./temp/${Math.floor(Math.random() * 100)}.webp`
					exec(`ffmpeg -i ${media} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rendom}`, (error, stdout, stderr) => {
						let buffer = fs.readFileSync(rendom)
						client.sendMessage(from, buffer, msgType.sticker, {quoted: mek})
						fs.unlinkSync(rendom)
						fs.unlinkSync(media)
					})
				} else if (qtdMsg == 'Elaina' && content.includes('imageMessage')) {
					client.sendMessage(from, tunggu, msgType.text, {quoted: mek})
					media = await client.downloadAndSaveMediaMessage(mok.message.extendedTextMessage.contextInfo)
			       await setProfilePicture(media)
			var jids = [];
    mesaj = `Terimakasih`;
            mesaj += '@' + mek.participant.split('@')[0] + '\n ';
            jids.push(mek.participant.replace('c.us', 's.whatsapp.net'));
			client.sendMessage(from, `${mesaj} Telah Mengganti Profil Ku`, msgType.text, {quoted: mek})
				} else if (qtdMsg == '!wait' && content.includes('imageMessage')) {
					media = await client.downloadAndSaveMediaMessage(mok.message.extendedTextMessage.contextInfo)
					let buffer = fs.readFileSync(media)
					await wait(buffer).then(res => {
						client.sendMessage(from, res.video, msgType.video, {caption: res.hasil, quoted: mek})
						fs.unlinkSync(media)
					}).catch(err => {
						client.sendMessage(from, err, msgType.text, {quoted: mek})
						fs.unlinkSync(media)
					})
				} else if (qtdMsg == '!toimg' && content.includes('stickerMessage')) {
					media = await client.downloadAndSaveMediaMessage(mok.message.extendedTextMessage.contextInfo)
					random = `${Math.floor(Math.random() * 10)}.png`
					exec(`ffmpeg -i ${media} ${random}`, (error, stdout, stderr) => {
						let buffer = fs.readFileSync(random)
						client.sendMessage(from, buffer, msgType.image, {quoted: mek, caption: '>//<'})
					})
				} else {
					return
				}
			} else {
				return false
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
}
start().catch((err) => console.log(`Error : ${err}`))
