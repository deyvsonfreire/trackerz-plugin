<?php
/*
Plugin Name: Trackerz Plugin V1
Plugin URI: https://trackerz.com
Description: O plugin Trackerz oferece uma solução completa para rastreamento e análise de dados em sites WordPress. Com este plugin, você pode facilmente acompanhar e analisar o comportamento dos visitantes do seu site, monitorar conversões, e obter insights valiosos para otimizar o desempenho do seu site.
Version: 1.0.5
Author: Deyvson Freire
License: GPL
*/

if (!defined('ABSPATH')) {
    exit;
}

// Include the main plugin file
require_once(plugin_dir_path(__FILE__) . '/trackerz-class.php');

// Instantiate the Trackerz plugin
$trackerz_plugin = new Trackerz();


function trackerz_session(WP_REST_Request $request) {

    // Obtenha os dados enviados no corpo da requisição
    $data = $request->get_json_params();

    // Verifique se os dados foram recebidos corretamente
    if (empty($data)) {
        return array('message' => 'Nenhum dado foi recebido', 'status' => 400);
    }

    // Acesso aos dados individuais
    $session_id = sanitize_text_field($data['body']['session_id']);
    $domain = sanitize_text_field($data['body']['domain']);
    $page_url = esc_url_raw($data['body']['page_url']);
    $event_day_in_month = intval($data['body']['event_day_in_month']);
    $event_day = sanitize_text_field($data['body']['event_day']);
    $event_month = sanitize_text_field($data['body']['event_month']);
    $event_time_interval = sanitize_text_field($data['body']['event_time_interval']);
    $tkz_lead_ip = sanitize_text_field($data['body']['geolocation']['tkz_lead_ip']);
    $tkz_lead_city = sanitize_text_field($data['body']['geolocation']['tkz_lead_city']);
    $tkz_lead_region = sanitize_text_field($data['body']['geolocation']['tkz_lead_region']);
    $tkz_lead_country = sanitize_text_field($data['body']['geolocation']['tkz_lead_country']);
    $tkz_lead_country_code = sanitize_text_field($data['body']['geolocation']['tkz_lead_country_code']);
    $tkz_lead_currency = sanitize_text_field($data['body']['geolocation']['tkz_lead_currency']);
    $tkz_lead_zipcode = sanitize_text_field($data['body']['geolocation']['tkz_lead_zipcode']);
    $lead_id = intval($data['body']['lead_id']);
    $lead_name = sanitize_text_field($data['body']['lead_name']);
    $lead_fname = sanitize_text_field($data['body']['lead_fname']);
    $lead_lname = sanitize_text_field($data['body']['lead_lname']);
    $lead_email = sanitize_email($data['body']['lead_email']);
    $lead_phone = sanitize_text_field($data['body']['lead_phone']);
    $ip = sanitize_text_field($data['body']['ip']);
    $device = sanitize_text_field($data['body']['device']);
    $adress_city = sanitize_text_field($data['body']['adress_city']);
    $adress_state = sanitize_text_field($data['body']['adress_state']);
    $adress_zipcode = sanitize_text_field($data['body']['adress_zipcode']);
    $adress_country_name = sanitize_text_field($data['body']['adress_country_name']);
    $adress_country = sanitize_text_field($data['body']['adress_country']);

    // Agora, você pode salvar os dados no banco de dados
    global $wpdb;
    $table_name = $wpdb->prefix . 'session_users';

    $wpdb->insert($table_name, array(
        'session_id' => $session_id,
        'domain' => $domain,
        'page_url' => $page_url,
        'event_day_in_month' => $event_day_in_month,
        'event_day' => $event_day,
        'event_month' => $event_month,
        'event_time_interval' => $event_time_interval,
        'tkz_lead_ip' => $tkz_lead_ip,
        'tkz_lead_city' => $tkz_lead_city,
        'tkz_lead_region' => $tkz_lead_region,
        'tkz_lead_country' => $tkz_lead_country,
        'tkz_lead_country_code' => $tkz_lead_country_code,
        'tkz_lead_currency' => $tkz_lead_currency,
        'tkz_lead_zipcode' => $tkz_lead_zipcode,
        'lead_id' => $lead_id,
        'lead_name' => $lead_name,
        'lead_fname' => $lead_fname,
        'lead_lname' => $lead_lname,
        'lead_email' => $lead_email,
        'lead_phone' => $lead_phone,
        'ip' => $ip,
        'device' => $device,
        'adress_city' => $adress_city,
        'adress_state' => $adress_state,
        'adress_zipcode' => $adress_zipcode,
        'adress_country_name' => $adress_country_name,
        'adress_country' => $adress_country,
    ));

    // Verifique se houve algum erro ao inserir no banco de dados
    if ($wpdb->last_error) {
        return array('message' => 'Erro ao salvar os dados no banco de dados', 'status' => 500);
    }

    // Se chegou até aqui, significa que os dados foram salvos com sucesso
    return array('message' => 'Dados salvos com sucesso', 'status' => 200);
}

