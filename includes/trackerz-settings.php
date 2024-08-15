<?php
/**
 * Trackerz Settings
 *
 * @package Trackerz
 */

use Trackerz\Trackerz;

// Define o prefixo para as opções do plugin
define( 'TRACKERZ_SETTINGS_PREFIX', 'trackerz_' );

/**
 * Registra as configurações do plugin no WordPress.
 */
function trackerz_register_settings() {

  // Registra a seção de configurações do plugin
  register_setting(
    'trackerz_settings',
    'trackerz_settings' // Sem a função de sanitização
  );


  // Registra a seção de configurações gerais
  add_settings_section(
    'trackerz_general_settings',
    __( 'Configurações Gerais', 'trackerz' ),
    '__return_false',
    'trackerz_settings'
  );

  // Registra o campo de domínio do site
  add_settings_field(
    'trackerz_domain',
    __( 'Domínio do Site', 'trackerz' ),
    'trackerz_domain_callback',
    'trackerz_settings',
    'trackerz_general_settings'
  );

  // Registra o campo de ID do Facebook Pixel
  add_settings_field(
    'trackerz_fb_pixel',
    __( 'ID do Facebook Pixel', 'trackerz' ),
    'trackerz_fb_pixel_callback',
    'trackerz_settings',
    'trackerz_general_settings'
  );

  // Registra o campo de ID do Google Tag Manager
  add_settings_field(
    'trackerz_gtm_id',
    __( 'ID do Google Tag Manager', 'trackerz' ),
    'trackerz_gtm_id_callback',
    'trackerz_settings',
    'trackerz_general_settings'
  );

  // Registra o campo de endpoint da API do Mautic
  add_settings_field(
    'trackerz_mautic_endpoint',
    __( 'Endpoint da API do Mautic', 'trackerz' ),
    'trackerz_mautic_endpoint_callback',
    'trackerz_settings',
    'trackerz_general_settings'
  );

  // Registra o campo de endpoint da API do Trackerz
  add_settings_field(
    'trackerz_api_endpoint',
    __( 'Endpoint da API do Trackerz', 'trackerz' ),
    'trackerz_api_endpoint_callback',
    'trackerz_settings',
    'trackerz_general_settings'
  );

  // Registra o campo de habilitação da máscara de telefone
  add_settings_field(
    'trackerz_phone_mask_enabled',
    __( 'Habilitar Máscara de Telefone', 'trackerz' ),
    'trackerz_phone_mask_enabled_callback',
    'trackerz_settings',
    'trackerz_general_settings'
  );

  // Registra o campo de máscara de telefone
  add_settings_field(
    'trackerz_phone_mask',
    __( 'Máscara de Telefone', 'trackerz' ),
    'trackerz_phone_mask_callback',
    'trackerz_settings',
    'trackerz_general_settings'
  );

  // Registra o campo de habilitação da máscara internacional de telefone
  add_settings_field(
    'trackerz_phone_mask_inter_enabled',
    __( 'Habilitar Máscara Internacional de Telefone', 'trackerz' ),
    'trackerz_phone_mask_inter_enabled_callback',
    'trackerz_settings',
    'trackerz_general_settings'
  );

  // Registra o campo de máscara internacional de telefone
  add_settings_field(
    'trackerz_phone_mask_inter',
    __( 'Máscara Internacional de Telefone', 'trackerz' ),
    'trackerz_phone_mask_inter_callback',
    'trackerz_settings',
    'trackerz_general_settings'
  );

  // Registra o campo de URL do CSS da máscara internacional
  add_settings_field(
    'trackerz_phone_mask_inter_css',
    __( 'URL do CSS da Máscara Internacional', 'trackerz' ),
    'trackerz_phone_mask_inter_css_callback',
    'trackerz_settings',
    'trackerz_general_settings'
  );

  // Registra o campo de URL do JavaScript da máscara internacional
  add_settings_field(
    'trackerz_phone_mask_inter_js',
    __( 'URL do JavaScript da Máscara Internacional', 'trackerz' ),
    'trackerz_phone_mask_inter_js_callback',
    'trackerz_settings',
    'trackerz_general_settings'
  );

  // Registra o campo de ativação do GTM
  add_settings_field(
    'trackerz_gtm_enabled',
    __( 'Habilitar Google Tag Manager', 'trackerz' ),
    'trackerz_gtm_enabled_callback',
    'trackerz_settings',
    'trackerz_general_settings'
  );

  // Registra o campo de ativação do Mautic
  add_settings_field(
    'trackerz_mautic_enabled',
    __( 'Habilitar Mautic', 'trackerz' ),
    'trackerz_mautic_enabled_callback',
    'trackerz_settings',
    'trackerz_general_settings'
  );

  // Registra o campo de ativação da API do Trackerz
  add_settings_field(
    'trackerz_api_enabled',
    __( 'Habilitar API do Trackerz', 'trackerz' ),
    'trackerz_api_enabled_callback',
    'trackerz_settings',
    'trackerz_general_settings'
  );
}
add_action( 'admin_init', 'trackerz_register_settings' );

