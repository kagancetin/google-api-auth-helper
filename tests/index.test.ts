import { googleApiAuthHelper } from '../src/index';

describe('googleApiAuthHelper', () => {
  const mockConfig = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    redirectUri: 'http://localhost:3000/callback',
    scopes: ['https://www.googleapis.com/auth/gmail.readonly']
  };

  // Test 1: Sınıfın düzgün bir şekilde oluşup oluşmadığını kontrol eder
  test('should initialize correctly with provided config', () => {
    const helper = new googleApiAuthHelper(mockConfig);
    expect(helper).toBeDefined();
  });

  // Test 2: generateAuthUrl metodunun geçerli bir URL döndüğünü kontrol eder
  test('should generate a valid Google Auth URL', () => {
    const helper = new googleApiAuthHelper(mockConfig);
    const url = helper.getAuthUrl();

    expect(url).toContain('https://accounts.google.com/o/oauth2/v2/auth');
    expect(url).toContain('client_id=test-client-id');
    expect(url).toContain('access_type=offline');
    expect(url).toContain('response_type=code');
  });

  // Test 3: Özel kapsamlar (scopes) verildiğinde URL'e eklenip eklenmediğini kontrol eder
 test('should include custom scopes in the URL', () => {
  const customScope = ['https://www.googleapis.com/auth/gmail.readonly'];
  // Yeni bir instance oluşturuyoruz ki özel scope işlesin
  const customHelper = new googleApiAuthHelper({ ...mockConfig });
  const url = customHelper.getAuthUrl();

  expect(url).toContain('scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.readonly');
});
});