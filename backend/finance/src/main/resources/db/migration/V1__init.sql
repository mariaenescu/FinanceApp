-- V1: Initial schema

CREATE TABLE cards (
    id              VARCHAR(36)  PRIMARY KEY,
    card_number     VARCHAR(255) NOT NULL,
    cvv_number      VARCHAR(255) NOT NULL,
    pin_code        VARCHAR(255),
    expiration_date TIMESTAMP    NOT NULL
);

CREATE TABLE accounts (
    id                          VARCHAR(36)    PRIMARY KEY,
    iban                        VARCHAR(255)   UNIQUE NOT NULL,
    balance                     NUMERIC(19, 2) NOT NULL,
    category                    VARCHAR(50)    NOT NULL,
    card_id                     VARCHAR(36)    REFERENCES cards (id),
    low_balance_alert_enabled   BOOLEAN        NOT NULL DEFAULT TRUE,
    low_balance_threshold       NUMERIC(19, 2) NOT NULL DEFAULT 150.00,
    last_low_balance_alert_at   TIMESTAMP
);

CREATE TABLE account_friends (
    account_id VARCHAR(36)  NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
    friend     VARCHAR(255) NOT NULL,
    PRIMARY KEY (account_id, friend)
);

CREATE TABLE users (
    id         VARCHAR(36)  PRIMARY KEY,
    full_name  VARCHAR(255) NOT NULL,
    email      VARCHAR(255) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(50)  NOT NULL,
    account_id VARCHAR(36)  REFERENCES accounts (id)
);

CREATE TABLE expenses (
    id            VARCHAR(36)    PRIMARY KEY,
    description   VARCHAR(255)   NOT NULL,
    amount        NUMERIC(19, 2) NOT NULL,
    date          TIMESTAMP      NOT NULL,
    iban_receiver VARCHAR(255)   NOT NULL,
    iban_sender   VARCHAR(255)   NOT NULL,
    category      VARCHAR(50)    NOT NULL
);

CREATE TABLE incomes (
    id            VARCHAR(36)    PRIMARY KEY,
    description   VARCHAR(255)   NOT NULL,
    amount        NUMERIC(19, 2) NOT NULL,
    date          TIMESTAMP      NOT NULL,
    iban_sender   VARCHAR(255)   NOT NULL,
    iban_receiver VARCHAR(255)   NOT NULL
);
