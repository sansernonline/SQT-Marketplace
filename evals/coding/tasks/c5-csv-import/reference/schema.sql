CREATE TABLE IF NOT EXISTS products (
    sku   TEXT PRIMARY KEY,
    name  TEXT NOT NULL,
    price REAL NOT NULL,
    qty   INTEGER NOT NULL
);
