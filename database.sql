CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    FirstName VARCHAR(100) NOT NULL,
    LastName  VARCHAR(100) NOT NULL,

    phoneNumber VARCHAR(20) NOT NULL,
    email VARCHAR(150) NULL,

    pin VARCHAR(255) NOT NULL,

    policyAccepted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Named constraints for future-proofing
    CONSTRAINT uq_users_phone UNIQUE (phoneNumber),
    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS riders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phoneNumber VARCHAR(255) NOT NULL UNIQUE,
    pin VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    vehicleType ENUM('comfort', 'mini', 'rickshaw', 'bike') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
