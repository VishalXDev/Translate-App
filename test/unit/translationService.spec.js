// tests/unit/translationService.spec.js
import { translateText } from '@/services/translationService';

global.fetch = jest.fn();

describe('translateText', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return translated text on successful API call', async () => {
    const mockResponse = {
      responseStatus: 200,
      responseData: {
        translatedText: 'नमस्ते',
        match: 1.0
      }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await translateText('hello', 'hi');
    expect(result.success).toBe(true);
    expect(result.data.translatedText).toBe('नमस्ते');
  });

  it('should return empty translation for empty input', async () => {
    const result = await translateText('   ', 'hi');
    expect(result.success).toBe(true);
    expect(result.data.translatedText).toBe('');
  });

  it('should handle API-level errors', async () => {
    const mockResponse = {
      responseStatus: 403,
      responseDetails: 'Rate limit exceeded'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await translateText('hello', 'hi');
    expect(result.success).toBe(false);
    expect(result.error.type).toBe('api');
    expect(result.error.message).toMatch(/Rate limit exceeded/);
  });

  it('should handle HTTP errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    const result = await translateText('hello', 'hi');
    expect(result.success).toBe(false);
    expect(result.error.type).toBe('http');
    expect(result.error.message).toMatch(/500/);
  });

  it('should handle network errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network down'));

    const result = await translateText('hello', 'hi');
    expect(result.success).toBe(false);
    expect(result.error.type).toBe('network');
    expect(result.error.message).toMatch(/Network down/);
  });
});
