const express = require('express')
const cookieParser = require('cookie-parser');
const {ExpressJsClientFactory, ExpressCookieAccess} = require("searchhub-js-client");
const path = require('path');

const port = 3000;
const app = express();

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const tenant = "{YOUR}.{TENANT}";
const abTestActive = false;

app.get('/smartquery', (req, res) => {
    /**
     * For the AB test to work we need to create a client per request.
     */
    const {smartQueryClient} = ExpressJsClientFactory({
        tenant,
        abTestActive,
        cookieAccess: new ExpressCookieAccess(req, res)
    });

    smartQueryClient.getMapping(req.query.userQuery)
        .then((result) => {
            res.send(result);
        });
});

app.get('/smartsuggest', (req, res) => {
    /**
     * For the AB test to work we need to create a client per request.
     */
    const {smartSuggestClient, abTestManager} = ExpressJsClientFactory({
        tenant,
        abTestActive,
        cookieAccess: new ExpressCookieAccess(req, res)
    });

    if (abTestActive === false || abTestManager.isSearchhubActive()) {
        smartSuggestClient.getSuggestions(req.query.userQuery)
            .then((suggestions) => {
                res.send(suggestions);
            });
    } else {
        res.send("No searchhub active, TODO implement your own endpoint");
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})