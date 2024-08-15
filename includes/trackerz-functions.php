<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

use Trackerz\Trackerz;

// Função para recuperar um lead pelo ID
function trackerz_get_lead_by_id($lead_id) {
    global $wpdb;
    $table = $wpdb->prefix . 'trackerz_leads';
    $lead_id = sanitize_text_field($lead_id);
    $query = $wpdb->prepare("SELECT * FROM $table WHERE lead_id = %s", $lead_id);
    $lead = $wpdb->get_row($query);

    if ($wpdb->last_error) {
        error_log('Error retrieving lead: ' . $wpdb->last_error);
        return null;
    }

    return $lead;
}

// Função para atualizar os dados do lead
function trackerz_update_lead($lead_id, $lead_data) {
    global $wpdb;
    $table = $wpdb->prefix . 'trackerz_leads';
    $lead_id = sanitize_text_field($lead_id);

    $sanitized_data = array_map('sanitize_text_field', $lead_data);
    if (isset($sanitized_data['lead_email'])) {
        $sanitized_data['lead_email'] = sanitize_email($sanitized_data['lead_email']);
    }

    $where = ['lead_id' => $lead_id];
    $result = $wpdb->update($table, $sanitized_data, $where);

    if ($result === false) {
        error_log('Error updating lead: ' . $wpdb->last_error);
        return false;
    }

    return true;
}

// Função para deletar um lead pelo ID
function trackerz_delete_lead($lead_id) {
    global $wpdb;
    $table = $wpdb->prefix . 'trackerz_leads';
    $lead_id = sanitize_text_field($lead_id);
    $result = $wpdb->delete($table, ['lead_id' => $lead_id]);

    if ($result === false) {
        error_log('Error deleting lead: ' . $wpdb->last_error);
        return false;
    }

    return true;
}

// Função para recuperar uma sessão pelo ID
function trackerz_get_session_by_id($session_id) {
    global $wpdb;
    $table = $wpdb->prefix . 'trackerz_sessions';
    $session_id = sanitize_text_field($session_id);
    $query = $wpdb->prepare("SELECT * FROM $table WHERE session_id = %s", $session_id);
    $session = $wpdb->get_row($query);

    if ($wpdb->last_error) {
        error_log('Error retrieving session: ' . $wpdb->last_error);
        return null;
    }

    return $session;
}

// Função para atualizar os dados da sessão
function trackerz_update_session($session_id, $session_data) {
    global $wpdb;
    $table = $wpdb->prefix . 'trackerz_sessions';
    $session_id = sanitize_text_field($session_id);

    $sanitized_data = array_map('sanitize_text_field', $session_data);
    if (isset($sanitized_data['lead_email'])) {
        $sanitized_data['lead_email'] = sanitize_email($sanitized_data['lead_email']);
    }
    if (isset($sanitized_data['device'])) {
        $sanitized_data['device'] = sanitize_textarea_field($sanitized_data['device']);
    }

    $where = ['session_id' => $session_id];
    $result = $wpdb->update($table, $sanitized_data, $where);

    if ($result === false) {
        error_log('Error updating session: ' . $wpdb->last_error);
        return false;
    }

    return true;
}

// Função para deletar uma sessão pelo ID
function trackerz_delete_session($session_id) {
    global $wpdb;
    $table = $wpdb->prefix . 'trackerz_sessions';
    $session_id = sanitize_text_field($session_id);
    $result = $wpdb->delete($table, ['session_id' => $session_id]);

    if ($result === false) {
        error_log('Error deleting session: ' . $wpdb->last_error);
        return false;
    }

    return true;
}

// Função para recuperar eventos de uma sessão
function trackerz_get_events_by_session_id($session_id) {
    global $wpdb;
    $table = $wpdb->prefix . 'trackerz_events';
    $session_id = sanitize_text_field($session_id);
    $query = $wpdb->prepare("SELECT * FROM $table WHERE session_id = %s", $session_id);
    $events = $wpdb->get_results($query);

    if ($wpdb->last_error) {
        error_log('Error retrieving events: ' . $wpdb->last_error);
        return null;
    }

    return $events;
}

// Função para inserir um novo evento
function trackerz_insert_event($event_data) {
    global $wpdb;
    $table = $wpdb->prefix . 'trackerz_events';

    $sanitized_data = array_map('sanitize_text_field', $event_data);
    if (isset($sanitized_data['event_data'])) {
        $sanitized_data['event_data'] = sanitize_textarea_field($sanitized_data['event_data']);
    }
    if (isset($sanitized_data['page_title'])) {
        $sanitized_data['page_title'] = sanitize_text_field($sanitized_data['page_title']);
    }
    if (isset($sanitized_data['page_url'])) {
        $sanitized_data['page_url'] = esc_url_raw($sanitized_data['page_url']);
    }
    if (isset($sanitized_data['traffic_source'])) {
        $sanitized_data['traffic_source'] = esc_url_raw($sanitized_data['traffic_source']);
    }
    if (isset($sanitized_data['device'])) {
        $sanitized_data['device'] = sanitize_textarea_field($sanitized_data['device']);
    }

    $result = $wpdb->insert($table, $sanitized_data);

    if ($result === false) {
        error_log('Error inserting event: ' . $wpdb->last_error);
        return false;
    }

    return true;
}

// Função para atualizar um evento
function trackerz_update_event($event_id, $event_data) {
    global $wpdb;
    $table = $wpdb->prefix . 'trackerz_events';
    $event_id = sanitize_text_field($event_id);

    $sanitized_data = array_map('sanitize_text_field', $event_data);
    if (isset($sanitized_data['event_data'])) {
        $sanitized_data['event_data'] = sanitize_textarea_field($sanitized_data['event_data']);
    }
    if (isset($sanitized_data['page_title'])) {
        $sanitized_data['page_title'] = sanitize_text_field($sanitized_data['page_title']);
    }
    if (isset($sanitized_data['page_url'])) {
        $sanitized_data['page_url'] = esc_url_raw($sanitized_data['page_url']);
    }
    if (isset($sanitized_data['traffic_source'])) {
        $sanitized_data['traffic_source'] = esc_url_raw($sanitized_data['traffic_source']);
    }
    if (isset($sanitized_data['device'])) {
        $sanitized_data['device'] = sanitize_textarea_field($sanitized_data['device']);
    }

    $where = ['event_id' => $event_id];
    $result = $wpdb->update($table, $sanitized_data, $where);

    if ($result === false) {
        error_log('Error updating event: ' . $wpdb->last_error);
        return false;
    }

    return true;
}

// Função para deletar um evento
function trackerz_delete_event($event_id) {
    global $wpdb;
    $table = $wpdb->prefix . 'trackerz_events';
    $event_id = sanitize_text_field($event_id);
    $result = $wpdb->delete($table, ['event_id' => $event_id]);

    if ($result === false) {
        error_log('Error deleting event: ' . $wpdb->last_error);
        return false;
    }

    return true;
}


?>