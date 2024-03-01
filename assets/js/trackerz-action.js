// Constantes com informações da página
const tkz_page_id = document.currentScript.getAttribute('data-page-id'); // ID da página
const tkz_page_name = document.currentScript.getAttribute('data-page-name'); // Nome da página

// Função para inicializar o Trackerz
async function initTrackerz() {
  // Cria uma nova instância do Trackerz
  window.trackerz = new Trackerz();

  // Configurações padrão do Trackerz
  const tkz_default_config = {
    domain: 'trackerz.local', // Domínio do backend
    api_lead: 'https://7fmzs0q0s6bdzqptazajc2nc.hooks.n8n.cloud/webhook/lead', // API de leads
    api_session: 'https://7fmzs0q0s6bdzqptazajc2nc.hooks.n8n.cloud/webhook/session', // API de sessões
    api_event: 'https://7fmzs0q0s6bdzqptazajc2nc.hooks.n8n.cloud/webhook/event', // API de eventos
    api_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    plugin_name: 'Trackerz', // Nome do plugin
    plugin_info: 'https://trackerz.local/', // URL de informações do plugin
    phone_country: '55', // Código do país para telefone
    phone_valid: true, // Se o número de telefone é válido
    phone_update: false, // Se o número de telefone precisa ser atualizado
    fb_js: 'https://connect.facebook.net/en_US/sdk.js', // URL do script do Facebook Pixel
    fb_pixel: '656427354872318', // ID do Facebook Pixel
    page_id: tkz_page_id, // ID da página
    page_title: tkz_page_name, // Título da página
    phone_mask: '+{55} (00) [9]0000-0000', // Máscara para o número de telefone
    phone_mask_js: 'https://trackerz.local/wp-content/plugins/trackerz-plugin/includes/assets/libs/imask/imask.js?version=1.0.23', // URL da biblioteca de máscara de telefone
  };

  // Combina as configurações padrão com as personalizadas da página (se houver)
  const tkz_config = { ...tkz_default_config, ...window.tkz_config };

  // Inicia o app com a configuração
  await window.trackerz.start(tkz_config).catch(error => {
    console.error('Erro ao iniciar Trackerz:', error);
  });



  // Envia um evento de "PageView"
  await window.trackerz.send_event({
    event_id: '',
    event_name: 'PageView',
    page_id: tkz_config.page_id,
    currency: 'BRL',
  });
}

// Adiciona um listener para o evento DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  // Carrega o script principal do Trackerz se necessário
  if (typeof Trackerz === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://trackerz.local/wp-content/plugins/trackerz-plugin/assets/js/trackerz-script.js';
    script.onload = async () => {
      await initTrackerz();
    };
    document.head.appendChild(script);
  } else {
    await initTrackerz();
  }
});

// Exporta as funções para uso em outros scripts
//export { initTrackerz, send_event };

