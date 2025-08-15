const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const readline = require('readline');

async function checkUrl(url, selector = null) {
    try {
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);
        const root = selector ? $(selector) : $('body');

        if (selector && root.length === 0) {
            return { url, status: 'sin_selector' };
        }

        let aIncompletos = false;
        let imgIncompletos = false;

        root.find('a').each((_, el) => {
            const title = $(el).attr('title');
            if (!title || title.trim() === '') {
                aIncompletos = true;
                return false;
            }
        });

        root.find('img').each((_, el) => {
            const alt = $(el).attr('alt');
            if (!alt || alt.trim() === '') {
                imgIncompletos = true;
                return false;
            }
        });

        return {
            url,
            status: (aIncompletos || imgIncompletos) ? 'incompleta' : 'completa'
        };

    } catch (err) {
        console.error(chalk.red(`❌ Error con ${url}: ${err.message}`));
        return { url, status: 'incompleta' };
    }
}

async function checkMultipleUrls(urls, selector = null) {
    console.log(chalk.blue(`\n🔍 Revisando ${urls.length} páginas...\n`));

    for (const url of urls) {
        if (!url.trim()) continue;
        const res = await checkUrl(url.trim(), selector);

        if (res.status === 'completa') {
            console.log(`${chalk.green('✅ completa')} → ${res.url}`);
        } else if (res.status === 'incompleta') {
            console.log(`${chalk.red('❌ incompleta')} → ${res.url}`);
        } else if (res.status === 'sin_selector') {
            console.log(`${chalk.yellow(`⚠️ sin selector "${selector}"`)} → ${res.url}`);
        }
    }
}

function loadUrlsFromFile(filePath) {
    const exePath = process.pkg ? path.dirname(process.execPath) : __dirname;
    const fullPath = path.resolve(exePath, filePath);

    try {
        if (!fs.existsSync(fullPath)) {
            console.error(chalk.red(`❌ No se encontró el archivo: ${fullPath}`));
            process.exit(1);
        }

        const content = fs.readFileSync(fullPath, 'utf-8');
        return content.split(/\r?\n/).filter(line => line.trim() !== '');
    } catch (err) {
        if (err.code === 'EBUSY' || err.code === 'EPERM') {
            console.error(chalk.red(`❌ El archivo está siendo usado por otro proceso: ${fullPath}`));
        } else {
            console.error(chalk.red(`❌ Error al leer el archivo: ${err.message}`));
        }
        process.exit(1);
    }
}

// 🧾 Uso: node checkMany.js urls.txt [.selector]
const [, , txtFile, selectorArg] = process.argv;

if (!txtFile) {
    console.log(chalk.yellow('📌 Uso: node checkMany.js <archivo.txt> [selector]'));
    process.exit(1);
}

const urls = loadUrlsFromFile(txtFile);
const selector = selectorArg || null;

// Ejecuta todo y espera al usuario antes de cerrar
async function main() {
    await checkMultipleUrls(urls, selector);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

}

main();
