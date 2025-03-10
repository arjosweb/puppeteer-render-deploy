import express from "express";
import puppeteer from "puppeteer";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

app.get("/", async (req, res) => {
    try {
        console.log("Server UP!", {request: req});
        res.send({ msg: "Server is running.", success: true, status_code: 200 });
    } catch (error) {
        console.error("Error running the script:", error);
        res.status(500).send({
            msg: "Error running the script. Check the logs for more details.",
            success: false,
            status_code: 500
        });
    }
});

app.get("/scrape", async (req, res) => {
    let browser;
    try {
        try {
            console.log("Starting Puppeteer...");

            const browser = await puppeteer.launch({
                args: [
                    "--disable-setuid-sandbox",
                    "--no-sandbox",
                    "--single-process",
                    "--no-zygote",
                ],
                timeout: 60000,  // Increasing the timeout to 60 seconds
            });

            const page = await browser.newPage();
            await page.goto("https://www.arjos.com.br");
            const title = await page.title();

            console.log("Puppeteer started successfully!");
            res.send({title});
        } catch (error) {
            console.error("Error starting Puppeteer:", error);
            res.status(500).send({
                msg: "Error starting Puppeteer.",
                error: error,
                success: false,
                status_code: 500
            });
        }
    } catch (error) {
        console.error("Error running Puppeteer:", error);
        res.status(500).send({
            msg: "Error running Puppeteer. Check the logs for more details.",
            error: error,
            success: false,
            status_code: 500
        });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` 🚀  Server running on port ${PORT}`);
});
