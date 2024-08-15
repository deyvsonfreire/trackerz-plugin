<?php
/**
 * Plugin Name: Trackerz
 * Plugin URI:  https://www.sala5.com.br/trackerz
 * Description: Plugin de rastreamento avançado para WordPress, com integração ao Google Tag Manager, Facebook Pixel e API.
 * Version:     1.0.8
 * Author:      Sala5 Digital
 * Author URI:  https://www.sala5.com.br
 * License:     GPLv2 or later
 * Text Domain: trackerz
 */

// Define o caminho para o diretório do plugin
define( 'TRACKERZ_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

// Carrega o arquivo de configurações do plugin
require_once TRACKERZ_PLUGIN_DIR . 'includes/trackerz-settings.php';

// Carrega a classe principal do plugin ANTES de tentar acessá-la
$class_file = TRACKERZ_PLUGIN_DIR . 'includes/trackerz-class.php';
if ( file_exists( $class_file ) ) {
    require_once $class_file;
} else {
    error_log( 'Trackerz class file not found: ' . $class_file );
    // Handle error appropriately, e.g., by showing an admin notice
}

// Inicializa a classe principal do plugin
Trackerz\Trackerz::get_instance(); // Updated to include namespace


/**
 * Adiciona os scripts JavaScript do Trackerz à página.
 */
function trackerz_enqueue_scripts() {
    // Enfileirar o script principal como um módulo
    wp_enqueue_script(
        'trackerz-script',
        plugins_url('assets/js/trackerz.js', __FILE__),
        array(),
        null, // Use null para não definir uma versão específica
        true // Coloca o script no final do body
    );

    // Enfileirar os outros scripts como módulos, se necessário
    wp_enqueue_script(
        'trackerz-events-script',
        plugins_url('assets/js/trackerz-events.js', __FILE__),
        array('trackerz-script'), // Dependência do script principal
        null,
        true
    );

    wp_enqueue_script(
        'trackerz-facebook-script',
        plugins_url('assets/js/trackerz-facebook.js', __FILE__),
        array('trackerz-script'),
        null,
        true
    );

    wp_enqueue_script(
        'trackerz-mask-script',
        plugins_url('assets/js/trackerz-mask.js', __FILE__),
        array('trackerz-script'),
        null,
        true
    );

    wp_enqueue_script(
        'trackerz-utils-script',
        plugins_url('assets/js/trackerz-utils.js', __FILE__),
        array('trackerz-script'),
        null,
        true
    );

    // Adicionando o tipo de módulo
    add_filter('script_loader_tag', 'add_type_attribute', 10, 2);
}

function add_type_attribute($tag, $handle) {
    if ('trackerz-script' === $handle || 
        'trackerz-events-script' === $handle || 
        'trackerz-facebook-script' === $handle || 
        'trackerz-mask-script' === $handle || 
        'trackerz-utils-script' === $handle) {
        return str_replace(' src', ' type="module" src', $tag);
    }
    return $tag;
}

/**
 * Adiciona os estilos CSS do Trackerz à página.
 */
function trackerz_enqueue_styles() {
    wp_enqueue_style(
        'trackerz-style',
        plugins_url('assets/css/trackerz.css', __FILE__),
        array(),
        '1.0.0'
    );
}

add_action( 'wp_enqueue_scripts', 'trackerz_enqueue_scripts' );
