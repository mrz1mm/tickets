-- ##################################################################
-- #  MIGRATION 4: SEED PER IL MODULO AUTH
-- ##################################################################

-- ### 8. Inserimento Ruoli Iniziali ###
INSERT INTO roles (name, description) VALUES
('ROLE_ADMIN', 'Amministratore Globale - Accesso completo a tutte le funzionalità'),
('ROLE_TECNICO', 'Tecnico del supporto, può gestire i ticket'),
('ROLE_USER', 'Utente Standard - Può utilizzare le funzionalità base del sito');

-- ### 9. Trigger per assegnare automaticamente ogni nuovo permesso al ruolo ROLE_ADMIN ###
-- 9.1 Funzione per il Trigger
CREATE OR REPLACE FUNCTION fn_auto_grant_admin_permission()
RETURNS TRIGGER AS $$
DECLARE
    v_admin_role_id BIGINT;
BEGIN
    SELECT id INTO v_admin_role_id FROM roles WHERE name = 'ROLE_ADMIN';

    IF FOUND THEN
        INSERT INTO role_permissions (role_id, permission_id)
        VALUES (v_admin_role_id, NEW.id)
        ON CONFLICT (role_id, permission_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9.2. Creazione del Trigger
CREATE TRIGGER trg_auto_grant_admin_permission
AFTER INSERT ON permissions
FOR EACH ROW
EXECUTE FUNCTION fn_auto_grant_admin_permission();


-- ### 10. Inserimento Permessi Iniziali (Il trigger li assegnerà a ROLE_ADMIN) ###
INSERT INTO permissions (name, description) VALUES
('USER_READ', 'Permesso di leggere le informazioni degli altri utenti'),
('USER_WRITE', 'Permesso di creare, modificare e disabilitare utenti'),
('USER_ROLE_ASSIGN', 'Permesso di assegnare e revocare ruoli agli utenti'),
('ROLE_READ', 'Permesso di vedere i ruoli e i loro permessi'),
('ROLE_WRITE', 'Permesso di creare e modificare ruoli'),
('TICKET_CREATE', 'Permesso di creare nuovi ticket'),
('TICKET_READ_ALL', 'Permesso di vedere QUALSIASI ticket nel sistema'),
('TICKET_UPDATE_ALL', 'Permesso di modificare QUALSIASI ticket nel sistema'),
('TICKET_ASSIGN', 'Permesso di assegnare o riassegnare un ticket'),
('TICKET_STATUS_CHANGE', 'Permesso di modificare lo stato di un ticket'),
('TICKET_PRIORITY_CHANGE', 'Permesso di modificare la priorità di un ticket'),
('TICKET_DELETE', 'Permesso di eliminare (soft delete) un ticket'),
('TICKET_COMMENT_ALL', 'Permesso di aggiungere commenti a QUALSIASI ticket'),
('DEPARTMENT_READ', 'Permesso di vedere i dipartimenti'),
('DEPARTMENT_WRITE', 'Permesso di creare e modificare i dipartimenti');


-- ### 11. Associazione manuale Permessi ai Ruoli (escluso ADMIN) ###
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'ROLE_TECNICO' AND p.name IN (
    'TICKET_READ_ALL',
    'TICKET_ASSIGN',
    'TICKET_STATUS_CHANGE',
    'TICKET_PRIORITY_CHANGE',
    'TICKET_COMMENT_ALL'
);

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'ROLE_USER' AND p.name = 'TICKET_CREATE';


-- ### 12. Inserimento Profili Utente e Credenziali Iniziali (locali) ###
-- La password per tutti è "password" (hash BCrypt)
-- Utente Admin
WITH admin_profile AS (
    INSERT INTO user_profiles (email, display_name) VALUES ('admin@example.com', 'Admin User') RETURNING id
)
INSERT INTO user_credentials (user_profile_id, provider, provider_id, password)
SELECT id, 'LOCAL', null, '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqR2e5RzTTNcePI6JubTBmubSnP6' FROM admin_profile;

-- Utente Tecnico
WITH tecnico_profile AS (
    INSERT INTO user_profiles (email, display_name) VALUES ('tecnico@example.com', 'Tecnico User') RETURNING id
)
INSERT INTO user_credentials (user_profile_id, provider, provider_id, password)
SELECT id, 'LOCAL', null, '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqR2e5RzTTNcePI6JubTBmubSnP6' FROM tecnico_profile;

-- Utente User
WITH user_profile AS (
    INSERT INTO user_profiles (email, display_name) VALUES ('user@example.com', 'Standard User') RETURNING id
)
INSERT INTO user_credentials (user_profile_id, provider, provider_id, password)
SELECT id, 'LOCAL', null, '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqR2e5RzTTNcePI6JubTBmubSnP6' FROM user_profile;


-- ### 13. Associazione Ruoli ai Profili Utente Iniziali ###
INSERT INTO user_profile_roles (user_profile_id, role_id)
SELECT u.id, r.id FROM user_profiles u, roles r WHERE u.email = 'admin@example.com' AND r.name = 'ROLE_ADMIN';

INSERT INTO user_profile_roles (user_profile_id, role_id)
SELECT u.id, r.id FROM user_profiles u, roles r WHERE u.email = 'tecnico@example.com' AND r.name = 'ROLE_TECNICO';

INSERT INTO user_profile_roles (user_profile_id, role_id)
SELECT u.id, r.id FROM user_profiles u, roles r WHERE u.email = 'user@example.com' AND r.name = 'ROLE_USER';