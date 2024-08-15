// trackerz-api.js

// Envia informações de lead para a API do Trackerz
async function sendLeadDataAPI(leadData) {
    // Preparando os dados para a API
    const apiData = {
      leadId: window.Trackerz.data.leadId,
      leadName: leadData.leadName,
      leadFname: leadData.leadFname,
      leadLname: leadData.leadLname,
      leadEmail: leadData.leadEmail,
      leadPhone: leadData.leadPhone,
      ip: window.Trackerz.data.geolocation?.trackerzLeadIp,
      device: window.Trackerz.data.userAgent,
      addressCity: window.Trackerz.data.geolocation?.trackerzLeadCity,
      addressState: window.Trackerz.data.geolocation?.trackerzLeadRegion,
      addressZipcode: window.Trackerz.data.geolocation?.trackerzLeadZipcode,
      addressCountryName: window.Trackerz.data.geolocation?.trackerzLeadCountry,
      addressCountry: window.Trackerz.data.geolocation?.trackerzLeadCountryCode,
      fbc: window.Trackerz.data.fbFbc,
      fbp: window.Trackerz.data.fbFbp,
      utmSource: window.Trackerz.data.utmSource,
      utmMedium: window.Trackerz.data.utmMedium,
      utmCampaign: window.Trackerz.data.utmCampaign,
      utmId: window.Trackerz.data.utmId,
      utmTerm: window.Trackerz.data.utmTerm,
      utmContent: window.Trackerz.data.utmContent,
      src: window.Trackerz.data.src,
      sck: window.Trackerz.data.sck
    };
  
    try {
      const response = await fetch(window.Trackerz.data.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      });
  
      if (response.ok) {
        // Tratar a resposta da API se necessário
        console.log("Dados do lead enviados com sucesso!");
      } else {
        // Tratar erro se a API não retornar 200
        console.error("Erro ao enviar dados do lead:", response.status);
      }
    } catch (error) {
      // Tratar erros de rede
      console.error("Erro na requisição:", error);
    }
  }
  
  // Envia eventos para a API do Trackerz
  async function sendEventDataAPI(eventData) {
    try {
      const response = await fetch(window.Trackerz.data.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });
  
      if (response.ok) {
        // Tratar a resposta da API se necessário
        console.log("Evento enviado com sucesso!");
      } else {
        // Tratar erro se a API não retornar 200
        console.error("Erro ao enviar evento:", response.status);
      }
    } catch (error) {
      // Tratar erros de rede
      console.error("Erro na requisição:", error);
    }
  }
  
  // Envia eventos para o Google Tag Manager
  async function sendEventToGTM(eventData) {
    // Adaptação para o GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventData);
  }
  
  // Envia eventos para o Mautic (se necessário)
  async function sendEventToMautic(eventData) {
    // Implementar a lógica para enviar dados para o Mautic, se necessário.
    // Isso pode envolver configurar uma integração com a API do Mautic.
    // Se não for possível usar a API, você pode usar o código JavaScript para
    // disparar um evento no Mautic, mas isso pode ser menos eficiente.
  
    console.log("Evento enviado para o Mautic:", eventData);
  }
  
  // Exporta as funções para uso em outros arquivos
  export {
    sendLeadDataAPI,
    sendEventDataAPI,
    sendEventToGTM,
    sendEventToMautic
  };