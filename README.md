<p align="center">
  <a href="https://www.searchhub.io/" target="blank"><img src="https://avatars.githubusercontent.com/u/29304684?v=4" width="120" alt="Searchhub Logo" /></a>
</p>

<p align="center">A fast and simple JavaScript client library for searchHubs smartQuery and smartSuggest modules</p>

<p align="center">
    <a href="#" target="_blank"><img src="https://img.shields.io/github/actions/workflow/status/CommerceExperts/searchhub-js-client/main.yml" alt="build workflow" /></a>
    <a href="https://github.com/CommerceExperts/searchhub-js-client" target="_blank"><img src="https://img.shields.io/github/license/CommerceExperts/searchhub-js-client" alt="license" /></a>
    <a href="https://www.npmjs.com/package/searchhub-js-client" target="_blank"><img src="https://img.shields.io/npm/dw/searchhub-js-client" alt="downloads" /></a>
    <a href="https://www.npmjs.com/package/searchhub-js-client" target="_blank"><img src="https://img.shields.io/librariesio/release/npm/searchhub-js-client" alt="dependencies" /></a>
    <a href="https://www.npmjs.com/package/searchhub-js-client" target="_blank"><img src="https://img.shields.io/npm/v/searchhub-js-client" alt="version" /></a>
    <a href="https://twitter.com/cxpsearchhub" target="_blank"><img src="https://img.shields.io/github/stars/CommerceExperts/searchhub-js-client?style=social" alt="stars" /></a>
    <a href="https://twitter.com/cxpsearchhub" target="_blank"><img src="https://img.shields.io/twitter/follow/cxpsearchhub?style=social" alt="twitter" /></a>
</p>

# Installation

`npm i -S searchhub-js-client`

# Demos

Checkout the **[examples](https://github.com/CommerceExperts/searchhub-js-client/tree/main/examples)** folder for a backend and frontend integration demo

# Usage

recommended browser example

```typescript
import {BrowserClientFactory} from "searchhub-js-client";

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

