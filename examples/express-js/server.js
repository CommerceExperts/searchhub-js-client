const express = require('express')
const cookieParser = require('cookie-parser');
const {ClientFactory, ExpressCookieAccess} = require("searchhub-js-client");

const app = express();
app.use(cookieParser());

const port = 3000;


app.get('/smartquery', (req, res) => {
    const userQuery = req.query.userQuery;
    const {smartQueryClient} = ClientFactory({
        tenant: "your.tenant",
        cookieAccess: new ExpressCookieAccess(req, res),
        abTestActive: true
    });

    smartQueryClient.getMapping(userQuery)
        .then((result) => {
            res.send(result);
        });
});

app.get('/smartsuggest', (req, res) => {
    const userQuery = req.query.userQuery;
    const {smartSuggestClient, abTestManager} = ClientFactory({
        tenant: "your.tenant",
        cookieAccess: new ExpressCookieAccess(req, res),
        abTestActive: true
    });

    if (abTestManager.isSearchhubActive()) {
        smartSuggestClient.getSuggestions(userQuery)
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