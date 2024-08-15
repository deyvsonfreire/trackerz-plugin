<?php

if (!defined('ABSPATH')) {
    exit;
}

use Trackerz\Trackerz;

// Função para registrar as rotas da API REST
function trackerz_register_routes() {
    register_rest_route('trackerz/v1', '/save-session-data', [
        'methods' => 'POST',
        'callback' => 'trackerz_save_session_data',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('trackerz/v1', '/lead', [
        'methods' => 'POST',
        'callback' => 'trackerz_save_lead_data',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('trackerz/v1', '/event', [
        'methods' => 'POST',
        'callback' => 'trackerz_save_event_data',
        'permission_callback' => '__return_true',
    ]);
}
add_action('rest_api_init', 'trackerz_register_routes');

// Função para salvar os dados da sessão
function trackerz_save_session_data(WP_REST_Request $request) {
    global $wpdb;

    $data = $request->get_json_params();

    // Adiciona log para depuração
    error_log('Data received in trackerz_save_session_data: ' . print_r($data, true));

    $session_data = [
        'session_id' => sanitize_text_field($data['session_id']),
        'lead_id' => sanitize_text_field($data['lead_id']),
        'lead_ip' => sanitize_text_field($data['lead_ip']),
        'device' => sanitize_textarea_field($data['device']),
        'fbclid' => isset($data['fbclid']) ? sanitize_text_field($data['fbclid']) : null,
        'utm_medium' => isset($data['utm_medium']) ? sanitize_text_field($data['utm_medium']) : null,
        'utm_campaign' => isset($data['utm_campaign']) ? sanitize_text_field($data['utm_campaign']) : null,
        'utm_content' => isset($data['utm_content']) ? sanitize_text_field($data['utm_content']) : null,
        'utm_term' => isset($data['utm_term']) ? sanitize_text_field($data['utm_term']) : null,
        'utm_source' => isset($data['utm_source']) ? sanitize_text_field($data['utm_source']) : null,
        'gclid' => isset($data['gclid']) ? sanitize_text_field($data['gclid']) : null,
        'campaignid' => isset($data['campaignid']) ? sanitize_text_field($data['campaignid']) : null,
        'id_utm' => isset($data['id_utm']) ? sanitize_text_field($data['id_utm']) : null,
        'fbc' => isset($data['fbc']) ? sanitize_text_field($data['fbc']) : null,
        'fbp' => isset($data['fbp']) ? sanitize_text_field($data['fbp']) : null,
        'adset' => isset($data['adset']) ? sanitize_text_field($data['adset']) : null,
        'adid' => isset($data['adid']) ? sanitize_text_field($data['adid']) : null,
        'adgroupid' => isset($data['adgroupid']) ? sanitize_text_field($data['adgroupid']) : null,
        'targetid' => isset($data['targetid']) ? sanitize_text_field($data['targetid']) : null,
        'created_at' => current_time('mysql'),
    ];

    $table = $wpdb->prefix . 'trackerz_sessions';
    $result = $wpdb->insert($table, $session_data);

    // Adiciona log para depuração
    error_log('Result of insert query: ' . $result);
    error_log('wpdb last error: ' . $wpdb->last_error);

    if ($result) {
        return new WP_REST_Response(['message' => 'Dados da sessão salvos com sucesso', 'session_id' => $data['session_id']], 201);
    } else {
        return new WP_REST_Response('Erro ao salvar dados da sessão', 500);
    }
}

// Função para salvar os dados do lead
function trackerz_save_lead_data(WP_REST_Request $request) {
    global $wpdb;

    $data = $request->get_json_params();

    // Adiciona log para depuração
    error_log('Data received in trackerz_save_lead_data: ' . print_r($data, true));

    $lead_data = [
        'lead_id' => sanitize_text_field($data['lead_id']),
        'lead_name' => sanitize_text_field($data['lead_name']),
        'lead_email' => sanitize_email($data['lead_email']),
        'lead_phone' => sanitize_text_field($data['lead_phone']),
        'adress_city' => sanitize_text_field($data['adress_city']),
        'adress_state' => sanitize_text_field($data['adress_state']),
        'adress_zipcode' => sanitize_text_field($data['adress_zipcode']),
        'adress_country_name' => sanitize_text_field($data['adress_country_name']),
        'adress_country' => sanitize_text_field($data['adress_country']),
        'utm_medium' => isset($data['utm_medium']) ? sanitize_text_field($data['utm_medium']) : null,
        'utm_campaign' => isset($data['utm_campaign']) ? sanitize_text_field($data['utm_campaign']) : null,
        'utm_content' => isset($data['utm_content']) ? sanitize_text_field($data['utm_content']) : null,
        'utm_term' => isset($data['utm_term']) ? sanitize_text_field($data['utm_term']) : null,
        'utm_source' => isset($data['utm_source']) ? sanitize_text_field($data['utm_source']) : null,
        'adset' => isset($data['adset']) ? sanitize_text_field($data['adset']) : null,
        'adid' => isset($data['adid']) ? sanitize_text_field($data['adid']) : null,
        'adgroupid' => isset($data['adgroupid']) ? sanitize_text_field($data['adgroupid']) : null,
        'targetid' => isset($data['targetid']) ? sanitize_text_field($data['targetid']) : null,
        'created_at' => current_time('mysql'),
    ];

    $table = $wpdb->prefix . 'trackerz_leads';
    $result = $wpdb->insert($table, $lead_data);

    // Adiciona log para depuração
    error_log('Result of insert query: ' . $result);
    error_log('wpdb last error: ' . $wpdb->last_error);

    if ($result) {
        return new WP_REST_Response(['message' => 'Dados do lead salvos com sucesso', 'lead_id' => $data['lead_id']], 201);
    } else {
        return new WP_REST_Response('Erro ao salvar dados do lead', 500);
    }
}

// Função para salvar os dados do evento
function trackerz_save_event_data(WP_REST_Request $request) {
    global $wpdb;

    $data = $request->get_json_params();

    // Adiciona log para depuração
    error_log('Data received in trackerz_save_event_data: ' . print_r($data, true));

    $event_data = [
        'event_id' => sanitize_text_field($data['event_id']),
        'user_id' => sanitize_text_field($data['user_id']),
        'session_id' => sanitize_text_field($data['session_id']),
        'event_name' => sanitize_text_field($data['event_name']),
        'event_data' => isset($data['event_data']) ? sanitize_textarea_field(json_encode($data['event_data'])) : null,
        'event_day' => intval($data['event_day']),
        'event_month' => sanitize_text_field($data['event_month']),
        'event_day_in_month' => intval($data['event_day_in_month']),
        'event_time_interval' => sanitize_text_field($data['event_time_interval']),
        'page_title' => sanitize_text_field($data['page_title']),
        'page_url' => esc_url_raw($data['page_url']),
        'traffic_source' => esc_url_raw($data['traffic_source']),
        'ip' => sanitize_text_field($data['ip']),
        'device' => sanitize_textarea_field($data['device']),
        'created_at' => current_time('mysql'),
    ];

    $table = $wpdb->prefix . 'trackerz_events';
    $result = $wpdb->insert($table, $event_data);

    // Adiciona log para depuração
    error_log('Result of insert query: ' . $result);
    error_log('wpdb last error: ' . $wpdb->last_error);

    if ($result) {
        return new WP_REST_Response(['message' => 'Dados do evento salvos com sucesso', 'event_id' => $data['event_id']], 201);
    } else {
        return new WP_REST_Response('Erro ao salvar dados do evento', 500);
    }
}