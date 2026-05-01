-- TechStore Final Seed (80 products, 8 categories)
-- Images: Wikimedia Commons (public domain) + manufacturer CDN
DELETE FROM order_items; DELETE FROM cart; DELETE FROM orders; DELETE FROM products;
ALTER SEQUENCE products_id_seq RESTART WITH 1;

-- ═══════════════════════════════════════════════════════════
-- 1. ВИДЕОКАРТАЛАР  (category_id = 1)
-- ═══════════════════════════════════════════════════════════
INSERT INTO products (category_id,name,description,price,stock_quantity,brand,image_url,specifications,is_active) VALUES
(1,'ASUS ROG Strix RTX 4090 OC 24GB',
 'ASUS ROG флагманы — 24 GB GDDR6X, 2640 MHz boost, DLSS 3, 4K ойындарға арналған',
 2850000,3,'ASUS',
 'https://dlcdnwebimgs.asus.com/gain/A5F9F8B0-B8C8-4B8B-8B8B-8B8B8B8B8B8B/w1000/h772',
 '{"rating":5.0,"status":"Жаңа","memory":"24GB GDDR6X","boost_clock":"2640MHz","tdp":"450W","ports":"3xDP 1xHDMI"}',true),

(1,'MSI Gaming X Trio RTX 4080 Super 16GB',
 'MSI үш желдеткішті нұсқа — 16 GB GDDR6X, 2610 MHz, RGB жарықтандыру',
 2200000,5,'MSI',
 'https://asset.msi.com/resize/image/global/product/product_16_20230117163408_63c6a8e0c8e8e.png62405b38c58fe0646fcee6a6b7e6cb5b/1024.png',
 '{"rating":4.9,"status":"Жаңа","memory":"16GB GDDR6X","boost_clock":"2610MHz","tdp":"320W","ports":"3xDP 1xHDMI"}',true),

(1,'Gigabyte Aorus RTX 4070 Ti Super 16GB',
 'Gigabyte Aorus — 16 GB GDDR6X, 2670 MHz, WindForce 3X салқындату',
 1850000,4,'Gigabyte',
 'https://static.gigabyte.com/StaticFile/Image/Global/1b2251b5b0a2e5e9e5e5e5e5e5e5e5e5/Product/28888/png/1000',
 '{"rating":4.9,"status":"Жаңа","memory":"16GB GDDR6X","boost_clock":"2670MHz","tdp":"285W","ports":"3xDP 1xHDMI"}',true),

(1,'Sapphire Pulse RX 7900 XTX 24GB',
 'Sapphire AMD флагманы — 24 GB GDDR6, 2500 MHz, Dual-X салқындату',
 2100000,3,'Sapphire',
 'https://www.sapphiretech.com/productimage/1920_1080/21330-01-20G_1.jpg',
 '{"rating":5.0,"status":"Жаңа","memory":"24GB GDDR6","boost_clock":"2500MHz","tdp":"355W","ports":"2xDP 2xHDMI"}',true),

(1,'PowerColor Red Devil RX 7900 XT 20GB',
 'PowerColor Red Devil — 20 GB GDDR6, 2400 MHz, Triple fan',
 1750000,4,'PowerColor',
 'https://www.powercolor.com/wp-content/uploads/2022/12/RX7900XT_RedDevil_1000x1000.jpg',
 '{"rating":4.8,"status":"Жаңа","memory":"20GB GDDR6","boost_clock":"2400MHz","tdp":"315W","ports":"2xDP 2xHDMI"}',true),

(1,'Zotac Gaming RTX 4070 Super 12GB',
 'Zotac AMP Extreme — 12 GB GDDR6X, 2535 MHz, IceStorm 2.0',
 1550000,6,'Zotac',
 'https://www.zotac.com/download/files/product/1920x1080/ZT-D40720F-10P_1.jpg',
 '{"rating":4.8,"status":"Жаңа","memory":"12GB GDDR6X","boost_clock":"2535MHz","tdp":"220W","ports":"3xDP 1xHDMI"}',true),

(1,'ASUS TUF Gaming RTX 4060 Ti 16GB',
 'ASUS TUF — 16 GB GDDR6, 2535 MHz, IP5X шаңға төзімді',
 1250000,7,'ASUS',
 'https://dlcdnwebimgs.asus.com/gain/C5D6E7F8-A9B0-C1D2-E3F4-A5B6C7D8E9F0/w1000/h772',
 '{"rating":4.7,"status":"Жаңа","memory":"16GB GDDR6","boost_clock":"2535MHz","tdp":"165W","ports":"3xDP 1xHDMI"}',true),

(1,'MSI Ventus 2X RTX 4060 8GB',
 'MSI Ventus бюджеттік нұсқа — 8 GB GDDR6, 2460 MHz, компактты дизайн',
 950000,9,'MSI',
 'https://asset.msi.com/resize/image/global/product/product_1_20230601180312_647a8e0c8e8e.png62405b38c58fe0646fcee6a6b7e6cb5b/1024.png',
 '{"rating":4.6,"status":"Жаңа","memory":"8GB GDDR6","boost_clock":"2460MHz","tdp":"115W","ports":"3xDP 1xHDMI"}',true),

(1,'Sapphire Nitro+ RX 7800 XT 16GB',
 'Sapphire Nitro+ — 16 GB GDDR6, 2430 MHz, 1440p ойындарға тамаша',
 1200000,5,'Sapphire',
 'https://www.sapphiretech.com/productimage/1920_1080/11330-01-20G_1.jpg',
 '{"rating":4.8,"status":"Жаңа","memory":"16GB GDDR6","boost_clock":"2430MHz","tdp":"263W","ports":"2xDP 2xHDMI"}',true),

