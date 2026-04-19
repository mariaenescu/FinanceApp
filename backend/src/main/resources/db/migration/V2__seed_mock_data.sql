INSERT INTO cards (id, card_number, cvv_number, pin_code, expiration_date)
VALUES ('c1c1c1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c', '4532 7812 9012 3456', '123', '1234', '2028-12-31 23:59:59');

INSERT INTO accounts (id, iban, balance, category, card_id, low_balance_alert_enabled, low_balance_threshold)
VALUES ('a1a1a1a1-1a1a-1a1a-1a1a-1a1a1a1a1a1a', 'RO99FINC000012345678', 1250.00, 'USER', 'c1c1c1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c', TRUE, 150.00);

INSERT INTO users (id, full_name, email, password, role, account_id)
VALUES ('u1u1u1u1-1u1u-1u1u-1u1u-1u1u1u1u1u1u', 'Maria Enescu', 'maria@finance.com', '{bcrypt}$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'USER', 'a1a1a1a1-1a1a-1a1a-1a1a-1a1a1a1a1a1a');

INSERT INTO accounts (id, iban, balance, category)
VALUES ('f1f1f1f1-1f1f-1f1f-1f1f-1f1f1f1f1f1f', 'RO99FINC111100001111', 1000000.00, 'BILLS');
INSERT INTO users (id, full_name, email, password, role, account_id)
VALUES ('uf1f1f1f-1f1f-1f1f-1f1f-1f1f1f1f1f1f', 'Digi Communications', 'contact@digi.ro', 'no-pass', 'USER', 'f1f1f1f1-1f1f-1f1f-1f1f-1f1f1f1f1f1f');

INSERT INTO accounts (id, iban, balance, category)
VALUES ('f2f2f2f2-2f2f-2f2f-2f2f-2f2f2f2f2f2f', 'RO99FINC222200002222', 1000000.00, 'FOOD');
INSERT INTO users (id, full_name, email, password, role, account_id)
VALUES ('uf2f2f2f-2f2f-2f2f-2f2f-2f2f2f2f2f2f', 'Glovo Delivery', 'support@glovoapp.com', 'no-pass', 'USER', 'f2f2f2f2-2f2f-2f2f-2f2f-2f2f2f2f2f2f');

INSERT INTO accounts (id, iban, balance, category)
VALUES ('f3f3f3f3-3f3f-3f3f-3f3f-3f3f3f3f3f3f', 'RO99FINC333300003333', 1000000.00, 'ENTERTAINMENT');
INSERT INTO users (id, full_name, email, password, role, account_id)
VALUES ('uf3f3f3f-3f3f-3f3f-3f3f-3f3f3f3f3f3f', 'Netflix Romania', 'billing@netflix.com', 'no-pass', 'USER', 'f3f3f3f3-3f3f-3f3f-3f3f-3f3f3f3f3f3f');

INSERT INTO accounts (id, iban, balance, category)
VALUES ('f4f4f4f4-4f4f-4f4f-4f4f-4f4f4f4f4f4f', 'RO99FINC444400004444', 1000000.00, 'SHOPPING');
INSERT INTO users (id, full_name, email, password, role, account_id)
VALUES ('uf4f4f4f-4f4f-4f4f-4f4f-4f4f4f4f4f4f', 'Zara Fashion', 'info@zara.com', 'no-pass', 'USER', 'f4f4f4f4-4f4f-4f4f-4f4f-4f4f4f4f4f4f');

INSERT INTO accounts (id, iban, balance, category)
VALUES ('f5f5f5f5-5f5f-5f5f-5f5f-5f5f5f5f5f5f', 'RO99FINC555500005555', 1000000.00, 'TRANSPORTATION');
INSERT INTO users (id, full_name, email, password, role, account_id)
VALUES ('uf5f5f5f-5f5f-5f5f-5f5f-5f5f5f5f5f5f', 'Uber B.V.', 'tax@uber.com', 'no-pass', 'USER', 'f5f5f5f5-5f5f-5f5f-5f5f-5f5f5f5f5f5f');


INSERT INTO incomes (id, description, amount, date, iban_sender, iban_receiver)
VALUES (gen_random_uuid(), 'Monthly Salary', 3500.00, CURRENT_TIMESTAMP - INTERVAL '5 days', 'RO00BANK000000000000', 'RO99FINC000012345678');

INSERT INTO expenses (id, description, amount, date, iban_receiver, iban_sender, category)
VALUES (gen_random_uuid(), 'Internet & TV Subscription', 150.00, CURRENT_TIMESTAMP - INTERVAL '4 days', 'RO99FINC111100001111', 'RO99FINC000012345678', 'BILLS');

INSERT INTO expenses (id, description, amount, date, iban_receiver, iban_sender, category)
VALUES (gen_random_uuid(), 'Dinner Order', 85.50, CURRENT_TIMESTAMP - INTERVAL '3 days', 'RO99FINC222200002222', 'RO99FINC000012345678', 'FOOD');

INSERT INTO expenses (id, description, amount, date, iban_receiver, iban_sender, category)
VALUES (gen_random_uuid(), 'Monthly Netflix Subscription', 45.00, CURRENT_TIMESTAMP - INTERVAL '2 days', 'RO99FINC333300003333', 'RO99FINC000012345678', 'ENTERTAINMENT');

INSERT INTO expenses (id, description, amount, date, iban_receiver, iban_sender, category)
VALUES (gen_random_uuid(), 'New Summer Shirt', 120.00, CURRENT_TIMESTAMP - INTERVAL '1 days', 'RO99FINC444400004444', 'RO99FINC000012345678', 'SHOPPING');

INSERT INTO expenses (id, description, amount, date, iban_receiver, iban_sender, category)
VALUES (gen_random_uuid(), 'Ride to Airport', 65.00, CURRENT_TIMESTAMP - INTERVAL '10 hours', 'RO99FINC555500005555', 'RO99FINC000012345678', 'TRANSPORTATION');
