-- ##################################################################
-- #  MIGRATION 3: STRUTTURE PER HIBERNATE ENVERS (AUDITING)
-- ##################################################################

-- ### 13. Tabella e Sequenza di base per Envers ###
CREATE TABLE revinfo (
    rev BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    revtstmp BIGINT
);

CREATE SEQUENCE revinfo_seq START WITH 1 INCREMENT BY 50;

-- ### 14. Tabella di Audit per UserProfile ###
CREATE TABLE companies_aud (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_companies_aud_rev FOREIGN KEY (rev) REFERENCES revinfo (rev)
);

-- ### 15. Tabella di Audit per UserProfile ###
CREATE TABLE user_profiles_aud (
    id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    email VARCHAR(100),
    display_name VARCHAR(255),
    preferences JSONB,
    enabled BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_user_profiles_aud_rev FOREIGN KEY (rev) REFERENCES revinfo (rev)
);

-- ### 16. Tabella di Audit per UserCredential ###
CREATE TABLE user_credentials_aud (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    user_profile_id BIGINT,
    password VARCHAR(255),
    provider VARCHAR(50),
    provider_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_user_credentials_aud_rev FOREIGN KEY (rev) REFERENCES revinfo (rev)
);

-- ### 17. Tabella di Audit per Role ###
CREATE TABLE roles_aud (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    name VARCHAR(50),
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_roles_aud_rev FOREIGN KEY (rev) REFERENCES revinfo (rev)
);

-- ### 18. Tabella di Audit per Permission ###
CREATE TABLE permissions_aud (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    name VARCHAR(100),
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_permissions_aud_rev FOREIGN KEY (rev) REFERENCES revinfo (rev)
);

-- ### 19. Tabella di Audit per Department ###
CREATE TABLE departments_aud (
    id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    name VARCHAR(100),
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_departments_aud_rev FOREIGN KEY (rev) REFERENCES revinfo (rev)
);

-- ### 20. Tabella di Audit per Ticket ###
CREATE TABLE tickets_aud (
    id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    title VARCHAR(255),
    description TEXT,
    requester_id BIGINT,
    assignee_id BIGINT,
    department_id BIGINT,
    status VARCHAR(255),
    priority VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_tickets_aud_rev FOREIGN KEY (rev) REFERENCES revinfo (rev)
);

-- ### 21. Tabella di Audit per la relazione Utenti-Ruoli ###
CREATE TABLE user_profile_roles_aud (
    rev BIGINT NOT NULL,
    user_profile_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    revtype SMALLINT,
    PRIMARY KEY (rev, user_profile_id, role_id),
    CONSTRAINT fk_user_profile_roles_aud_rev FOREIGN KEY (rev) REFERENCES revinfo (rev)
);

-- ### 22. Tabella di Audit per la relazione Ruoli-Permessi ###
CREATE TABLE role_permissions_aud (
    rev BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    revtype SMALLINT,
    PRIMARY KEY (rev, role_id, permission_id),
    CONSTRAINT fk_role_permissions_aud_rev FOREIGN KEY (rev) REFERENCES revinfo (rev)
);