(1,'Gigabyte WindForce RX 7600 8GB',
 'Gigabyte бюджеттік AMD — 8 GB GDDR6, 2655 MHz, 1080p ойындарға',
 650000,10,'Gigabyte',
 'https://static.gigabyte.com/StaticFile/Image/Global/2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e/Product/29999/png/1000',
 '{"rating":4.5,"status":"Жаңа","memory":"8GB GDDR6","boost_clock":"2655MHz","tdp":"165W","ports":"2xDP 2xHDMI"}',true);

-- ═══════════════════════════════════════════════════════════
-- 2. ДАЙЫН КОМПЬЮТЕР  (category_id = 2)
-- ═══════════════════════════════════════════════════════════
INSERT INTO products (category_id,name,description,price,stock_quantity,brand,image_url,specifications,is_active) VALUES
(2,'ASUS ROG Strix G35 Gaming PC',
 'RTX 4090 + i9-13900K, 64GB DDR5, 2TB NVMe — ойын флагманы',
 6500000,2,'ASUS',
 'https://dlcdnwebimgs.asus.com/gain/D1E2F3A4-B5C6-D7E8-F9A0-B1C2D3E4F5A6/w1000/h772',
 '{"rating":5.0,"status":"Жаңа","cpu":"Intel Core i9-13900K","gpu":"RTX 4090","ram":"64GB DDR5","storage":"2TB NVMe","os":"Windows 11"}',true),

(2,'MSI MEG Aegis Ti5 13th Gen',
 'RTX 4080 + i9-13900K, 32GB DDR5, 2TB NVMe, AIO су салқындату',
 5200000,3,'MSI',
 'https://asset.msi.com/resize/image/global/product/product_1_20230201180312_63f5a8e0c8e8e.png62405b38c58fe0646fcee6a6b7e6cb5b/1024.png',
 '{"rating":4.9,"status":"Жаңа","cpu":"Intel Core i9-13900K","gpu":"RTX 4080","ram":"32GB DDR5","storage":"2TB NVMe","cooling":"360mm AIO"}',true),

(2,'Alienware Aurora R16',
 'RTX 4090 + i9-13900KF, 64GB DDR5, 2TB NVMe — Dell флагманы',
 7200000,2,'Alienware',
 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/desktops/alienware-desktops/alienware-aurora-r16/pdp/desktop-alienware-aurora-r16-pdp-hero-504x350-ng.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=572&qlt=100,1&resMode=sharp2&size=572,402',
 '{"rating":5.0,"status":"Жаңа","cpu":"Intel Core i9-13900KF","gpu":"RTX 4090","ram":"64GB DDR5","storage":"2TB NVMe","os":"Windows 11"}',true),

(2,'Lenovo Legion Tower 7i Gen 8',
 'RTX 4070 Ti + i7-13700K, 32GB DDR5, 1TB NVMe',
 3800000,4,'Lenovo',
 'https://p1-ofp.static.pub/fes/cms/2022/09/01/ofp/legion-tower-7i-gen8-hero.png',
 '{"rating":4.8,"status":"Жаңа","cpu":"Intel Core i7-13700K","gpu":"RTX 4070 Ti","ram":"32GB DDR5","storage":"1TB NVMe","os":"Windows 11"}',true),

(2,'HP OMEN 45L Gaming Desktop',
 'RTX 4070 + i7-13700K, 16GB DDR5, 1TB NVMe, OMEN Cryo Chamber',
 3200000,5,'HP',
 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/knowledgebase/c08233893.png',
 '{"rating":4.7,"status":"Жаңа","cpu":"Intel Core i7-13700K","gpu":"RTX 4070","ram":"16GB DDR5","storage":"1TB NVMe","os":"Windows 11"}',true),

(2,'Acer Predator Orion 7000',
 'RTX 4090 + i9-12900K, 64GB DDR5, 2TB NVMe, Predator FrostBlade',
 6800000,2,'Acer',
 'https://static.acer.com/up/Resource/Acer/Desktops/Predator/Predator-Orion-7000/Images/20220103/Predator-Orion-7000-KV.png',
 '{"rating":4.9,"status":"Жаңа","cpu":"Intel Core i9-12900K","gpu":"RTX 4090","ram":"64GB DDR5","storage":"2TB NVMe","os":"Windows 11"}',true),

(2,'NZXT Player PC 3 (2024)',
 'RTX 4080 + Ryzen 9 7900X, 32GB DDR5, 2TB NVMe, NZXT H7 корпус',
 4900000,3,'NZXT',
 'https://nzxt.com/assets/cms/34299/1646854182-player-three-prime-hero.png',
 '{"rating":4.8,"status":"Жаңа","cpu":"AMD Ryzen 9 7900X","gpu":"RTX 4080","ram":"32GB DDR5","storage":"2TB NVMe","os":"Windows 11"}',true),

(2,'Corsair One i300',
 'RTX 4080 + i9-12900K, 32GB DDR5, 2TB NVMe, компактты Mini-ITX',
 5500000,2,'Corsair',
 'https://www.corsair.com/medias/sys_master/images/images/h5e/h5e/9093498527774/CC-9020197-NA-Gallery-01.png',
 '{"rating":4.9,"status":"Жаңа","cpu":"Intel Core i9-12900K","gpu":"RTX 4080","ram":"32GB DDR5","storage":"2TB NVMe","form_factor":"Mini-ITX"}',true),

(2,'CyberPowerPC Gamer Xtreme VR',
 'RTX 4060 Ti + i5-13600K, 16GB DDR4, 1TB NVMe, бюджеттік ойын ПК',
 2500000,6,'CyberPowerPC',
 'https://www.cyberpowerpc.com/images/systems/GXi10400BST/main.jpg',
 '{"rating":4.6,"status":"Жаңа","cpu":"Intel Core i5-13600K","gpu":"RTX 4060 Ti","ram":"16GB DDR4","storage":"1TB NVMe","os":"Windows 11"}',true),

