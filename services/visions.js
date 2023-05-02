import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = 'AIzaSyDQQeg_681xsQemCt4EVhmSKDiC8ZX-JLc';

async function analyzeImage(base64Image) {
  try {
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image,
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                },
              ],
            },
          ],
        }),
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

export default { analyzeImage };
