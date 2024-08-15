<?php
/**
 * Trackerz Admin Events
 *
 * @package Trackerz
 */

use Trackerz\Trackerz;

/**
 * Renderiza a página de gerenciamento de eventos.
 */
function trackerz_admin_events_page() {
  ?>
  <div class="wrap">
    <h1><?php echo esc_html( __( 'Gerenciar Eventos', 'trackerz' ) ); ?></h1>

    <?php
    // Verifica se foi enviado um formulário
    if ( isset( $_POST['action'] ) && 'trackerz_save_event' === $_POST['action'] ) {
      $event_id = isset( $_POST['event_id'] ) ? sanitize_text_field( $_POST['event_id'] ) : '';
      $event_name = isset( $_POST['event_name'] ) ? sanitize_text_field( $_POST['event_name'] ) : '';
      $event_data = isset( $_POST['event_data'] ) ? sanitize_textarea_field( $_POST['event_data'] ) : '';
      $session_id = isset( $_POST['session_id'] ) ? sanitize_text_field( $_POST['session_id'] ) : '';

      if ( empty( $event_id ) ) {
        // Insere um novo evento
        $result = trackerz_insert_event(
          [
            'event_id'             => uuid(), // Gera um novo ID de evento
            'user_id'              => get_current_user_id(),
            'session_id'           => $session_id,
            'event_name'           => $event_name,
            'event_data'           => $event_data,
            'event_day'             => date( 'w' ), // Dia da semana
            'event_month'           => date( 'F' ), // Mês
            'event_day_in_month'     => date( 'j' ), // Dia do mês
            'event_time_interval'   => date( 'G' ) . '-' . ( date( 'G' ) + 1 ), // Intervalo de tempo
            'page_title'           => get_the_title(),
            'page_url'             => get_permalink(),
            'traffic_source'       => wp_get_referer(),
            'ip'                   => $_SERVER['REMOTE_ADDR'],
            'device'               => $_SERVER['HTTP_USER_AGENT'],
          ]
        );
      } else {
        // Atualiza um evento existente
        $result = trackerz_update_event(
          $event_id,
          [
            'event_name'           => $event_name,
            'event_data'           => $event_data,
          ]
        );
      }

      if ( $result ) {
        // Exibe uma mensagem de sucesso
        add_settings_error(
          'trackerz_events',
          'trackerz_event_saved',
          __( 'Evento salvo com sucesso.', 'trackerz' ),
          'updated'
        );
      } else {
        // Exibe uma mensagem de erro
        add_settings_error(
          'trackerz_events',
          'trackerz_event_error',
          __( 'Erro ao salvar o evento.', 'trackerz' ),
          'error'
        );
      }
    }

    // Exibe mensagens de erro e sucesso
    settings_errors( 'trackerz_events' );

    // Busca todos os eventos
    $events = trackerz_get_all_events();

    // Exibe os eventos em uma tabela
    if ( ! empty( $events ) ) {
      ?>
      <table class="wp-list-table widefat fixed striped">
        <thead>
          <tr>
            <th scope="col"><?php esc_html_e( 'ID do Evento', 'trackerz' ); ?></th>
            <th scope="col"><?php esc_html_e( 'Nome do Evento', 'trackerz' ); ?></th>
            <th scope="col"><?php esc_html_e( 'Dados do Evento', 'trackerz' ); ?></th>
            <th scope="col"><?php esc_html_e( 'Ações', 'trackerz' ); ?></th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ( $events as $event ) : ?>
            <tr>
              <td><?php echo esc_html( $event->event_id ); ?></td>
              <td><?php echo esc_html( $event->event_name ); ?></td>
              <td><?php echo esc_html( $event->event_data ); ?></td>
              <td>
                <a href="<?php echo esc_url( admin_url( 'options-general.php?page=trackerz-events&action=edit&event_id=' . $event->event_id ) ); ?>" class="button"><?php esc_html_e( 'Editar', 'trackerz' ); ?></a>
                <a href="<?php echo esc_url( wp_nonce_url( admin_url( 'options-general.php?page=trackerz-events&action=delete&event_id=' . $event->event_id ), 'trackerz_delete_event' ) ); ?>" class="button"><?php esc_html_e( 'Excluir', 'trackerz' ); ?></a>
              </td>
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

    // Formulário para adicionar/editar eventos
    ?>
    <form method="post" action="<?php echo esc_url( admin_url( 'options-general.php?page=trackerz-events' ) ); ?>">
      <?php wp_nonce_field( 'trackerz_save_event', 'trackerz_nonce' ); ?>
      <input type="hidden" name="action" value="trackerz_save_event" />
      <input type="hidden" name="event_id" value="<?php echo esc_attr( isset( $_GET['event_id'] ) ? sanitize_text_field( $_GET['event_id'] ) : '' ); ?>" />
      <table class="form-table">
        <tbody>
          <tr>
            <th scope="row"><label for="event_name"><?php esc_html_e( 'Nome do Evento', 'trackerz' ); ?></label></th>
            <td><input type="text" name="event_name" id="event_name" class="regular-text" value="<?php echo esc_attr( isset( $_POST['event_name'] ) ? sanitize_text_field( $_POST['event_name'] ) : '' ); ?>" /></td>
          </tr>
          <tr>
            <th scope="row"><label for="event_data"><?php esc_html_e( 'Dados do Evento', 'trackerz' ); ?></label></th>
            <td><textarea name="event_data" id="event_data" class="large-text"><?php echo esc_textarea( isset( $_POST['event_data'] ) ? sanitize_textarea_field( $_POST['event_data'] ) : '' ); ?></textarea></td>
          </tr>
          <tr>
            <th scope="row"><label for="session_id"><?php esc_html_e( 'ID da Sessão', 'trackerz' ); ?></label></th>
            <td><input type="text" name="session_id" id="session_id" class="regular-text" value="<?php echo esc_attr( isset( $_POST['session_id'] ) ? sanitize_text_field( $_POST['session_id'] ) : '' ); ?>" /></td>
          </tr>
        </tbody>
      </table>
      <?php submit_button( __( 'Salvar Evento', 'trackerz' ) ); ?>
    </form>
    <?php
  }

/**
 * Adiciona a página de gerenciamento de eventos ao menu do WordPress.
 */
function trackerz_admin_events_menu() {
  add_submenu_page(
    'trackerz-settings',
    __( 'Gerenciar Eventos', 'trackerz' ),
    __( 'Eventos', 'trackerz' ),
    'manage_options',
    'trackerz-events',
    'trackerz_admin_events_page'
  );
}
add_action( 'admin_menu', 'trackerz_admin_events_menu' );

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

/**
 * Função para inserir um novo evento.
 *
 * @param array $event_data Dados do evento.
 * @return bool True se o evento foi inserido com sucesso, false caso contrário.
 */
function trackerz_insert_event( $event_data ) {
  global $wpdb;
  $table = $wpdb->prefix . 'trackerz_events';

  $result = $wpdb->insert( $table, $event_data );

  if ( $result === false ) {
    error_log( 'Error inserting event: ' . $wpdb->last_error );
    return false;
  }

  return true;
}

/**
 * Função para atualizar um evento existente.
 *
 * @param string $event_id ID do evento.
 * @param array  $event_data Dados do evento.
 * @return bool True se o evento foi atualizado com sucesso, false caso contrário.
 */
function trackerz_update_event( $event_id, $event_data ) {
  global $wpdb;
  $table = $wpdb->prefix . 'trackerz_events';
  $event_id = sanitize_text_field( $event_id );

  $result = $wpdb->update( $table, $event_data, [ 'event_id' => $event_id ] );

  if ( $result === false ) {
    error_log( 'Error updating event: ' . $wpdb->last_error );
    return false;
  }

  return true;
}

/**
 * Função para deletar um evento.
 *
 * @param string $event_id ID do evento.
 * @return bool True se o evento foi deletado com sucesso, false caso contrário.
 */
function trackerz_delete_event( $event_id ) {
  global $wpdb;
  $table = $wpdb->prefix . 'trackerz_events';
  $event_id = sanitize_text_field( $event_id );

  $result = $wpdb->delete( $table, [ 'event_id' => $event_id ] );

  if ( $result === false ) {
    error_log( 'Error deleting event: ' . $wpdb->last_error );
    return false;
  }

  return true;
}