/**
 * Callback para a seção de configurações gerais.
 *
 * @param array $args Argumentos da seção.
 */
function trackerz_general_settings_callback( $args ) {
}

/**
 * Callback para o campo de domínio do site.
 *
 * @param array $args Argumentos do campo.
 */
function trackerz_domain_callback( $args ) {
  $domain = get_option( 'trackerz_domain' );
  ?>
  <input type="text" name="trackerz_settings[trackerz_domain]" value="<?php echo esc_attr( $domain ); ?>" />
  <?php
}

/**
 * Callback para o campo de ID do Facebook Pixel.
 *
 * @param array $args Argumentos do campo.
 */
function trackerz_fb_pixel_callback( $args ) {
  $fb_pixel = get_option( 'trackerz_fb_pixel' );
  ?>
  <input type="text" name="trackerz_settings[trackerz_fb_pixel]" value="<?php echo esc_attr( $fb_pixel ); ?>" />
  <?php
}

/**
 * Callback para o campo de ID do Google Tag Manager.
 *
 * @param array $args Argumentos do campo.
 */
function trackerz_gtm_id_callback( $args ) {
  $gtm_id = get_option( 'trackerz_gtm_id' );
  ?>
  <input type="text" name="trackerz_settings[trackerz_gtm_id]" value="<?php echo esc_attr( $gtm_id ); ?>" />
  <?php
}

/**
 * Callback para o campo de endpoint da API do Mautic.
 *
 * @param array $args Argumentos do campo.
 */
function trackerz_mautic_endpoint_callback( $args ) {
  $mautic_endpoint = get_option( 'trackerz_mautic_endpoint' );
  ?>
  <input type="text" name="trackerz_settings[trackerz_mautic_endpoint]" value="<?php echo esc_attr( $mautic_endpoint ); ?>" />
  <?php
}

/**
 * Callback para o campo de endpoint da API do Trackerz.
 *
 * @param array $args Argumentos do campo.
 */
function trackerz_api_endpoint_callback( $args ) {
  $api_endpoint = get_option( 'trackerz_api_endpoint' );
  ?>
  <input type="text" name="trackerz_settings[trackerz_api_endpoint]" value="<?php echo esc_attr( $api_endpoint ); ?>" />
  <?php
}

/**
 * Callback para o campo de habilitação da máscara de telefone.
 *
 * @param array $args Argumentos do campo.
 */
function trackerz_phone_mask_enabled_callback( $args ) {
  $phone_mask_enabled = get_option( 'trackerz_phone_mask_enabled' );
  ?>
  <input type="checkbox" name="trackerz_settings[trackerz_phone_mask_enabled]" value="1" <?php checked( $phone_mask_enabled, 1 ); ?> />
  <?php
}

/**
 * Callback para o campo de máscara de telefone.
 *
 * @param array $args Argumentos do campo.
 */
function trackerz_phone_mask_callback( $args ) {
  $phone_mask = get_option( 'trackerz_phone_mask' );
  ?>
  <input type="text" name="trackerz_settings[trackerz_phone_mask]" value="<?php echo esc_attr( $phone_mask ); ?>" />
  <?php
}

