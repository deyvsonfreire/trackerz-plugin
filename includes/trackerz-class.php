<?php
/**
 * Trackerz Class
 *
 * @package Trackerz
 */

namespace Trackerz;

class Trackerz {

  /**
   * Instância única do plugin.
   *
   * @var Trackerz
   */
  private static $instance;

  /**
   * Retorna a instância única do plugin.
   *
   * @return Trackerz Instância do plugin.
   */
  public static function get_instance() {
    if ( null === self::$instance ) {
      self::$instance = new self();
    }

    return self::$instance;
  }

  /**
   * Construtor da classe.
   */
  private function __construct() {

    // Inicializa as configurações do plugin
    add_action( 'init', array( $this, 'init_trackerz' ) );

    // Adiciona uma ação para a página de administração do plugin
    add_action( 'admin_menu', array( $this, 'trackerz_admin_menu' ) );

  }

  /**
   * Inicializa o plugin.
   */
  public function init_trackerz() {
    // Carrega os arquivos de tradução
    load_plugin_textdomain( 'trackerz', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
  }

  /**
   * Adiciona a página de administração do plugin ao menu.
   */
  public function trackerz_admin_menu() {
    add_options_page(
      __( 'Trackerz', 'trackerz' ),
      __( 'Trackerz', 'trackerz' ),
      'manage_options',
      'trackerz-settings',
      'trackerz_settings_page' // Chamada da função de renderização
    );
  }

}