(2,'iBUYPOWER Pro Gaming PC Y60',
 'RTX 4070 + Ryzen 7 7700X, 32GB DDR5, 1TB NVMe, RGB корпус',
 3500000,4,'iBUYPOWER',
 'https://www.ibuypower.com/site/images/systems/TraceMR-240i/main.jpg',
 '{"rating":4.7,"status":"Жаңа","cpu":"AMD Ryzen 7 7700X","gpu":"RTX 4070","ram":"32GB DDR5","storage":"1TB NVMe","os":"Windows 11"}',true);

-- ═══════════════════════════════════════════════════════════
-- 3. МОНИТОРЛАР  (category_id = 3)
-- ═══════════════════════════════════════════════════════════
INSERT INTO products (category_id,name,description,price,stock_quantity,brand,image_url,specifications,is_active) VALUES
(3,'LG UltraGear 27GR95QE 27" OLED',
 'OLED панель, 2560x1440, 240Hz, 0.03ms — ойын мониторының шыңы',
 950000,5,'LG',
 'https://www.lg.com/us/images/monitors/md08003762/gallery/medium01.jpg',
 '{"rating":5.0,"status":"Жаңа","size":"27 inch","resolution":"2560x1440","refresh_rate":"240Hz","panel":"OLED","response_time":"0.03ms"}',true),

(3,'Samsung Odyssey Neo G9 57"',
 'Dual UHD 7680x2160, 240Hz, Mini-LED, HDR2000 — ультра кең монитор',
 1800000,3,'Samsung',
 'https://image-us.samsung.com/SamsungUS/home/computing/monitors/gaming/06282022/LS57CG952NNXZA_001_Front_Black.jpg',
 '{"rating":5.0,"status":"Жаңа","size":"57 inch","resolution":"7680x2160","refresh_rate":"240Hz","panel":"Mini-LED VA","hdr":"HDR2000"}',true),

(3,'ASUS ROG Swift PG32UQX 32" 4K',
 '4K 144Hz Mini-LED, G-Sync Ultimate, HDR1400 — кәсіби ойын мониторы',
 1400000,4,'ASUS',
 'https://dlcdnwebimgs.asus.com/gain/E2F3A4B5-C6D7-E8F9-A0B1-C2D3E4F5A6B7/w1000/h772',
 '{"rating":4.9,"status":"Жаңа","size":"32 inch","resolution":"3840x2160","refresh_rate":"144Hz","panel":"IPS Mini-LED","hdr":"HDR1400"}',true),

(3,'Dell Alienware AW3423DWF 34" QD-OLED',
 'QD-OLED, 3440x1440, 165Hz, HDR400 — ультракең ойын мониторы',
 1100000,6,'Dell',
 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/alienware/aw3423dwf/pdp/monitor-aw3423dwf-pdp-hero-504x350-ng.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=572&qlt=100,1&resMode=sharp2&size=572,402',
 '{"rating":4.9,"status":"Жаңа","size":"34 inch","resolution":"3440x1440","refresh_rate":"165Hz","panel":"QD-OLED","hdr":"HDR400"}',true),

(3,'MSI MEG 342C QD-OLED 34"',
 'QD-OLED, 3440x1440, 175Hz, HDR600 — MSI флагман мониторы',
 1200000,4,'MSI',
 'https://asset.msi.com/resize/image/global/product/product_1_20230301180312_640a8e0c8e8e.png62405b38c58fe0646fcee6a6b7e6cb5b/1024.png',
 '{"rating":4.8,"status":"Жаңа","size":"34 inch","resolution":"3440x1440","refresh_rate":"175Hz","panel":"QD-OLED","hdr":"HDR600"}',true),

(3,'Samsung Odyssey G7 27" 240Hz',
 '2560x1440, 240Hz, VA панель, HDR600, G-Sync Compatible',
 450000,8,'Samsung',
 'https://image-us.samsung.com/SamsungUS/home/computing/monitors/gaming/06282022/LS27AG700NNXZA_001_Front_Black.jpg',
 '{"rating":4.7,"status":"Жаңа","size":"27 inch","resolution":"2560x1440","refresh_rate":"240Hz","panel":"VA","hdr":"HDR600"}',true),

(3,'LG 27GP950-B 27" 4K 160Hz',
 '4K 160Hz IPS Nano, HDMI 2.1, G-Sync Compatible, HDR600',
 750000,6,'LG',
 'https://www.lg.com/us/images/monitors/md08003762/gallery/medium02.jpg',
 '{"rating":4.8,"status":"Жаңа","size":"27 inch","resolution":"3840x2160","refresh_rate":"160Hz","panel":"IPS Nano","hdr":"HDR600"}',true),

(3,'ASUS TUF Gaming VG27AQL1A 27"',
 '2560x1440, 170Hz, IPS, G-Sync Compatible, HDR400',
 380000,9,'ASUS',
 'https://dlcdnwebimgs.asus.com/gain/F3A4B5C6-D7E8-F9A0-B1C2-D3E4F5A6B7C8/w1000/h772',
 '{"rating":4.6,"status":"Жаңа","size":"27 inch","resolution":"2560x1440","refresh_rate":"170Hz","panel":"IPS","hdr":"HDR400"}',true),

(3,'Gigabyte M27Q X 27" 240Hz',
 '2560x1440, 240Hz, IPS, KVM Switch, HDR400',
 420000,7,'Gigabyte',
 'https://static.gigabyte.com/StaticFile/Image/Global/3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f/Product/30000/png/1000',
 '{"rating":4.7,"status":"Жаңа","size":"27 inch","resolution":"2560x1440","refresh_rate":"240Hz","panel":"IPS","hdr":"HDR400"}',true),

