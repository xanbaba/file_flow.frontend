# Project Guidelines

## Design Guidelines
- Use MaterialUI for building the UI of the application
- If MaterialUI does not have a specific UI component, try finding libraries for that purpose
- Almost never build a UI component from scratch, try finding ready ones
- Color palette is #251605, #f6e27f, #e2c391, #a8b7ab, #9bbec7

## Architecture Guidelines
- Use React Router for routing
- Auth0 as an Identity Provider
- Do not hardcode values. Rather, have a config.js file
- Have a clear architecture: have dedicated folders for pages
- Use module CSS if needed. Take into consideration that using MaterialUI is of the highest priority