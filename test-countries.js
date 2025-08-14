// Test what countries are available in the API
const API_KEY = "64dbbac01db6ca5c41fefe0e061937a8";
const API_BASE = "https://v3.football.api-sports.io";

async function testCountries() {
  console.log('🌍 Getting available countries...');
  
  const url = API_BASE + "/countries";
  
  try {
    const response = await fetch(url, {
      headers: {
        "x-apisports-key": API_KEY
      }
    });
    
    if (!response.ok) {
      console.error('❌ Countries API call failed:', response.status);
      return;
    }
    
    const data = await response.json();
    console.log('📊 Countries response:', data);
    
    // Look for Brazil
    const countries = data.response || [];
    const brazilCountries = countries.filter(country => 
      country.name?.toLowerCase().includes('brazil') || 
      country.code?.toLowerCase().includes('br')
    );
    
    console.log('🇧🇷 Brazil-related countries:', brazilCountries);
    
    // Let's try some common variations
    const testCountries = ['Brazil', 'BR', 'brasil', 'BRA'];
    
    for (const country of testCountries) {
      console.log(`\n🧪 Testing country parameter: "${country}"`);
      
      const testUrl = new URL(API_BASE + "/fixtures");
      testUrl.searchParams.set("date", "2025-08-14");
      testUrl.searchParams.set("timezone", "America/Sao_Paulo");
      testUrl.searchParams.set("country", country);
      
      const testResponse = await fetch(testUrl.toString(), {
        headers: { "x-apisports-key": API_KEY }
      });
      
      const testData = await testResponse.json();
      console.log(`   Status: ${testResponse.status}`);
      console.log(`   Errors:`, testData.errors);
      console.log(`   Results: ${testData.results || 0}`);
    }
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

testCountries();