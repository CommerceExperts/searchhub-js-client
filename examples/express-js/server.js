const express = require('express')
const cookieParser = require('cookie-parser');
const {ExpressJsClientFactory, ExpressCookieAccess} = require("searchhub-js-client");

const app = express();
app.use(cookieParser());

const port = 3000;


app.get('/smartquery', (req, res) => {
    const {smartQueryClient} = ExpressJsClientFactory({
        tenant: "your.tenant",
        cookieAccess: new ExpressCookieAccess(req, res),
        abTestActive: true
    });

    smartQueryClient.getMapping(req.query.userQuery)
        .then((result) => {
            res.send(result);
        });
});

app.get('/smartsuggest', (req, res) => {
    const {smartSuggestClient, abTestManager} = ExpressJsClientFactory({
        tenant: "your.tenant",
        cookieAccess: new ExpressCookieAccess(req, res),
        abTestActive: true
    });

    if (abTestManager.isSearchhubActive()) {
        smartSuggestClient.getSuggestions(req.query.userQuery)
            .then((suggestions) => {
                res.send(suggestions);
            });
    } else {
        res.send("No searchhub active");
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})