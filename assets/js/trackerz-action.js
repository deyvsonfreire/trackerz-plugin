function generateEventId() {
  const now = Date.now();
  const random_number = Math.floor(Math.random() * 1000000);
  const event_id = `${now}-${random_number}`;

  return event_id;
}

const event_id = generateEventId();
  //this.data.event_id = event_id // Inclua a event_id nos dados

// Adiciona um listener para o evento DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {

  // Constantes com informações da página
const tkz_page_id = document.querySelector('body').getAttribute('data-post-id'); // ID da página
const tkz_page_name = document.querySelector('title').textContent; // Nome da página

  const tkz_default_config = {
    domain: 'trackerz.local', // Domínio do backend
    api_lead: 'https://zqagprxarvxnbqirdstq.supabase.co/rest/v1/sessoes', // API de leads
    tkz_cliente_id: '5', // API de leads
    api_session: 'https://zqagprxarvxnbqirdstq.supabase.co/rest/v1/sessoes', // API de sessões
    api_event: 'https://7fmzs0q0s6bdzqptazajc2nc.hooks.n8n.cloud/webhook/u', // API de eventos
    fb_test_code: '',
    api_token: '',
    plugin_name: 'Trackerz', // Nome do plugin
    plugin_info: 'https://trackerz.local/', // URL de informações do plugin
    phone_country: '55', // Código do país para telefone
    phone_valid: true, // Se o número de telefone é válido
    phone_update: false, // Se o número de telefone precisa ser atualizado
    fb_js: 'https://connect.facebook.net/en_US/fbevents.js', // URL do script do Facebook Pixel
    fb_pixel: '656427354872318', // ID do Facebook Pixel
    page_id: tkz_page_id, // ID da página
    page_title: tkz_page_name, // Título da página
  };
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
  // Função para inicializar o Trackerz
  async function initTrackerz() {
    // Cria uma nova instância do Trackerz
    window.trackerz = new Trackerz();
    // Configurações padrão do Trackerz
    // Combina as configurações padrão com as personalizadas da página (se houver)
    const tkz_config = { ...tkz_default_config, ...window.tkz_config };
    // Inicia o app com a configuração
    await window.trackerz.start(tkz_config).catch(error => {
      console.error('Erro ao iniciar Trackerz:', error);
    });

    // Envia um evento de "PageView"
    await window.trackerz.send_event({
      event_id: event_id,
      event_name: 'PageView',
      page_id: tkz_page_id,
      page_title: tkz_page_name,
      currency: 'BRL',
    });
  }

});