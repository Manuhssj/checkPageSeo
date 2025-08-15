const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

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
    if (!fs.existsSync(filePath)) {
        console.error(chalk.red(`❌ No se encontró el archivo: ${filePath}`));
        process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    return content.split(/\r?\n/).filter(line => line.trim() !== '');
}

// 🧾 Uso: node checkMany.js urls.txt [.selector]
const [, , txtFile, selectorArg] = process.argv;

if (!txtFile) {
    console.log(chalk.yellow('📌 Uso: node checkMany.js <archivo.txt> [selector]'));
    process.exit(1);
}

const urls = loadUrlsFromFile(path.resolve(__dirname, txtFile));
const selector = selectorArg || null;

checkMultipleUrls(urls, selector);