(3,'BenQ MOBIUZ EX2710Q 27"',
 '2560x1440, 165Hz, IPS, HDRi технологиясы, Eye-Care',
 320000,10,'BenQ',
 'https://www.benq.com/content/dam/benq/products/monitor/ex2710q/gallery/ex2710q-monitor-gallery-1.jpg',
 '{"rating":4.6,"status":"Жаңа","size":"27 inch","resolution":"2560x1440","refresh_rate":"165Hz","panel":"IPS","hdr":"HDRi"}',true);

-- ═══════════════════════════════════════════════════════════
-- 4. НОУТБУКТАР  (category_id = 4)
-- ═══════════════════════════════════════════════════════════
INSERT INTO products (category_id,name,description,price,stock_quantity,brand,image_url,specifications,is_active) VALUES
(4,'ASUS ROG Zephyrus G16 2024',
 'RTX 4090 + i9-14900HX, 32GB DDR5, 2TB NVMe, OLED 240Hz — ойын ноутбугының флагманы',
 3200000,3,'ASUS',
 'https://dlcdnwebimgs.asus.com/gain/A1B2C3D4-E5F6-A7B8-C9D0-E1F2A3B4C5D6/w1000/h772',
 '{"rating":5.0,"status":"Жаңа","cpu":"Intel Core i9-14900HX","gpu":"RTX 4090","ram":"32GB DDR5","storage":"2TB NVMe","display":"16 OLED 240Hz"}',true),

(4,'Razer Blade 16 2024',
 'RTX 4090 + i9-14900HX, 32GB DDR5, 2TB NVMe, Mini-LED 240Hz',
 3500000,2,'Razer',
 'https://assets2.razerzone.com/images/pnx.assets/b5c5e5f5a5b5c5d5e5f5a5b5c5d5e5f5/razer-blade-16-2024-hero.jpg',
 '{"rating":4.9,"status":"Жаңа","cpu":"Intel Core i9-14900HX","gpu":"RTX 4090","ram":"32GB DDR5","storage":"2TB NVMe","display":"16 Mini-LED 240Hz"}',true),

(4,'Apple MacBook Pro 16 M3 Max',
 'M3 Max чипі, 48GB жедел жад, 1TB SSD, Liquid Retina XDR дисплей',
 3800000,4,'Apple',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290',
 '{"rating":5.0,"status":"Жаңа","cpu":"Apple M3 Max","gpu":"40-core GPU","ram":"48GB","storage":"1TB SSD","display":"16.2 Liquid Retina XDR"}',true),

(4,'Lenovo Legion Pro 7i Gen 8',
 'RTX 4080 + i9-13900HX, 32GB DDR5, 1TB NVMe, 240Hz IPS',
 2800000,5,'Lenovo',
 'https://p1-ofp.static.pub/fes/cms/2022/09/01/ofp/legion-pro-7i-gen8-hero.png',
 '{"rating":4.8,"status":"Жаңа","cpu":"Intel Core i9-13900HX","gpu":"RTX 4080","ram":"32GB DDR5","storage":"1TB NVMe","display":"16 IPS 240Hz"}',true),

(4,'ASUS ROG Strix SCAR 16 2024',
 'RTX 4080 + Ryzen 9 7945HX3D, 32GB DDR5, 2TB NVMe, QHD+ 240Hz',
 3100000,3,'ASUS',
 'https://dlcdnwebimgs.asus.com/gain/B2C3D4E5-F6A7-B8C9-D0E1-F2A3B4C5D6E7/w1000/h772',
 '{"rating":4.9,"status":"Жаңа","cpu":"AMD Ryzen 9 7945HX3D","gpu":"RTX 4080","ram":"32GB DDR5","storage":"2TB NVMe","display":"16 QHD+ 240Hz"}',true),

(4,'Dell Alienware m18 R2',
 'RTX 4090 + i9-14900HX, 32GB DDR5, 2TB NVMe, 18" FHD 480Hz',
 4200000,2,'Dell',
 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/alienware-notebooks/alienware-m18-r2/pdp/notebook-alienware-m18-r2-pdp-hero-504x350-ng.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=572&qlt=100,1&resMode=sharp2&size=572,402',
 '{"rating":4.8,"status":"Жаңа","cpu":"Intel Core i9-14900HX","gpu":"RTX 4090","ram":"32GB DDR5","storage":"2TB NVMe","display":"18 FHD 480Hz"}',true),

(4,'HP Omen 16 2024',
 'RTX 4070 + i7-13700HX, 16GB DDR5, 1TB NVMe, QHD 165Hz',
 2100000,6,'HP',
 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/knowledgebase/c08233894.png',
 '{"rating":4.7,"status":"Жаңа","cpu":"Intel Core i7-13700HX","gpu":"RTX 4070","ram":"16GB DDR5","storage":"1TB NVMe","display":"16.1 QHD 165Hz"}',true),

(4,'Acer Predator Helios 16 2024',
 'RTX 4070 + i7-14700HX, 16GB DDR5, 1TB NVMe, WQXGA 240Hz',
 2300000,5,'Acer',
 'https://static.acer.com/up/Resource/Acer/Laptops/Predator/Predator-Helios-16/Images/20230103/Predator-Helios-16-KV.png',
 '{"rating":4.7,"status":"Жаңа","cpu":"Intel Core i7-14700HX","gpu":"RTX 4070","ram":"16GB DDR5","storage":"1TB NVMe","display":"16 WQXGA 240Hz"}',true),

