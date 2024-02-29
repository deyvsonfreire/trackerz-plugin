<?php

class Trackerz {

    public function __construct() {
        // Constructor
        add_action('init', array($this, 'init'));

        // Adiciona o script do Trackerz
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
    }


    public function define_constants(){
           define( 'TRACKERZ_PATH', plugin_dir_path(__FILE__));
           define( 'TRACKERZ_URL', plugin_dir_url(__FILE__));
        }

    public function init() {
        // Initialization code here
        add_shortcode('trackerz_shortcode', array($this, 'trackerz_shortcode'));

        add_action('wp_enqueue_scripts', array($this, 'enqueue_styles'));
        
        add_action('widgets_init', array($this, 'register_trackerz_widget'));
    }

    public function trackerz_shortcode($atts) {
        $atts = shortcode_atts(array(
            'text' => 'Click Here',
            'link' => '#'
        ), $atts, 'trackerz_shortcode');

        $output = '<a href="' . esc_url($atts['link']) . '" class="trackerz-button">' . esc_html($atts['text']) . '</a>';

        return $output;
    }

    public function enqueue_scripts() {
        // Enqueue Trackerz script
        wp_enqueue_script('trackerz-script', plugins_url('/assets/js/trackerz-script.js', __FILE__), array('jquery'), '1.0', true);
    }

    public function enqueue_styles() {
        // Enqueue Trackerz style
        wp_enqueue_style('trackerz-style', plugins_url('/assets/css/trackerz-style.css', __FILE__), array(), '1.0', 'all');
    }

    public function register_trackerz_widget() {
        register_widget('Trackerz_Widget');
    }

    public static function activate() {
        // Add your plugin activation code here
        // E.g., create database tables, set initial options, etc.

        global $wpdb;
        $table_name = $wpdb->prefix . 'trackerz_data'; 

        $sql = "CREATE TABLE $table_name (
                id mediumint(9) NOT NULL AUTO_INCREMENT,
                time datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
                event_name varchar(55) NOT NULL,
                event_data text NOT NULL,
                PRIMARY KEY  (id)
            );";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    public static function deactivate() {
        // Add your plugin deactivation code here
        // E.g., remove database tables, options, etc.
    }

}

// Widget Class
class Trackerz_Widget extends WP_Widget {

    public function __construct() {
        parent::__construct(
            'trackerz_widget',
            'Trackerz Widget',
            array('description' => 'A custom widget to display specific information.')
        );
    }

    public function widget($args, $instance) {
        // Widget output
    }

    public function update($new_instance, $old_instance) {
        // Update widget settings
    }

    public function form($instance) {
        // Widget settings form
    }

}

$trackerz_plugin = new Trackerz();

