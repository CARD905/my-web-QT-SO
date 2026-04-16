CREATE TABLE IF NOT EXISTS item_master (
    item_no BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    item_code      VARCHAR(50),
    item_name      VARCHAR(255),
    description    VARCHAR(1000),
    unit_cost      DECIMAL(10,2)  DEFAULT 0,
    unit_price     DECIMAL(10,2)  DEFAULT 0,
    uom            VARCHAR(20),
    status         VARCHAR(20)
);

INSERT INTO item_master (item_code, item_name, description, unit_cost, unit_price, uom, status) VALUES
('RM-001', 'เหล็กแผ่นรีดร้อน', 'วัตถุดิบเหล็กสำหรับงานโครงสร้าง', 25.50, 35.00, 'KG', 'ACTIVE'),
('RM-002', 'อลูมิเนียมแท่ง', 'ใช้สำหรับงานขึ้นรูป', 80.00, 110.00, 'KG', 'ACTIVE'),
('RM-003', 'พลาสติก ABS', 'เม็ดพลาสติกสำหรับฉีดขึ้นรูป', 60.00, 85.00, 'KG', 'ACTIVE'),
('FG-001', 'โต๊ะเหล็กสำเร็จรูป', 'สินค้าสำเร็จรูปพร้อมขาย', 1500.00, 2200.00, 'EA', 'ACTIVE'),
('FG-002', 'เก้าอี้สำนักงาน', 'เก้าอี้ ergonomic สำหรับสำนักงาน', 900.00, 1500.00, 'EA', 'ACTIVE'),
('WIP-001', 'โครงโต๊ะ (ระหว่างผลิต)', 'ชิ้นงานระหว่างกระบวนการผลิต', 800.00, 0.00, 'EA', 'ACTIVE'),
('SV-001', 'ค่าบริการติดตั้ง', 'บริการติดตั้งหน้างาน', 0.00, 500.00, 'JOB', 'ACTIVE'),
('RM-004', 'สกรู M8', 'อุปกรณ์ยึดประกอบ', 0.50, 1.20, 'PCS', 'ACTIVE'),
('RM-005', 'สีพ่นกันสนิม', 'ใช้สำหรับเคลือบผิวโลหะ', 120.00, 180.00, 'LTR', 'ACTIVE'),
('FG-003', 'ตู้เหล็กเก็บเอกสาร', 'ตู้เหล็ก 4 ลิ้นชัก', 2500.00, 3500.00, 'EA', 'INACTIVE');
