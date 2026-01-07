CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    FirstName VARCHAR(100) NOT NULL,
    LastName  VARCHAR(100) NOT NULL,

    phoneNumber VARCHAR(20) NOT NULL,
    email VARCHAR(150) NULL,

    pin CHAR(4) NOT NULL CHECK (pin REGEXP '^[0-9]{4}$'),

    policyAccepted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Named constraints for future-proofing
    CONSTRAINT uq_users_phone UNIQUE (phoneNumber),
    CONSTRAINT uq_users_email UNIQUE (email)
);
