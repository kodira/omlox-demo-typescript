# omlox-demo-typescript

A simple demo trying out the OMLOX Hub API. For simplicity we only use the REST API of the OMLOX hub even though there is also a WebSocket API which might be better suited for a real-time use-case.

## About the Demo App

This is an "Intrusion Alarm System". Imagine you are Dr. Evil currently visiting granny. While away from home you
really want to know whenever a secret agent is sneaking into your lab. So you track them
and once they enter your lab, an alarm will go of. Easy!

![](./assets/screen01.png)


## General information and links

OMLOX Hub and OMLOX Engine are two different things. The OMLOX Engine collects location
data on site and sends this to the OMLOX Hub. The OMLOX Hub can get data from various
sources and provides a unified interface for clients to get that location data.

Our demo app will connect to the **Hub** not the **Engine**.

There are multiple implementations of the Engine and the Hub by various vendors. We are
using a product called "Coriva" which offers an implementation of the Hub API.

### Coriva Documentation
https://portal.coriva.io/coriva-docs/user_manual/2025.1

> [!NOTE]
> You'll need to create an account to access the documentation.

### Coriva Engine UI
- User interface: https://demo.coriva.io/app/map
- Default users and passwords can be found [here](https://portal.coriva.io/coriva-docs/user_manual/2025.1/user-accounts.html#_default_user_accounts).

## Coriva Hub UI
User interface: https://demo.coriva.io/omlox-ui/

## OAuth Credential to access the Hub API
- baseUrl: `https://demo.coriva.io/idp/realms/rtls/protocol/openid-connect`
- clientId and clientSecret can be found [here](https://portal.coriva.io/coriva-docs/user_manual/2025.1/developer-guide/api-authorization.html).

## Hub API access
- baseUrl: `https://demo.coriva.io/corivahub/v2`
- spec: `https://omlox.com/fileadmin/api/omlox_Hub_API_2.0.0.json`

## Development

To start a local development server, run:

```bash
npm install
```

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The
application will automatically reload whenever you modify any of the source files.
