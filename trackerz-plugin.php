<?php
/*
Plugin Name: Trackerz Plugin
Plugin URI: https://example.com/trackerz-plugin
Description: A plugin for optimizing campaign tracking on your WordPress site.
Version: 1.0.1
Author: Your Name
License: GPL
*/

if (!defined('ABSPATH')) {
    exit;
}



// Include the main plugin file
require_once(plugin_dir_path(__FILE__) . '/trackerz-class.php');

// Instantiate the Trackerz plugin
$trackerz_plugin = new Trackerz();

// Activation and deactivation hooks
register_activation_hook(__FILE__, array($trackerz_plugin, 'activate'));
register_deactivation_hook(__FILE__, array($trackerz_plugin, 'deactivate'));
