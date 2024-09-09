<p align="center">
  <a href="https://www.searchhub.io/" target="blank"><img src="https://avatars.githubusercontent.com/u/29304684?v=4" width="120" alt="Searchhub Logo" /></a>
</p>

<p align="center">A fast and simple JavaScript client library for searchHubs smartQuery and smartSuggest modules</p>

# Installation

`npm i -S searchhub-js-client`

# Demos

Checkout the [examples](https://github.com/CommerceExperts/searchhub-js-client/tree/main/examples) folder for a backend and frontend integration demo

# Usage

recommended browser example

```typescript
import {ClientFactory} from "searchhub-js-client";

const {smartSuggestClient, smartQueryClient, abTestManager} = BrowserClientFactory({
    tenant: "{YOUR}.{TENANT}",
    abTestActive: false
});


if (abTestManager.isSearchhubActive()) {
    // use our client
    const suggestions = await smartSuggestClient.getSuggestions("jeannss");
} else {
    // use your own as you type suggest endpoint
}

// automatically respects ab test assignment + caching
const mapping = await smartQueryClient.getMapping("jeanss");
```

Recommended backend example (expressJs)

```typescript
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
```

