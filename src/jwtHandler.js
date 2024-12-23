// jwtHandler.js

const JWTHandler = {
    allowedDomains: ['multivendor-seller-remake.vercel.app', 'localhost:3000'],
  
    validateDomain() {
      const currentDomain = window.location.hostname + 
        (window.location.port ? ':' + window.location.port : '');
      return this.allowedDomains.includes(currentDomain);
    },
  
    validateJWTFormat(jwt) {
      const parts = jwt.split('.');
      if (parts.length !== 3) return false;
  
      try {
        const payload = JSON.parse(atob(parts[1]));
        if (!payload.exp) return false;
  
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp > currentTime;
      } catch (error) {
        console.error('JWT validation error:', error);
        return false;
      }
    },
  
    checkExistingJWT() {
      try {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) return false;
        return this.validateJWTFormat(jwt);
      } catch (error) {
        console.error('Error checking existing JWT:', error);
        return false;
      }
    },
  
    handleJWTStorage(jwtParam) {
      try {
        // Store JWT
        localStorage.setItem('jwt', jwtParam);
  
        // Verify storage
        const storedJWT = localStorage.getItem('jwt');
        return storedJWT === jwtParam;
      } catch (error) {
        console.error('JWT storage error:', error);
        return false;
      }
    },
  
    cleanupURL() {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('jwt');
        window.history.replaceState({}, '', url.toString());
      } catch (error) {
        console.error('URL cleanup error:', error);
      }
    },
  
    initialize() {
      try {
        // Check domain validity
        if (!this.validateDomain()) {
          console.error('Invalid domain');
          return { success: false, error: 'Invalid domain' };
        }
  
        // Skip if valid JWT exists
        if (this.checkExistingJWT()) {
          return { success: true, message: 'Valid JWT already exists' };
        }
  
        // Get JWT from URL
        const url = new URL(window.location.href);
        const jwtParam = url.searchParams.get('jwt');
  
        if (!jwtParam) {
          return { success: false, error: 'No JWT token found in URL' };
        }
  
        // Validate JWT format
        if (!this.validateJWTFormat(jwtParam)) {
          return { success: false, error: 'Invalid JWT format' };
        }
  
        // Store JWT
        if (!this.handleJWTStorage(jwtParam)) {
          return { success: false, error: 'JWT storage failed' };
        }
  
        // Clean up URL
        this.cleanupURL();
  
        // Redirect to base URL
        window.location.href = '/';
  
        return { success: true };
  
      } catch (error) {
        console.error('Initialization error:', error);
        return { success: false, error: error.message };
      }
    }
  };
  
  export default JWTHandler;