add_action('rest_api_init', function () {
    register_rest_route('trackerz/v1', '/save-session-data', array(
        'methods' => 'POST',
        'callback' => 'save_session_data_to_database',
    ));
});

function save_session_data_to_database(WP_REST_Request $request) {
    global $wpdb;

    // Obtenha os dados enviados no corpo da requisição
    $data = $request->get_json_params();

    error_log('Dados recebidos no servidor:');
    error_log(print_r($data, true));

    // Verifique se os dados foram recebidos corretamente
    if (empty($data)) {
        return new WP_REST_Response(array(
            'message' => 'Nenhum dado foi recebido',
            'status' => 400
        ));
    }

    // Sanitize individual data fields
    $session_id = sanitize_text_field($data['session_id']);
    $domain = sanitize_text_field($data['domain']);
    $page_url = esc_url_raw($data['page_url']);
    $event_day_in_month = intval($data['event_day_in_month']);
    $event_day = sanitize_text_field($data['event_day']);
    $event_month = sanitize_text_field($data['event_month']);
    $event_time_interval = sanitize_text_field($data['event_time_interval']);
    $tkz_lead_ip = sanitize_text_field($data['geolocation']['tkz_lead_ip']);
    $tkz_lead_city = sanitize_text_field($data['geolocation']['tkz_lead_city']);
    $tkz_lead_region = sanitize_text_field($data['geolocation']['tkz_lead_region']);
    $tkz_lead_country = sanitize_text_field($data['geolocation']['tkz_lead_country']);
    $tkz_lead_country_code = sanitize_text_field($data['geolocation']['tkz_lead_country_code']);
    $tkz_lead_currency = sanitize_text_field($data['geolocation']['tkz_lead_currency']);
    $tkz_lead_zipcode = sanitize_text_field($data['geolocation']['tkz_lead_zipcode']);
    $lead_id = intval($data['lead_id']);
    $lead_name = sanitize_text_field($data['lead_name']);
    $lead_fname = sanitize_text_field($data['lead_fname']);
    $lead_lname = sanitize_text_field($data['lead_lname']);
    $lead_email = sanitize_email($data['lead_email']);
    $lead_phone = sanitize_text_field($data['lead_phone']);
    $ip = sanitize_text_field($data['ip']);
    $device = sanitize_text_field($data['device']);
    $adress_city = sanitize_text_field($data['adress_city']);
    $adress_state = sanitize_text_field($data['adress_state']);
    $adress_zipcode = sanitize_text_field($data['adress_zipcode']);
    $adress_country_name = sanitize_text_field($data['adress_country_name']);
    $adress_country = sanitize_text_field($data['adress_country']);

    // Agora, você pode salvar os dados no banco de dados
    global $wpdb;
    $table_name = $wpdb->prefix . 'session_users';

    $wpdb->insert($table_name, array(
        'session_id' => $session_id,
        'domain' => $domain,
        'page_url' => $page_url,
        'event_day_in_month' => $event_day_in_month,
        'event_day' => $event_day,
        'event_month' => $event_month,
        'event_time_interval' => $event_time_interval,
        'tkz_lead_ip' => $tkz_lead_ip,
        'tkz_lead_city' => $tkz_lead_city,
        'tkz_lead_region' => $tkz_lead_region,
        'tkz_lead_country' => $tkz_lead_country,
        'tkz_lead_country_code' => $tkz_lead_country_code,
        'tkz_lead_currency' => $tkz_lead_currency,
        'tkz_lead_zipcode' => $tkz_lead_zipcode,
        'lead_id' => $lead_id,
        'lead_name' => $lead_name,
        'lead_fname' => $lead_fname,
        'lead_lname' => $lead_lname,
        'lead_email' => $lead_email,
        'lead_phone' => $lead_phone,
        'ip' => $ip,
        'device' => $device,
        'adress_city' => $adress_city,
        'adress_state' => $adress_state,
        'adress_zipcode' => $adress_zipcode,
        'adress_country_name' => $adress_country_name,
        'adress_country' => $adress_country,
    ));

    // Verifique se houve algum erro ao inserir no banco de dados
    if ($wpdb->last_error) {
        return new WP_Error('database_error', 'Erro ao salvar os dados no banco de dados.', array('status' => 500));
    }

    // Se chegou até aqui, significa que os dados foram salvos com sucesso
    return new WP_REST_Response(array(
        'message' => 'Dados salvos com sucesso no banco de dados.',
        'status' => 200,
    ));

}

