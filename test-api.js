// Test the API directly to see what's happening
const API_KEY = "64dbbac01db6ca5c41fefe0e061937a8";
const API_BASE = "https://v3.football.api-sports.io";

async function testAPI() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth()+1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const dateToday = `${yyyy}-${mm}-${dd}`;
  
  console.log('🗓️ Testing for date:', dateToday);
  
  const url = new URL(API_BASE + "/fixtures");
  url.searchParams.set("date", dateToday);
  url.searchParams.set("timezone", "America/Sao_Paulo");
  url.searchParams.set("country", "Brazil");
  
  console.log('🔗 API URL:', url.toString());
  
  try {
    const response = await fetch(url.toString(), {
      headers: {
        "x-apisports-key": API_KEY
      }
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.error('❌ API call failed:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    console.log('📦 Full API response:', JSON.stringify(data, null, 2));
    
    if (data.response && data.response.length > 0) {
      console.log('✅ Found', data.response.length, 'fixtures');
      console.log('🎮 First fixture:', JSON.stringify(data.response[0], null, 2));
    } else {
      console.log('⚠️ No fixtures found for today');
      
      // Test for tomorrow
      const tomorrow = new Date(today.getTime() + 86400000);
      const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth()+1).padStart(2,"0")}-${String(tomorrow.getDate()).padStart(2,"0")}`;
      console.log('🗓️ Testing for tomorrow:', tomorrowStr);
      
      url.searchParams.set("date", tomorrowStr);
      const tomorrowResponse = await fetch(url.toString(), {
        headers: { "x-apisports-key": API_KEY }
      });
      
      const tomorrowData = await tomorrowResponse.json();
      console.log('📦 Tomorrow fixtures:', tomorrowData.response?.length || 0);
    }
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

testAPI();