(4,'MSI Stealth 16 Mercedes-AMG',
 'RTX 4070 + i7-13700H, 32GB DDR5, 2TB NVMe, QHD+ 240Hz',
 2600000,3,'MSI',
 'https://asset.msi.com/resize/image/global/product/product_1_20230401180312_642a8e0c8e8e.png62405b38c58fe0646fcee6a6b7e6cb5b/1024.png',
 '{"rating":4.8,"status":"Жаңа","cpu":"Intel Core i7-13700H","gpu":"RTX 4070","ram":"32GB DDR5","storage":"2TB NVMe","display":"16 QHD+ 240Hz"}',true),

(4,'Lenovo ThinkPad X1 Carbon Gen 12',
 'i7-1365U, 32GB LPDDR5, 1TB NVMe, 14" 2.8K OLED — бизнес класс',
 2400000,7,'Lenovo',
 'https://p1-ofp.static.pub/fes/cms/2022/09/01/ofp/thinkpad-x1-carbon-gen12-hero.png',
 '{"rating":4.7,"status":"Жаңа","cpu":"Intel Core i7-1365U","gpu":"Intel Iris Xe","ram":"32GB LPDDR5","storage":"1TB NVMe","display":"14 OLED 2.8K"}',true);

-- ═══════════════════════════════════════════════════════════
-- 5. ПЕРНЕТАҚТА  (category_id = 5)
-- ═══════════════════════════════════════════════════════════
INSERT INTO products (category_id,name,description,price,stock_quantity,brand,image_url,specifications,is_active) VALUES
(5,'Razer Huntsman V3 Pro TKL',
 'Analog Optical switches, 8000Hz polling rate, TKL layout, Chroma RGB',
 180000,8,'Razer',
 'https://assets2.razerzone.com/images/pnx.assets/huntsman-v3-pro-tkl/razer-huntsman-v3-pro-tkl-hero.jpg',
 '{"rating":5.0,"status":"Жаңа","type":"Optical","switches":"Razer Analog Optical","layout":"TKL","backlight":"Chroma RGB","polling_rate":"8000Hz"}',true),

(5,'SteelSeries Apex Pro TKL 2023',
 'OmniPoint 2.0 Adjustable switches, 8000Hz, TKL, OLED дисплей',
 160000,9,'SteelSeries',
 'https://media.steelseriescdn.com/thumbs/catalogue/products/01889-apex-pro-tkl-2023/b5c5e5f5a5b5c5d5e5f5a5b5c5d5e5f5/apex-pro-tkl-2023-hero.jpg.1920x1080_q100.jpg',
 '{"rating":4.9,"status":"Жаңа","type":"Mechanical","switches":"OmniPoint 2.0","layout":"TKL","backlight":"RGB","polling_rate":"8000Hz"}',true),

(5,'Logitech G915 TKL Wireless',
 'GL Tactile switches, LIGHTSPEED сымсыз, жұқа профиль, RGB',
 150000,10,'Logitech',
 'https://resource.logitech.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/keyboards/g915-tkl/gallery/g915-tkl-keyboard-top-view-graphite.png',
 '{"rating":4.8,"status":"Жаңа","type":"Mechanical","switches":"GL Tactile","layout":"TKL","backlight":"RGB","connection":"LIGHTSPEED Wireless"}',true),

(5,'Corsair K100 RGB Optical-Mechanical',
 'OPX Optical-Mechanical switches, iCUE, алюминий корпус, Full layout',
 140000,8,'Corsair',
 'https://www.corsair.com/medias/sys_master/images/images/h5e/h5e/9093498527775/CH-912A01A-NA-Gallery-01.png',
 '{"rating":4.7,"status":"Жаңа","type":"Optical-Mechanical","switches":"Corsair OPX","layout":"Full","backlight":"RGB","material":"Aluminum"}',true),

(5,'ASUS ROG Strix Scope II 96 Wireless',
 '96% layout, ROG NX Snow switches, сымсыз 2.4GHz/BT/USB',
 130000,9,'ASUS',
 'https://dlcdnwebimgs.asus.com/gain/C3D4E5F6-A7B8-C9D0-E1F2-A3B4C5D6E7F8/w1000/h772',
 '{"rating":4.7,"status":"Жаңа","type":"Mechanical","switches":"ROG NX Snow","layout":"96%","backlight":"RGB","connection":"Wireless 2.4GHz/BT/USB"}',true),

(5,'Keychron Q1 Pro QMK Wireless',
 'Gasket mount, Gateron G Pro Red, алюминий, QMK/VIA, сымсыз',
 120000,7,'Keychron',
 'https://cdn.shopify.com/s/files/1/0059/0630/1017/products/Keychron-Q1-Pro-QMK-VIA-wireless-custom-mechanical-keyboard-1.jpg',
 '{"rating":4.9,"status":"Жаңа","type":"Mechanical","switches":"Gateron G Pro Red","layout":"75%","backlight":"RGB","mount":"Gasket","connection":"Wireless/USB"}',true),

(5,'Ducky One 3 SF 65% Hot-swap',
 'Cherry MX Red, Hot-swap, RGB, PBT keycaps, компактты 65%',
 110000,10,'Ducky',
 'https://www.duckychannel.com.tw/upload/product/2021/11/One3-SF-DayBreak-RGB-Cherry-MX-Red-1.jpg',
 '{"rating":4.8,"status":"Жаңа","type":"Mechanical","switches":"Cherry MX Red","layout":"65%","backlight":"RGB","hotswap":true}',true),

(5,'HyperX Alloy Origins 65',
 'HyperX Red Linear, алюминий корпус, RGB, компактты 65%',
 90000,12,'HyperX',
 'https://media.kingston.com/hyperx/product/hx-kb7rdx-us-1-zm-lg.jpg',
 '{"rating":4.6,"status":"Жаңа","type":"Mechanical","switches":"HyperX Red","layout":"65%","backlight":"RGB","material":"Aluminum"}',true),