add_action('rest_api_init', function () {
    register_rest_route('trackerz/v1', '/lead', array(
        'methods' => 'POST',
        'callback' => 'save_lead_data_to_database',
    ));
});

function save_lead_data_to_database(WP_REST_Request $request) {
    global $wpdb;

    // Obtenha os dados enviados no corpo da requisição
    $data = $request->get_json_params();

    error_log('Dados recebidos no servidor:');
    error_log(print_r($data, true));

    // Verifique se os dados foram recebidos corretamente
    if (empty($data)) {
        return new WP_REST_Response(array(
            'message' => 'Nenhum dado foi recebido',
            'status' => 400
        ));
    }

    // Acesso aos dados individuais
    $lead_id = intval($data['body']['lead_id']);
    $lead_name = sanitize_text_field($data['body']['lead_name']);
    $lead_fname = sanitize_text_field($data['body']['lead_fname']);
    $lead_lname = sanitize_text_field($data['body']['lead_lname']);
    $lead_email = sanitize_email($data['body']['lead_email']);
    $lead_phone = sanitize_text_field($data['body']['lead_phone']);
    $ip = sanitize_text_field($data['body']['ip']);
    $device = sanitize_text_field($data['body']['device']);
    $adress_city = sanitize_text_field($data['body']['adress_city']);
    $adress_state = sanitize_text_field($data['body']['adress_state']);
    $adress_zipcode = sanitize_text_field($data['body']['adress_zipcode']);
    $adress_country_name = sanitize_text_field($data['body']['adress_country_name']);
    $adress_country = sanitize_text_field($data['body']['adress_country']);
    $fbc = sanitize_text_field($data['body']['fbc']);
    $fbp = sanitize_text_field($data['body']['fbp']);

    // Agora, você pode salvar os dados no banco de dados
    global $wpdb;
    $table_name = $wpdb->prefix . 'trackerz_lead';

    $wpdb->insert($table_name, array(
        'lead_id' => $lead_id,
        'lead_name' => $lead_name,
        'lead_fname' => $lead_fname,
        'lead_lname' => $lead_lname,
        'lead_email' => $lead_email,
        'lead_phone' => $lead_phone,
        'ip' => $ip,
        'device' => $device,
        'adress_city' => $adress_city,
        'adress_state' => $adress_state,
        'adress_zipcode' => $adress_zipcode,
        'adress_country_name' => $adress_country_name,
        'adress_country' => $adress_country,
        'fbc' => $fbc,
        'fbp' => $fbp,
    ));

    // Verifique se houve algum erro ao inserir no banco de dados
    if ($wpdb->last_error) {
        return new WP_Error('database_error', 'Erro ao salvar os dados no banco de dados.', array('status' => 500));
    }

    // Se chegou até aqui, significa que os dados foram salvos com sucesso
    return new WP_REST_Response(array(
        'message' => 'Dados salvos com sucesso no banco de dados.',
        'status' => 200,
    ));

}


// Activation and deactivation hooks
register_activation_hook(__FILE__, array($trackerz_plugin, 'activate'));
register_deactivation_hook(__FILE__, array($trackerz_plugin, 'deactivate'));
