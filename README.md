<p align="center">
  <a href="https://www.searchhub.io/" target="blank"><img src="https://avatars.githubusercontent.com/u/29304684?v=4" width="120" alt="Searchhub Logo" /></a>
</p>

<p align="center">A fast and simple JavaScript client library for searchHubs smartQuery and smartSuggest modules</p>

# Installation

`npm i -S searchhub-js-client`

# Usage

smartSuggest

```typescript
import {SmartSuggestClient} from "searchhub-js-client";

const smartSuggestClient = new SmartSuggestClient({tenant: "your.tenant"});
const suggestions = await smartSuggestClient.getSuggestions("jeannss");
```

smartQuery

```typescript
import {SmartQueryClient} from "searchhub-js-client";

const smartQueryClient = new SmartQueryClient({tenant: "your.tenant", isAbTestActive: false});
const mapping = await smartQueryClient.getMapping("jeannss");

mapping.searchQuery // use the new query to pass on to your search engine
```

caching optimized usage

```typescript
import {SmartQueryClient, SmartSuggestClient, SimpleMemoryCache} from "searchhub-js-client";

const simpleMemoryCache = new SimpleMemoryCache(360, 360);

const smartSuggestClient = new SmartSuggestClient({tenant: "your.tenant"}, simpleMemoryCache);
const suggestions = await smartSuggestClient.getSuggestions("jeannss");

const smartQueryClient = new SmartQueryClient({tenant: "your.tenant", isAbTestActive: false}, simpleMemoryCache);

// this will be a cache hit because we already know the mapping from the smartSuggest endpoint
const mapping = await smartQueryClient.getMapping("jeannss");
```

AB testing with `SmartQueryClient`
```typescript
import {AbTestSegmentManager, BrowserCookieAccess, SmartQueryClient} from "searchhub-js-client";

const abTestSegmentManager = new AbTestSegmentManager({
    cookieAccess: new BrowserCookieAccess()
});

const smartQueryClient = new SmartQueryClient({
    tenant: "your.tenant",
    isAbTestActive: true,
    abTestManager: abTestSegmentManager
});

// automatically returns the provided user query if the session is in control segment or retrieves the new query from searchHub endpoint if the session is assigned to the searchHub segment
const mapping = await smartQueryClient.getMapping("jeannss");
```

AB testing with `SmartSuggestClient`
```typescript
import {AbTestSegmentManager, BrowserCookieAccess, SmartSuggestClient} from "searchhub-js-client";

const abTestSegmentManager = new AbTestSegmentManager({
    cookieAccess: new BrowserCookieAccess()
});

const smartSuggestClient = new SmartSuggestClient({
    tenant: "your.tenant"
});

if (abTestSegmentManager.isSearchhubActive()) {
    // use smartSuggest
    smartSuggestClient.getSuggestions("userQuery");
} else {
    // use your own as you type suggest endpoint 
}
```