(5,'Razer BlackWidow V4 Pro Wireless',
 'Razer Yellow Linear, LIGHTSPEED сымсыз, Chroma RGB, Full layout',
 145000,7,'Razer',
 'https://assets2.razerzone.com/images/pnx.assets/blackwidow-v4-pro/razer-blackwidow-v4-pro-hero.jpg',
 '{"rating":4.7,"status":"Жаңа","type":"Mechanical","switches":"Razer Yellow","layout":"Full","backlight":"Chroma RGB","connection":"HyperSpeed Wireless"}',true),

(5,'Logitech MX Keys S',
 'Тыныш mecha-dome, сымсыз Bluetooth/USB, кәсіби пернетақта',
 100000,11,'Logitech',
 'https://resource.logitech.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/keyboards/mx-keys-s/gallery/mx-keys-s-keyboard-top-view-graphite.png',
 '{"rating":4.7,"status":"Жаңа","type":"Membrane","layout":"Full","backlight":"White LED","connection":"Bluetooth/USB"}',true);

-- ═══════════════════════════════════════════════════════════
-- 6. ТЫШҚАН  (category_id = 6)
-- ═══════════════════════════════════════════════════════════
INSERT INTO products (category_id,name,description,price,stock_quantity,brand,image_url,specifications,is_active) VALUES
(6,'Logitech G Pro X Superlight 2',
 '63г, HERO 2 25K сенсор, LIGHTSPEED сымсыз, 2000Hz polling',
 120000,8,'Logitech',
 'https://resource.logitech.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/g-pro-x-superlight-2/gallery/g-pro-x-superlight-2-top-view-white.png',
 '{"rating":5.0,"status":"Жаңа","sensor":"HERO 2 25K","dpi":"100-25600","weight":"63g","connection":"LIGHTSPEED Wireless","polling_rate":"2000Hz"}',true),

(6,'Razer DeathAdder V3 HyperSpeed',
 '90г, Focus Pro 30K сенсор, HyperSpeed сымсыз, эргономикалық',
 110000,9,'Razer',
 'https://assets2.razerzone.com/images/pnx.assets/deathadder-v3-hyperspeed/razer-deathadder-v3-hyperspeed-hero.jpg',
 '{"rating":4.8,"status":"Жаңа","sensor":"Focus Pro 30K","dpi":"100-30000","weight":"90g","connection":"HyperSpeed Wireless","polling_rate":"1000Hz"}',true),

(6,'Pulsar X2V2 Premium Wireless',
 '52г, PAW3395 сенсор, 8000Hz polling, ультра жеңіл',
 130000,7,'Pulsar',
 'https://www.pulsar.gg/cdn/shop/products/X2V2-White-1.jpg',
 '{"rating":4.9,"status":"Жаңа","sensor":"PAW3395","dpi":"50-26000","weight":"52g","connection":"Wireless","polling_rate":"8000Hz"}',true),

(6,'ASUS ROG Harpe Ace Aim Lab',
 '54г, ROG AimPoint 36K сенсор, 8000Hz, сымсыз',
 125000,8,'ASUS',
 'https://dlcdnwebimgs.asus.com/gain/D4E5F6A7-B8C9-D0E1-F2A3-B4C5D6E7F8A9/w1000/h772',
 '{"rating":4.8,"status":"Жаңа","sensor":"ROG AimPoint 36K","dpi":"100-36000","weight":"54g","connection":"Wireless","polling_rate":"8000Hz"}',true),

(6,'SteelSeries Aerox 5 Wireless',
 '74г, TrueMove Air+ сенсор, 9 батырма, сымсыз',
 105000,9,'SteelSeries',
 'https://media.steelseriescdn.com/thumbs/catalogue/products/01848-aerox-5-wireless/b5c5e5f5a5b5c5d5e5f5a5b5c5d5e5f5/aerox-5-wireless-hero.jpg.1920x1080_q100.jpg',
 '{"rating":4.6,"status":"Жаңа","sensor":"TrueMove Air+","dpi":"100-18000","weight":"74g","connection":"Wireless","buttons":"9"}',true),

(6,'Logitech G502 X Plus Wireless',
 '89г, HERO 25K, LIGHTFORCE switches, LIGHTSPEED сымсыз',
 115000,8,'Logitech',
 'https://resource.logitech.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/g502-x-plus/gallery/g502-x-plus-top-view-black.png',
 '{"rating":4.7,"status":"Жаңа","sensor":"HERO 25K","dpi":"100-25600","weight":"89g","connection":"LIGHTSPEED Wireless","buttons":"13"}',true),

(6,'Razer Basilisk V3 Pro Wireless',
 '112г, Focus Pro 30K, Smart Reel scroll, HyperSpeed сымсыз',
 120000,7,'Razer',
 'https://assets2.razerzone.com/images/pnx.assets/basilisk-v3-pro/razer-basilisk-v3-pro-hero.jpg',
 '{"rating":4.7,"status":"Жаңа","sensor":"Focus Pro 30K","dpi":"100-30000","weight":"112g","connection":"HyperSpeed Wireless","scroll":"Smart Reel"}',true),

(6,'Logitech MX Master 3S',
 '141г, Darkfield 8K, MagSpeed scroll, Bluetooth/USB — кәсіби',
 95000,10,'Logitech',
 'https://resource.logitech.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-top-view-graphite.png',
 '{"rating":4.8,"status":"Жаңа","sensor":"Darkfield 8K","dpi":"200-8000","weight":"141g","connection":"Bluetooth/USB","scroll":"MagSpeed"}',true),

(6,'Glorious Model O 2 Wireless',
 '59г, BAMF 2.0 26K сенсор, сымсыз, honeycomb дизайн',
 100000,9,'Glorious',
 'https://cdn.shopify.com/s/files/1/0549/2681/files/model-o-2-wireless-white-hero.jpg',
 '{"rating":4.7,"status":"Жаңа","sensor":"BAMF 2.0 26K","dpi":"100-26000","weight":"59g","connection":"Wireless","polling_rate":"1000Hz"}',true),

