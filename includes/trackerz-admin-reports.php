<?php
/**
 * Trackerz Admin Reports
 *
 * @package Trackerz
 */

use Trackerz\Trackerz;

/**
 * Renderiza a página de relatórios.
 */
function trackerz_admin_reports_page() {
  ?>
  <div class="wrap">
    <h1><?php echo esc_html( __( 'Relatórios', 'trackerz' ) ); ?></h1>

    <?php

    // Exibe a lista de leads
    $leads = trackerz_get_all_leads();
    if ( ! empty( $leads ) ) {
      ?>
      <h2><?php esc_html_e( 'Leads', 'trackerz' ); ?></h2>
      <table class="wp-list-table widefat fixed striped">
        <thead>
          <tr>
            <th scope="col"><?php esc_html_e( 'ID do Lead', 'trackerz' ); ?></th>
            <th scope="col"><?php esc_html_e( 'Nome', 'trackerz' ); ?></th>
            <th scope="col"><?php esc_html_e( 'Email', 'trackerz' ); ?></th>
            <th scope="col"><?php esc_html_e( 'Telefone', 'trackerz' ); ?></th>
            <th scope="col"><?php esc_html_e( 'Cidade', 'trackerz' ); ?></th>
            <th scope="col"><?php esc_html_e( 'Estado', 'trackerz' ); ?></th>
            <th scope="col"><?php esc_html_e( 'País', 'trackerz' ); ?></th>
            <th scope="col"><?php esc_html_e( 'Data de Criação', 'trackerz' ); ?></th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ( $leads as $lead ) : ?>
            <tr>
              <td><?php echo esc_html( $lead->lead_id ); ?></td>
              <td><?php echo esc_html( $lead->lead_name ); ?></td>
              <td><?php echo esc_html( $lead->lead_email ); ?></td>
              <td><?php echo esc_html( $lead->lead_phone ); ?></td>
              <td><?php echo esc_html( $lead->adress_city ); ?></td>
              <td><?php echo esc_html( $lead->adress_state ); ?></td>
              <td><?php echo esc_html( $lead->adress_country_name ); ?></td>
              <td><?php echo esc_html( $lead->created_at ); ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
      <?php
    } else {
      ?>
      <p><?php esc_html_e( 'Nenhum lead encontrado.', 'trackerz' ); ?></p>
      <?php
    }

    // Exibe a lista de sessões
    $sessions = trackerz_get_all_sessions();
    if ( ! empty( $sessions ) ) {
      ?>
      <h2><?php esc_html_e( 'Sessões', 'trackerz' ); ?></h2>
      <table class="wp-list-table widefat fixed striped">
        <thead>
          <tr>
            <th scope="col"><?php esc_html_e( 'ID da Sessão', 'trackerz' ); ?></th>
            <th scope="col"><?php esc_html_e( 'Lead ID', 'trackerz' ); ?></th>
            <th scope="col"><?php esc_html_e( 'IP', 'trackerz' ); ?></th>
            <th scope="col"><?php esc_html_e( 'Dispositivo', 'trackerz' ); ?></th>
            <th scope="col"><?php esc_html_e( 'UTM Source', 'trackerz' ); ?></th>
            <th scope="col"><?php esc_html_e( 'Data de Criação', 'trackerz' ); ?></th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ( $sessions as $session ) : ?>
            <tr>
              <td><?php echo esc_html( $session->session_id ); ?></td>
              <td><?php echo esc_html( $session->lead_id ); ?></td>
              <td><?php echo esc_html( $session->lead_ip ); ?></td>
              <td><?php echo esc_html( $session->device ); ?></td>
              <td><?php echo esc_html( $session->utm_source ); ?></td>
              <td><?php echo esc_html( $session->created_at ); ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
      <?php
    } else {
      ?>
      <p><?php esc_html_e( 'Nenhuma sessão encontrada.', 'trackerz' ); ?></p>
      <?php
    }

    // Exibe a lista de eventos
    $events = trackerz_get_all_events();
    if ( ! empty( $events ) ) {
      ?>
      <h2><?php esc_html_e( 'Eventos', 'trackerz' ); ?></h2>
      <table class="wp-list-table widefat fixed striped">
        <thead>
          <tr>
            <th scope="col"><?php esc_html_e( 'ID do Evento', 'trackerz' ); ?></th>
            <th scope="col"><?php esc_html_e( 'Nome do Evento', 'trackerz' ); ?></th>
            <th scope="col"><?php esc_html_e( 'Dados do Evento', 'trackerz' ); ?></th>
            <th scope="col"><?php esc_html_e( 'Sessão', 'trackerz' ); ?></th>
            <th scope="col"><?php esc_html_e( 'Data de Criação', 'trackerz' ); ?></th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ( $events as $event ) : ?>
            <tr>
              <td><?php echo esc_html( $event->event_id ); ?></td>
              <td><?php echo esc_html( $event->event_name ); ?></td>
              <td><?php echo esc_html( $event->event_data ); ?></td>
              <td><?php echo esc_html( $event->session_id ); ?></td>
              <td><?php echo esc_html( $event->created_at ); ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
      <?php
    } else {
      ?>
      <p><?php esc_html_e( 'Nenhum evento encontrado.', 'trackerz' ); ?></p>
      <?php
    }
  }

/**
 * Adiciona a página de relatórios ao menu do WordPress.
 */
function trackerz_admin_reports_menu() {
  add_submenu_page(
    'trackerz-settings',
    __( 'Relatórios', 'trackerz' ),
    __( 'Relatórios', 'trackerz' ),
    'manage_options',
    'trackerz-reports',
    'trackerz_admin_reports_page'
  );
}
add_action( 'admin_menu', 'trackerz_admin_reports_menu' );

/**
 * Função para buscar todos os leads.
 *
 * @return array Lista de leads.
 */
function trackerz_get_all_leads() {
  global $wpdb;
  $table = $wpdb->prefix . 'trackerz_leads';
  $leads = $wpdb->get_results( "SELECT * FROM $table" );

  return $leads;
}

/**
 * Função para buscar todas as sessões.
 *
 * @return array Lista de sessões.
 */
function trackerz_get_all_sessions() {
  global $wpdb;
  $table = $wpdb->prefix . 'trackerz_sessions';
  $sessions = $wpdb->get_results( "SELECT * FROM $table" );

  return $sessions;
}

/**
 * Função para buscar todos os eventos.
 *
 * @return array Lista de eventos.
 */
function trackerz_get_all_events() {
  global $wpdb;
  $table = $wpdb->prefix . 'trackerz_events';
  $events = $wpdb->get_results( "SELECT * FROM $table" );

  return $events;
}