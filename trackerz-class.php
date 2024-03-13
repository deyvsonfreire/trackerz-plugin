<?php

class Trackerz {

    public function __construct() {
        // Constructor
        add_action('init', array($this, 'init'));
    
        // Adiciona o script do Trackerz
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        
        // Define as constantes do plugin
        $this->define_constants();
        
        // Adiciona o script do Trackerz URL Builder após o DOM estar pronto
        add_action('wp_footer', array($this, 'enqueue_url_builder_script'));
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
        wp_enqueue_script('trackerz-action', plugins_url('/assets/js/trackerz-action.js', __FILE__), array('jquery'), '1.0', true);
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
        $table_name_1 = $wpdb->prefix . 'trackerz_lead'; 
        $table_name_2 = $wpdb->prefix . 'session_users';
    
        $charset_collate = $wpdb->get_charset_collate();
    
        // SQL query for the first table
        $sql_1 = "CREATE TABLE $table_name_1 (
                id mediumint(9) NOT NULL AUTO_INCREMENT,
                time datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
                lead_id mediumint(9) NOT NULL,
                lead_name varchar(255) NOT NULL,
                lead_fname varchar(255) NOT NULL,
                lead_lname varchar(255) NOT NULL,
                lead_email varchar(255) NOT NULL,
                lead_phone varchar(255) NOT NULL,
                ip varchar(255) NOT NULL,
                device varchar(255) NOT NULL,
                adress_city varchar(255) NOT NULL,
                adress_state varchar(255) NOT NULL,
                adress_zipcode varchar(255) NOT NULL,
                adress_country_name varchar(255) NOT NULL,
                adress_country varchar(255) NOT NULL,
                fbp varchar(255) NOT NULL,
                fbc varchar(255) NOT NULL,
                PRIMARY KEY  (id)
            ) $charset_collate;";
    
        // SQL query for the second table
        $sql_2 = "CREATE TABLE $table_name_2 (
                id mediumint(9) NOT NULL AUTO_INCREMENT,
                session_id varchar(255) NOT NULL,
                domain varchar(255) NOT NULL,
                page_url text NOT NULL,
                event_day_in_month int NOT NULL,
                event_day varchar(255) NOT NULL,
                event_month varchar(255) NOT NULL,
                event_time_interval varchar(255) NOT NULL,
                tkz_lead_ip varchar(255) NOT NULL,
                tkz_lead_city varchar(255) NOT NULL,
                tkz_lead_region varchar(255) NOT NULL,
                tkz_lead_country varchar(255) NOT NULL,
                tkz_lead_country_code varchar(255) NOT NULL,
                tkz_lead_currency varchar(255) NOT NULL,
                tkz_lead_zipcode varchar(255) NOT NULL,
                lead_id mediumint(9) NOT NULL,
                lead_name varchar(255) NOT NULL,
                lead_fname varchar(255) NOT NULL,
                lead_lname varchar(255) NOT NULL,
                lead_email varchar(255) NOT NULL,
                lead_phone varchar(255) NOT NULL,
                ip varchar(255) NOT NULL,
                device varchar(255) NOT NULL,
                adress_city varchar(255) NOT NULL,
                adress_state varchar(255) NOT NULL,
                adress_zipcode varchar(255) NOT NULL,
                adress_country_name varchar(255) NOT NULL,
                adress_country varchar(255) NOT NULL,
                PRIMARY KEY  (id)
            ) $charset_collate;";
    
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql_1);
        dbDelta($sql_2);
    }
    

    public static function deactivate() {
        // Add your plugin deactivation code here
        // E.g., remove database tables, options, etc.
    }

    public function enqueue_url_builder_script() {
        // Enfileira o script do Trackerz URL Builder após o DOM estar pronto
        wp_enqueue_script('trackerz-urlbuilder', TRACKERZ_URL . '/assets/js/trackerz-urlbuilder.js', array(), '1.0', true);
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
