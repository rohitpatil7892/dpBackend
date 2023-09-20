CREATE Table
    Users{id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_id INTEGER,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP CONSTRAINT fk_role FOREIGN KEY(role_id) REFERENCES roles(role_id)};

CREATE Table
    Roles{role_id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP};

CREATE TABLE
    Labour_Profile{id INTEGER PRIMARY KEY AUTOINCREMENT,
    labour_type VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT,
    contact_number VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    alt_contact_number VARCHAR(255),
    adar_number VARCHAR(255) NOT NULL,
    pan_number VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP}

Create table
    Labour_Attendance{id INTEGER PRIMARY KEY AUTOINCREMENT,
    labour_id INTEGER,
    status BOOLEAN,
    date TIMESTAMP,
    in_time TIMESTAMP,
    out_time TIMESTAMP,
    comment VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP};

Create TABLE
    Labour_Salary{id INTEGER PRIMARY KEY AUTOINCREMENT,
    labour_id INTEGER,
    payment number,
    payment_details VARCHAR(255),
    payment_type VARCHAR(255),
    status VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP

} 

Create TABLE Expenses{ 

} 