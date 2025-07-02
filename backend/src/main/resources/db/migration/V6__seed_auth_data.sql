-- ##################################################################
-- #  MIGRATION 5: SEED PER IL MODULO AUTH
-- ##################################################################


-- ### 24. Inserimento Azienda di default ###
INSERT INTO companies (id, name) VALUES (1, 'Default Company');
ALTER SEQUENCE companies_id_seq RESTART WITH 2;

-- ### 25. Inserimento Ruoli Iniziali ###
INSERT INTO roles (name, description) VALUES
('ROLE_SUPER_ADMIN', 'Amministratore della piattaforma'),
('ROLE_ADMIN', 'Amministratore di una singola azienda'),
('ROLE_MANAGER', 'Manager di dipartimento'),
('ROLE_TECNICO', 'Tecnico del supporto'),
('ROLE_USER', 'Utente finale');

-- ### 26. Trigger per assegnare automaticamente ogni nuovo permesso a ROLE_SUPER_ADMIN ###
CREATE OR REPLACE FUNCTION fn_auto_grant_super_admin_permission()
RETURNS TRIGGER AS $$
DECLARE
    v_super_admin_role_id BIGINT;
BEGIN
    SELECT id INTO v_super_admin_role_id FROM roles WHERE name = 'ROLE_SUPER_ADMIN';

    IF FOUND THEN
        INSERT INTO role_permissions (role_id, permission_id)
        VALUES (v_super_admin_role_id, NEW.id)
        ON CONFLICT (role_id, permission_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attivazione del trigger
CREATE TRIGGER trg_auto_grant_super_admin_permission
AFTER INSERT ON permissions
FOR EACH ROW
EXECUTE FUNCTION fn_auto_grant_super_admin_permission();


-- ### 27. Inserimento Permessi Iniziali (Il trigger li assegnerà a ROLE_ADMIN) ###
INSERT INTO permissions (name, description) VALUES
-- Permessi di gestione piattaforma (per Super Admin)
('COMPANY_CREATE', 'Permesso di creare nuove aziende'),
('COMPANY_MANAGE', 'Permesso di gestire le sottoscrizioni delle aziende'),
-- Permessi di gestione azienda (per Admin di azienda)
('USER_CREATE', 'Permesso di invitare e creare nuovi utenti nella propria azienda'),
('USER_READ', 'Permesso di leggere le informazioni degli utenti della propria azienda'),
('USER_UPDATE', 'Permesso di modificare e disabilitare utenti della propria azienda'),
('USER_ROLE_ASSIGN', 'Permesso di assegnare ruoli agli utenti della propria azienda'),
('ROLE_READ', 'Permesso di vedere i ruoli e i loro permessi'),
('ROLE_WRITE', 'Permesso di creare e modificare ruoli'),
('DEPARTMENT_READ', 'Permesso di vedere i dipartimenti della propria azienda'),
('DEPARTMENT_WRITE', 'Permesso di creare e modificare i dipartimenti della propria azienda'),
-- Permessi per i ticket
('TICKET_CREATE', 'Permesso di creare nuovi ticket'),
('TICKET_READ_ALL', 'Permesso di vedere QUALSIASI ticket della propria azienda'),
('TICKET_UPDATE_ALL', 'Permesso di modificare QUALSIASI ticket della propria azienda'),
('TICKET_ASSIGN', 'Permesso di assegnare o riassegnare un ticket'),
('TICKET_STATUS_CHANGE', 'Permesso di modificare lo stato di un ticket'),
('TICKET_PRIORITY_CHANGE', 'Permesso di modificare la priorità di un ticket'),
('TICKET_DELETE', 'Permesso di eliminare (soft delete) un ticket'),
('TICKET_COMMENT_ALL', 'Permesso di aggiungere commenti a QUALSIASI ticket');


-- ### 28. Associazione manuale Permessi ai Ruoli (escluso SUPER_ADMIN) ###
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_ADMIN' AND p.name NOT IN ('COMPANY_CREATE', 'COMPANY_MANAGE');

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'ROLE_MANAGER' AND p.name IN (
    'DEPARTMENT_READ',
    'DEPARTMENT_WRITE',
    'USER_READ'
);

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'ROLE_TECNICO' AND p.name IN (
    'TICKET_READ_ALL',
    'TICKET_ASSIGN',
    'TICKET_STATUS_CHANGE',
    'TICKET_PRIORITY_CHANGE',
    'TICKET_COMMENT_ALL'
);

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'ROLE_USER' AND p.name IN (
    'TICKET_CREATE'
);


-- ### 29. Inserimento Profili Utente e Credenziali Iniziali (locali) ###
-- La password per tutti è "password" (hash BCrypt)
-- Super Admin
WITH sa_profile AS (
    INSERT INTO user_profiles (company_id, email, display_name) VALUES (1, 'superadmin@platform.com', 'Super Admin') RETURNING id
)
INSERT INTO user_credentials (user_profile_id, provider, password)
SELECT id, 'LOCAL', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqR2e5RzTTNcePI6JubTBmubSnP6' FROM sa_profile;

-- Admin di Azienda
WITH admin_profile AS (
    INSERT INTO user_profiles (company_id, email, display_name) VALUES (1, 'admin@company1.com', 'Admin User') RETURNING id
)
INSERT INTO user_credentials (user_profile_id, provider, password)
SELECT id, 'LOCAL', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqR2e5RzTTNcePI6JubTBmubSnP6' FROM admin_profile;

-- Manager
WITH manager_profile AS (
    INSERT INTO user_profiles (company_id, email, display_name) VALUES (1, 'manager@company1.com', 'Manager User') RETURNING id
)
INSERT INTO user_credentials (user_profile_id, provider, password)
SELECT id, 'LOCAL', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqR2e5RzTTNcePI6JubTBmubSnP6' FROM manager_profile;

-- Tecnico
WITH tecnico_profile AS (
    INSERT INTO user_profiles (company_id, email, display_name) VALUES (1, 'tecnico@company1.com', 'Tecnico User') RETURNING id
)
INSERT INTO user_credentials (user_profile_id, provider, password)
SELECT id, 'LOCAL', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqR2e5RzTTNcePI6JubTBmubSnP6' FROM tecnico_profile;

-- Utente
WITH user_profile AS (
    INSERT INTO user_profiles (company_id, email, display_name) VALUES (1, 'user@company1.com', 'Standard User') RETURNING id
)
INSERT INTO user_credentials (user_profile_id, provider, password)
SELECT id, 'LOCAL', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqR2e5RzTTNcePI6JubTBmubSnP6' FROM user_profile;


-- ### 30. Associazione Ruoli ai Profili Utente Iniziali ###
INSERT INTO user_profile_roles (user_profile_id, role_id)
SELECT u.id, r.id FROM user_profiles u, roles r WHERE u.email = 'superadmin@platform.com' AND r.name = 'ROLE_SUPER_ADMIN';

INSERT INTO user_profile_roles (user_profile_id, role_id)
SELECT u.id, r.id FROM user_profiles u, roles r WHERE u.email = 'admin@company1.com' AND r.name = 'ROLE_ADMIN';

INSERT INTO user_profile_roles (user_profile_id, role_id)
SELECT u.id, r.id FROM user_profiles u, roles r WHERE u.email = 'manager@company1.com' AND r.name = 'ROLE_MANAGER';

INSERT INTO user_profile_roles (user_profile_id, role_id)
SELECT u.id, r.id FROM user_profiles u, roles r WHERE u.email = 'tecnico@company1.com' AND r.name = 'ROLE_TECNICO';

INSERT INTO user_profile_roles (user_profile_id, role_id)
SELECT u.id, r.id FROM user_profiles u, roles r WHERE u.email = 'user@company1.com' AND r.name = 'ROLE_USER';