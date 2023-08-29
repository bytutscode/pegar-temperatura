const puppeteer = require('puppeteer');

const getWeather = async (req, res) => {
    let { location } = req.query;

    if (!location) {
        return res.status(400).json({ mensagem: 'Você precisa enviar o nome da cidade!' })
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(`https://www.google.com/search?q=${encodeURI(location)}+clima&sca_esv=560996875&sxsrf=AB5stBjCMwLEjyMs94Cjg8jYoN5PLdSnIQ%3A1693314727283&ei=p-7tZJHrEJ7n1sQP2M2W4AE&ved=0ahUKEwjR2r_2-IGBAxWes5UCHdimBRwQ4dUDCBA&uact=5&oq=s%C3%A3o+paulo+clima&gs_lp=Egxnd3Mtd2l6LXNlcnAiEHPDo28gcGF1bG8gY2xpbWEyDRAAGIAEGMsBGEYYgAIyCBAAGIAEGMsBMggQABiABBjLATIIEAAYgAQYywEyCBAAGIAEGMsBMggQABiABBjLATIIEAAYgAQYywEyCBAAGIAEGMsBMggQABiABBjLATIIEAAYgAQYywFIkzNQAFi7MXABeAGQAQGYAfUCoAGuGaoBBzAuOS40LjK4AQPIAQD4AQGoAgrCAgcQIxjqAhgnwgIHECMYigUYJ8ICCBAAGIoFGJECwgIFEAAYgATCAgsQLhiABBjHARjRA8ICGhAuGIAEGMcBGNEDGJcFGNwEGN4EGOAE2AEBwgIFEC4YgATCAgcQLhiKBRhDwgIIEC4YgAQYywHCAhcQLhiABBjLARiXBRjcBBjeBBjgBNgBAeIDBBgAIEGIBgG6BgYIARABGBQ&sclient=gws-wiz-serp`);

        let [city, temperature, temperatureUnit] = await Promise.all([page.$('.vqkKIe.wHYlTd .BBwThe'), page.$('#wob_tm'), page.$('.vk_bk.wob-unit span')]);

        [city, temperature, temperatureUnit] = await Promise.all([page.evaluate(element => element.textContent, city), page.evaluate(element => element.textContent, temperature), page.evaluate(element => element.textContent, temperatureUnit)]);

        const info = {
            city,
            temperature: `${temperature}${temperatureUnit}`
        }
        await browser.close();

        return res.json(info)
    } catch (err) {
        console.log(err)
        return res.status(404).json({ error: 'Unfortunately, we have not found your city. Please verify the if the location is correct and try again. If the errors persist, there might be a problem on our server.' })
    }
}

module.exports = getWeather;