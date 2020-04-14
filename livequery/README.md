# Deprecation

This version of LiveQuery is deprecated. See https://github.com/kiobu/livequery for updates.

# LiveQuery

LiveQuery is a program that is used to fetch messages sent on Source game servers and post them to a Discord channel. Currently, it is embedded within my own Naisu bot, but will eventually become a standalone project.

## Features

- Private API for POST requests.
- Configurable SQL database to store messages (will eventually be able to be turned on or off).
- Scalable.
- Extremely fast *synchronous* SQL transactions using `better-sqlite3`.
- Multiple framework support (Clockwork, DarkRP, etc).

## API Usage

The API is locked in usage to only specific servers. A whitelist will be in development to prevent abuse of the API.

## Methods

- ### LiveQuery.db.Connect()

Connects to the database using details supplied in **lq_config.json**.

- ### LiveQuery.db.AddField(db, table)

Adds a field to the given SQLite 3 database object and a table. Fires a `newField` event.

- ### LiveQuery.db.FetchLatest(db)

Gets the latest field in the given SQLite 3 database object using `MAX(time)`.

## Constants

- ### LiveQuery.config

The `lq_config.json` file.

- ### LiveQuery.app

The `express` router.
