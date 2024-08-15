<?php

if (!defined('ABSPATH')) {
    exit;
}

// Cria as tabelas customizadas no banco de dados
function trackerz_create_tables() {
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();

    // Tabela de sessões
    $table_sessions = $wpdb->prefix . 'trackerz_sessions';
    $sql_sessions = "
    CREATE TABLE $table_sessions (
        session_id VARCHAR(255) NOT NULL PRIMARY KEY,
        lead_id VARCHAR(255) NOT NULL,
        lead_ip VARCHAR(45),
        device TEXT,
        fbclid VARCHAR(255),
        utm_medium VARCHAR(255),
        utm_campaign VARCHAR(255),
        utm_content VARCHAR(255),
        utm_term VARCHAR(255),
        utm_source VARCHAR(255),
        gclid VARCHAR(255),
        campaignid VARCHAR(255),
        id_utm VARCHAR(255),
        fbc VARCHAR(255),
        fbp VARCHAR(255),
        adset VARCHAR(255),
        adid VARCHAR(255),
        adgroupid VARCHAR(255),
        targetid VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lead_id) REFERENCES {$wpdb->prefix}trackerz_leads(lead_id)
    ) $charset_collate;
    ";

    // Tabela de eventos
    $table_events = $wpdb->prefix . 'trackerz_events';
    $sql_events = "
    CREATE TABLE $table_events (
        event_id VARCHAR(255) NOT NULL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        session_id VARCHAR(255) NOT NULL,
        event_name VARCHAR(255),
        event_data TEXT,
        event_day INT,
        event_month VARCHAR(20),
        event_day_in_month INT,
        event_time_interval VARCHAR(20),
        page_title VARCHAR(255),
        page_url TEXT,
        traffic_source TEXT,
        ip VARCHAR(45),
        device TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES {$wpdb->prefix}trackerz_users(user_id),
        FOREIGN KEY (session_id) REFERENCES {$wpdb->prefix}trackerz_sessions(session_id)
    ) $charset_collate;
    ";

    // Tabela de leads
    $table_leads = $wpdb->prefix . 'trackerz_leads';
    $sql_leads = "
    CREATE TABLE $table_leads (
        lead_id VARCHAR(255) NOT NULL PRIMARY KEY,
        lead_name VARCHAR(255),
        lead_email VARCHAR(255),
        lead_phone VARCHAR(20),
        adress_city VARCHAR(255),
        adress_state VARCHAR(255),
        adress_zipcode VARCHAR(20),
        adress_country_name VARCHAR(255),
        adress_country VARCHAR(10),
        utm_medium VARCHAR(255),
        utm_campaign VARCHAR(255),
        utm_content VARCHAR(255),
        utm_term VARCHAR(255),
        utm_source VARCHAR(255),
        adset VARCHAR(255),
        adid VARCHAR(255),
        adgroupid VARCHAR(255),
        targetid VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) $charset_collate;
    ";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql_sessions);
    dbDelta($sql_events);
    dbDelta($sql_leads);
}

// Hook de ativação para criar as tabelas ao ativar o plugin
register_activation_hook(__FILE__, 'trackerz_create_tables');