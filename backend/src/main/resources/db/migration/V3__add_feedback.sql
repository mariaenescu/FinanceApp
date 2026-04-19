CREATE TABLE feedback (
    id              VARCHAR(36)  PRIMARY KEY,
    experience      VARCHAR(255) NOT NULL,
    recommend       BOOLEAN      NOT NULL,
    liked_features  VARCHAR(511),
    comments        TEXT,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
