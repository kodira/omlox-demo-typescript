# omlox-demo-typescript

A simple demo trying out the OMLOX Hub API.

## General information and links

OMLOX Hub and OMLOX Engine are two different things. The OMLOX Engine collects location
data on site and sends this to the OMLOX Hub. The OMLOX Hub can get data from various
sources and provides a unified interface for clients to get that location data.

Our demo app will connect to the **Hub** not the **Engine**.

There are multiple implementations of the Engine and the Hub by various vendors. We are
using a product called "Coriva" which offers an implementation of the Hub API.

### Coriva Documentation
https://portal.coriva.io/coriva-docs/user_manual/2025.1

### Coriva Engine UI
https://demo.coriva.io/app/map
User: ***
Pass: ***

Other logins can be found here:
https://portal.coriva.io/coriva-docs/user_manual/2025.1/user-accounts.html#_default_user_accounts

## Coriva Hub UI
https://demo.coriva.io/omlox-ui

## OAuth Credential to access the Hub API
baseUrl: `https://demo.coriva.io/idp/realms/rtls/protocol/openid-connect`
clientId: '***',
clientSecret: '***'

## Hub API access
baseUrl: `https://demo.coriva.io/corivahub/v2`
spec: `https://omlox.com/fileadmin/api/omlox_Hub_API_2.0.0.json`


