// URL de redirecionamento - ALTERE AQUI
const REDIRECT_URL = ' https://glitchy.go2cloud.org/aff_c?offer_id=3582&aff_id=1497&source=tokvids';

// Handle click function
async function handleClick(event) {
  event.preventDefault();
  console.log('🚀 Botão clicado! Iniciando tracking...');
  
  const urlParams = new URLSearchParams(window.location.search);
  const ttclid = urlParams.get('ttclid');
  
  if (!ttclid) {
    console.warn('⚠️ ttclid não encontrado.');
  }

  // CLIENT-SIDE TRACKING (Backup)
  try {
    ttq.track('CompleteRegistration', {
      content_type: 'product',
      content_id: 'freecash-tiktok-rewards',
      value: 1.00,
      currency: 'USD'
    });
    
    ttq.track('Purchase', {
      content_type: 'product',
      content_id: 'freecash-tiktok-rewards',
      value: 1.00,
      currency: 'USD'
    });
    
    console.log('✅ Client-side tracking disparado');
  } catch (e) {
    console.warn('⚠️ Client-side tracking falhou:', e);
  }

  // SERVER-SIDE TRACKING (Principal)
  try {
    await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'CompleteRegistration',
        ttclid: ttclid,
        user_agent: navigator.userAgent,
        page_url: window.location.href,
        referrer_url: document.referrer
      })
    });

    const response = await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'Purchase',
        ttclid: ttclid,
        user_agent: navigator.userAgent,
        page_url: window.location.href,
        referrer_url: document.referrer
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Server-side tracking: SUCESSO', data);
    } else {
      console.error('❌ Server-side tracking: FALHOU', data.error);
    }
  } catch (error) {
    console.error('❌ Erro server-side:', error);
  }

  // Redirect após tracking
  setTimeout(() => {
    console.log('🔄 Redirecionando...');
    window.location.href = REDIRECT_URL;
  }, 800);
}