/**
 * Callback para o campo de habilitação da máscara internacional de telefone.
 *
 * @param array $args Argumentos do campo.
 */
function trackerz_phone_mask_inter_enabled_callback( $args ) {
  $phone_mask_inter_enabled = get_option( 'trackerz_phone_mask_inter_enabled' );
  ?>
  <input type="checkbox" name="trackerz_settings[trackerz_phone_mask_inter_enabled]" value="1" <?php checked( $phone_mask_inter_enabled, 1 ); ?> />
  <?php
}

/**
 * Callback para o campo de máscara internacional de telefone.
 *
 * @param array $args Argumentos do campo.
 */
function trackerz_phone_mask_inter_callback( $args ) {
  $phone_mask_inter = get_option( 'trackerz_phone_mask_inter' );
  ?>
  <input type="text" name="trackerz_settings[trackerz_phone_mask_inter]" value="<?php echo esc_attr( $phone_mask_inter ); ?>" />
  <?php
}

/**
 * Callback para o campo de URL do CSS da máscara internacional.
 *
 * @param array $args Argumentos do campo.
 */
function trackerz_phone_mask_inter_css_callback( $args ) {
  $phone_mask_inter_css = get_option( 'trackerz_phone_mask_inter_css' );
  ?>
  <input type="text" name="trackerz_settings[trackerz_phone_mask_inter_css]" value="<?php echo esc_attr( $phone_mask_inter_css ); ?>" />
  <?php
}

/**
 * Callback para o campo de URL do JavaScript da máscara internacional.
 *
 * @param array $args Argumentos do campo.
 */
function trackerz_phone_mask_inter_js_callback( $args ) {
  $phone_mask_inter_js = get_option( 'trackerz_phone_mask_inter_js' );
  ?>
  <input type="text" name="trackerz_settings[trackerz_phone_mask_inter_js]" value="<?php echo esc_attr( $phone_mask_inter_js ); ?>" />
  <?php
}

/**
 * Callback para o campo de ativação do GTM.
 *
 * @param array $args Argumentos do campo.
 */
function trackerz_gtm_enabled_callback( $args ) {
  $gtm_enabled = get_option( 'trackerz_gtm_enabled' );
  ?>
  <input type="checkbox" name="trackerz_settings[trackerz_gtm_enabled]" value="1" <?php checked( $gtm_enabled, 1 ); ?> />
  <?php
}

/**
 * Callback para o campo de ativação do Mautic.
 *
 * @param array $args Argumentos do campo.
 */
function trackerz_mautic_enabled_callback( $args ) {
  $mautic_enabled = get_option( 'trackerz_mautic_enabled' );
  ?>
  <input type="checkbox" name="trackerz_settings[trackerz_mautic_enabled]" value="1" <?php checked( $mautic_enabled, 1 ); ?> />
  <?php
}

/**
 * Callback para o campo de ativação da API do Trackerz.
 *
 * @param array $args Argumentos do campo.
 */
function trackerz_api_enabled_callback( $args ) {
  $api_enabled = get_option( 'trackerz_api_enabled' );
  ?>
  <input type="checkbox" name="trackerz_settings[trackerz_api_enabled]" value="1" <?php checked( $api_enabled, 1 ); ?> />
  <?php
}

/**
 * Função para obter o valor de uma opção do plugin.
 *
 * @param string $option_name Nome da opção.
 * @return mixed Valor da opção.
 */
function trackerz_get_option( $option_name ) {
  return get_option( TRACKERZ_SETTINGS_PREFIX . $option_name );
}

/**
 * Função para definir o valor de uma opção do plugin.
 *
 * @param string $option_name Nome da opção.
 * @param mixed  $value Valor da opção.
 * @return bool True se a opção foi definida com sucesso, false caso contrário.
 */
function trackerz_set_option( $option_name, $value ) {
  return update_option( TRACKERZ_SETTINGS_PREFIX . $option_name, $value );
}