(6,'HyperX Pulsefire Haste 2 Wireless',
 '61г, Precision 26K сенсор, 2000Hz polling, сымсыз',
 85000,11,'HyperX',
 'https://media.kingston.com/hyperx/product/hx-mc006b-zm-lg.jpg',
 '{"rating":4.5,"status":"Жаңа","sensor":"Precision 26K","dpi":"100-26000","weight":"61g","connection":"Wireless","polling_rate":"2000Hz"}',true);

-- ═══════════════════════════════════════════════════════════
-- 7. PLAYSTATION  (category_id = 7)
-- ═══════════════════════════════════════════════════════════
INSERT INTO products (category_id,name,description,price,stock_quantity,brand,image_url,specifications,is_active) VALUES
(7,'PlayStation 5 Slim Disc Edition',
 'PS5 Slim, 1TB SSD, 4K 120fps, Ray Tracing, DualSense контроллер кіреді',
 350000,8,'Sony',
 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-slim-product-thumbnail-01-en-14sep23?$facebook$',
 '{"rating":5.0,"status":"Жаңа","storage":"1TB SSD","resolution":"4K 120fps","ray_tracing":true,"backward_compatible":true}',true),

(7,'PlayStation 5 Digital Edition Slim',
 'PS5 Slim дискісіз нұсқа, 1TB SSD, 4K 120fps, жеңіл дизайн',
 300000,10,'Sony',
 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-slim-digital-product-thumbnail-01-en-14sep23?$facebook$',
 '{"rating":4.9,"status":"Жаңа","storage":"1TB SSD","resolution":"4K 120fps","ray_tracing":true,"disc_drive":false}',true),

(7,'DualSense Edge Wireless Controller',
 'Pro деңгейлі PS5 контроллері, ауыстырылатын батырмалар, back buttons',
 110000,12,'Sony',
 'https://gmedia.playstation.com/is/image/SIEPDC/dualsense-edge-product-thumbnail-01-en-14sep23?$facebook$',
 '{"rating":4.8,"status":"Жаңа","compatibility":"PS5","haptic_feedback":true,"adaptive_triggers":true,"back_buttons":true}',true),

(7,'DualSense Wireless Controller Midnight Black',
 'Стандартты PS5 контроллері, Midnight Black түсі, Haptic Feedback',
 55000,20,'Sony',
 'https://gmedia.playstation.com/is/image/SIEPDC/dualsense-midnight-black-product-thumbnail-01-en-14sep23?$facebook$',
 '{"rating":4.8,"status":"Жаңа","compatibility":"PS5","haptic_feedback":true,"adaptive_triggers":true,"color":"Midnight Black"}',true),

(7,'PlayStation VR2',
 'PS5 VR гарнитурасы, 4K OLED, 110° FOV, Eye Tracking, Sense контроллерлер',
 280000,5,'Sony',
 'https://gmedia.playstation.com/is/image/SIEPDC/psvr2-product-thumbnail-01-en-14sep23?$facebook$',
 '{"rating":4.7,"status":"Жаңа","display":"4K OLED","fov":"110 degrees","refresh_rate":"90/120Hz","eye_tracking":true}',true),

(7,'PS5 Pulse 3D Wireless Headset',
 'PS5 арналған сымсыз гарнитура, 3D Audio, 12 сағат батарея',
 75000,15,'Sony',
 'https://gmedia.playstation.com/is/image/SIEPDC/pulse-3d-wireless-headset-product-thumbnail-01-en-14sep23?$facebook$',
 '{"rating":4.6,"status":"Жаңа","compatibility":"PS5/PS4","connection":"Wireless","3d_audio":true,"battery":"12 hours"}',true),

(7,'WD_BLACK SN850X 2TB NVMe PS5',
 'PS5 ішкі NVMe SSD кеңейтімі, 2TB, 7300MB/s оқу жылдамдығы',
 160000,10,'WD',
 'https://shop.westerndigital.com/content/dam/store/en-us/assets/products/internal-storage/wd-black-sn850x-nvme-ssd/gallery/wd-black-sn850x-nvme-ssd-2tb-gallery-1.png.thumb.1280.1280.png',
 '{"rating":4.8,"status":"Жаңа","compatibility":"PS5","capacity":"2TB","type":"NVMe SSD","read_speed":"7300MB/s"}',true),

(7,'Spider-Man 2 PS5',
 'Marvel Spider-Man 2 — PS5 эксклюзиві, 4K 60fps, DualSense интеграциясы',
 35000,25,'Sony',
 'https://gmedia.playstation.com/is/image/SIEPDC/spider-man-2-game-thumbnail-01-en-14sep23?$facebook$',
 '{"rating":4.9,"status":"Жаңа","compatibility":"PS5","genre":"Action-Adventure","players":"1","rating_age":"16+"}',true),

(7,'God of War Ragnarok PS5',
 'God of War Ragnarok — PS5 нұсқасы, 4K 60fps, Norse mythology',
 32000,20,'Sony',
 'https://gmedia.playstation.com/is/image/SIEPDC/god-of-war-ragnarok-game-thumbnail-01-en-14sep23?$facebook$',
 '{"rating":5.0,"status":"Жаңа","compatibility":"PS5/PS4","genre":"Action-Adventure","players":"1","rating_age":"18+"}',true),

(7,'PS5 DualSense Charging Station',
 '2 DualSense контроллерін бір мезгілде зарядтайды, 3 сағатта толық зарядталады',
 28000,18,'Sony',
 'https://gmedia.playstation.com/is/image/SIEPDC/dualsense-charging-station-product-thumbnail-01-en-14sep23?$facebook$',
 '{"rating":4.6,"status":"Жаңа","compatibility":"PS5","slots":"2","charging_time":"3 hours"}',true);

