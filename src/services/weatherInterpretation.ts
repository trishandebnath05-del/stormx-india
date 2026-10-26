export interface WeatherCodeInfo {
  label: string;
  hindiLabel: string;
  icon: string;
  description: string;
  category: 'clear' | 'cloudy' | 'fog' | 'rain' | 'storm' | 'snow';
  themeColor: string;
}

export function getWeatherCodeInfo(code: number, isDay: boolean = true): WeatherCodeInfo {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Clear Sky' : 'Clear Night',
        hindiLabel: isDay ? 'साफ़ आसमान' : 'साफ़ रात',
        icon: isDay ? 'Sun' : 'Moon',
        description: 'Bright sunshine with virtually no cloud cover',
        category: 'clear',
        themeColor: '#00E5FF'
      };
    case 1:
      return {
        label: isDay ? 'Mainly Sunny' : 'Mainly Clear',
        hindiLabel: isDay ? 'मुख्यतः धूप' : 'मुख्यतः साफ़',
        icon: isDay ? 'SunMedium' : 'MoonStar',
        description: 'Scattered light cirrus clouds with pleasant sunshine',
        category: 'clear',
        themeColor: '#38BDF8'
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        hindiLabel: 'आंशिक बादल',
        icon: isDay ? 'CloudSun' : 'CloudMoon',
        description: 'Passing cumulus clouds with frequent sunny intervals',
        category: 'cloudy',
        themeColor: '#60A5FA'
      };
    case 3:
      return {
        label: 'Overcast',
        hindiLabel: 'घने बादल',
        icon: 'Cloud',
        description: 'Continuous thick cloud cover across the horizon',
        category: 'cloudy',
        themeColor: '#94A3B8'
      };
    case 45:
      return {
        label: 'Fog / Mist',
        hindiLabel: 'कोहरा / धुंध',
        icon: 'CloudFog',
        description: 'Dense morning fog with reduced road visibility',
        category: 'fog',
        themeColor: '#CBD5E1'
      };
    case 48:
      return {
        label: 'Depositing Rime Fog',
        hindiLabel: 'सघन पाला कोहरा',
        icon: 'CloudFog',
        description: 'Freezing mist and heavy rime formation in hill stations',
        category: 'fog',
        themeColor: '#E2E8F0'
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Light Drizzle',
        hindiLabel: 'हल्की बूंदाबांदी',
        icon: 'CloudDrizzle',
        description: 'Gentle localized drizzle, minimal surface pooling',
        category: 'rain',
        themeColor: '#06B6D4'
      };
    case 61:
      return {
        label: 'Slight Rain',
        hindiLabel: 'धीमी बारिश',
        icon: 'CloudRain',
        description: 'Steady light rain shower across urban zones',
        category: 'rain',
        themeColor: '#0EA5E9'
      };
    case 63:
      return {
        label: 'Moderate Rain',
        hindiLabel: 'मध्यम बारिश',
        icon: 'CloudRain',
        description: 'Continuous monsoon rainfall with water runoff',
        category: 'rain',
        themeColor: '#2563EB'
      };
    case 65:
      return {
        label: 'Heavy Monsoon Rain',
        hindiLabel: 'भारी मानसूनी वर्षा',
        icon: 'CloudRainWind',
        description: 'Torrential downpour with potential localized waterlogging',
        category: 'rain',
        themeColor: '#3B82F6'
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Violent Rain Showers',
        hindiLabel: 'मूसलाधार फुहारें',
        icon: 'CloudLightning',
        description: 'Sudden high-intensity cloudburst / intense convection showers',
        category: 'rain',
        themeColor: '#8B5CF6'
      };
    case 95:
      return {
        label: 'Thunderstorm',
        hindiLabel: 'गरज के साथ तूफ़ान',
        icon: 'CloudLightning',
        description: 'Active squall with electrical lightning and gusty winds',
        category: 'storm',
        themeColor: '#F59E0B'
      };
    case 96:
    case 99:
      return {
        label: 'Severe Thunderstorm & Hail',
        hindiLabel: 'ओलावृष्टि और तीव्र तूफ़ान',
        icon: 'Zap',
        description: 'Severe convective storm with hail, damaging wind gusts and lightning',
        category: 'storm',
        themeColor: '#EF4444'
      };
    case 71:
    case 73:
    case 75:
      return {
        label: 'Snowfall',
        hindiLabel: 'बर्फबारी',
        icon: 'CloudSnow',
        description: 'Winter snowfall in Himalayan sectors',
        category: 'snow',
        themeColor: '#E0F2FE'
      };
    default:
      return {
        label: 'Variable Weather',
        hindiLabel: 'परिवर्तनशील मौसम',
        icon: 'CloudSun',
        description: 'Seasonal atmospheric conditions',
        category: 'cloudy',
        themeColor: '#00E5FF'
      };
  }
}
