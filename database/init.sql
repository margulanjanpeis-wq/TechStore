-- TechStore Database Initialization Script

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product categories
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    brand VARCHAR(100),
    specifications JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address TEXT,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shopping cart table
CREATE TABLE IF NOT EXISTS cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Ноутбуктар', 'Әртүрлі брендтердің ноутбуктары'),
('Процессорлар', 'Intel және AMD процессорлары'),
('Мониторлар', 'Компьютер мониторлары'),
('Аксессуарлар', 'Тышқан, пернетақта және басқа аксессуарлар'),
('Жад құрылғылары', 'RAM, SSD, HDD'),
('Видеокарталар', 'Графикалық карталар');

-- Insert sample products
INSERT INTO products (category_id, name, description, price, stock_quantity, brand, specifications) VALUES
(1, 'ASUS ROG Strix G15', 'Ойын ноутбугы AMD Ryzen 7, RTX 3060', 899999.00, 15, 'ASUS', '{"cpu": "AMD Ryzen 7 5800H", "gpu": "RTX 3060", "ram": "16GB", "storage": "512GB SSD"}'),
(1, 'Lenovo ThinkPad X1 Carbon', 'Бизнес класс ноутбук', 1299999.00, 10, 'Lenovo', '{"cpu": "Intel Core i7-1165G7", "ram": "16GB", "storage": "1TB SSD", "display": "14 inch FHD"}'),
(2, 'AMD Ryzen 9 5900X', '12 ядролы процессор', 349999.00, 25, 'AMD', '{"cores": 12, "threads": 24, "base_clock": "3.7GHz", "boost_clock": "4.8GHz"}'),
(2, 'Intel Core i9-12900K', '16 ядролы процессор', 449999.00, 20, 'Intel', '{"cores": 16, "threads": 24, "base_clock": "3.2GHz", "boost_clock": "5.2GHz"}'),
(3, 'Samsung Odyssey G7', '27 дюйм ойын мониторы', 299999.00, 30, 'Samsung', '{"size": "27 inch", "resolution": "2560x1440", "refresh_rate": "240Hz", "panel": "VA"}'),
(3, 'LG UltraWide 34WN80C', '34 дюйм кең монитор', 399999.00, 18, 'LG', '{"size": "34 inch", "resolution": "3440x1440", "refresh_rate": "60Hz", "panel": "IPS"}'),
(4, 'Logitech G Pro X Superlight', 'Сымсыз ойын тышқаны', 89999.00, 50, 'Logitech', '{"type": "wireless", "dpi": "25600", "weight": "63g"}'),
(4, 'Razer BlackWidow V3', 'Механикалық пернетақта', 119999.00, 40, 'Razer', '{"type": "mechanical", "switches": "Razer Green", "backlight": "RGB"}'),
(5, 'Kingston Fury Beast 32GB', 'DDR4 RAM 3200MHz', 89999.00, 60, 'Kingston', '{"capacity": "32GB", "type": "DDR4", "speed": "3200MHz"}'),
(5, 'Samsung 980 PRO 1TB', 'NVMe SSD', 129999.00, 45, 'Samsung', '{"capacity": "1TB", "type": "NVMe", "read_speed": "7000MB/s", "write_speed": "5000MB/s"}'),
(6, 'NVIDIA RTX 4070', 'Графикалық карта', 599999.00, 12, 'NVIDIA', '{"memory": "12GB GDDR6X", "cuda_cores": "5888", "boost_clock": "2.48GHz"}'),
(6, 'AMD Radeon RX 7800 XT', 'Графикалық карта', 549999.00, 15, 'AMD', '{"memory": "16GB GDDR6", "stream_processors": "3840", "boost_clock": "2.43GHz"}'
);

-- Insert sample admin user (password: admin123)
-- Hash format: salt:sha256_hash
INSERT INTO users (username, email, password_hash, full_name, is_admin) VALUES
('admin', 'admin@techstore.kz', '5dc4029c8e5679a2b5036320a7cbfd61:5752904af9228cfc8c0929fa251425653b47958eb7df0555ecbf5ff93a33e019', 'Әкімші', TRUE)
ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_cart_user ON cart(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON cart
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