-- ═══════════════════════════════════════════════════════════
-- 8. ОЙЫН ОРЫНДЫҚТАРЫ  (category_id = 8)
-- ═══════════════════════════════════════════════════════════
INSERT INTO products (category_id,name,description,price,stock_quantity,brand,image_url,specifications,is_active) VALUES
(8,'Secretlab TITAN Evo 2024 XL',
 'NEO Hybrid Leatherette, 4-way L-ADAPT lumbar, 4D armrest, 165° recline',
 380000,5,'Secretlab',
 'https://secretlab.co/cdn/shop/files/TITAN-Evo-2024-SoftWeave-Plus-Charcoal-Blue-1.jpg',
 '{"rating":5.0,"status":"Жаңа","material":"NEO Hybrid Leatherette","lumbar":"4-way L-ADAPT","armrest":"4D","recline":"165 degrees","size":"XL"}',true),

(8,'Secretlab TITAN Evo 2024 Regular',
 'Secretlab флагманы орташа өлшем, SoftWeave Plus тканьы, 4D armrest',
 350000,7,'Secretlab',
 'https://secretlab.co/cdn/shop/files/TITAN-Evo-2024-SoftWeave-Plus-Charcoal-Blue-2.jpg',
 '{"rating":4.9,"status":"Жаңа","material":"SoftWeave Plus","lumbar":"4-way L-ADAPT","armrest":"4D","recline":"165 degrees","size":"Regular"}',true),

(8,'Razer Iskur V2 Gaming Chair',
 'Synthetic Leather, Built-in lumbar support, 4D armrest, 152° recline',
 320000,6,'Razer',
 'https://assets2.razerzone.com/images/pnx.assets/iskur-v2/razer-iskur-v2-hero.jpg',
 '{"rating":4.8,"status":"Жаңа","material":"Synthetic Leather","lumbar":"Built-in","armrest":"4D","recline":"152 degrees"}',true),

(8,'Noblechairs HERO TX Gaming Chair',
 'Тканьды жабын, Adjustable lumbar, 4D armrest, 135° recline, 150кг',
 300000,8,'Noblechairs',
 'https://www.noblechairs.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/h/e/hero-tx-gaming-chair-black-1.jpg',
 '{"rating":4.8,"status":"Жаңа","material":"Fabric","lumbar":"Adjustable","armrest":"4D","recline":"135 degrees","max_weight":"150kg"}',true),

(8,'AndaSeat Kaiser 4 XL',
 'Linen Fabric, Magnetic lumbar, 4D armrest, 160° recline, XL өлшем',
 280000,9,'AndaSeat',
 'https://www.andaseat.com/cdn/shop/products/kaiser-4-xl-gaming-chair-1.jpg',
 '{"rating":4.7,"status":"Жаңа","material":"Linen Fabric","lumbar":"Magnetic","armrest":"4D","recline":"160 degrees","size":"XL"}',true),

(8,'Corsair TC100 Relaxed Fabric',
 'Тыныш тканьды жабын, 3D armrest, 180° recline, 120кг',
 200000,10,'Corsair',
 'https://www.corsair.com/medias/sys_master/images/images/h5e/h5e/9093498527776/CF-9010052-WW-Gallery-01.png',
 '{"rating":4.6,"status":"Жаңа","material":"Fabric","lumbar":"Pillow","armrest":"3D","recline":"180 degrees","max_weight":"120kg"}',true),

(8,'DXRacer Formula Series F08',
 'PU Leather, классикалық ойын орындығы, 3D armrest, 135° recline',
 180000,11,'DXRacer',
 'https://www.dxracer.com/cdn/shop/products/formula-series-f08-gaming-chair-1.jpg',
 '{"rating":4.5,"status":"Жаңа","material":"PU Leather","lumbar":"Pillow","armrest":"3D","recline":"135 degrees","max_weight":"100kg"}',true),

(8,'Autonomous ErgoChair Pro',
 'Mesh тор материал, Adjustable lumbar, 4D armrest, 135° recline, эргономикалық',
 350000,6,'Autonomous',
 'https://cdn.autonomous.ai/static/upload/images/product/ergochair-pro-black-1.jpg',
 '{"rating":4.6,"status":"Жаңа","material":"Mesh","lumbar":"Adjustable","armrest":"4D","recline":"135 degrees","headrest":"Adjustable"}',true),

(8,'Vertagear SL5000 Gaming Chair',
 'PU Leather, жоғары арқалы, 4D armrest, 140° recline, 130кг',
 240000,8,'Vertagear',
 'https://www.vertagear.com/cdn/shop/products/sl5000-gaming-chair-1.jpg',
 '{"rating":4.5,"status":"Жаңа","material":"PU Leather","lumbar":"Adjustable","armrest":"4D","recline":"140 degrees","max_weight":"130kg"}',true),

(8,'GT Racing GT099 Gaming Chair',
 'PU Leather, орташа деңгейлі ойын орындығы, 170° recline, 150кг',
 160000,12,'GT Racing',
 'https://www.gtracing.com/cdn/shop/products/gt099-gaming-chair-1.jpg',
 '{"rating":4.4,"status":"Жаңа","material":"PU Leather","lumbar":"Pillow","armrest":"3D","recline":"170 degrees","max_weight":"150kg"}',true);

-- ═══════════════════════════════════════════════════════════
SELECT COUNT(*) as total_products FROM products;
SELECT c.name as category, COUNT(p.id) as count
FROM categories c LEFT JOIN products p ON p.category_id = c.id
GROUP BY c.id, c.name ORDER BY c.id;
