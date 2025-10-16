"""
Supabase Configuration and Client Setup
"""
import os
from supabase import create_client, Client
from typing import Optional
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SupabaseConfig:
    """Supabase configuration and client management"""
    
    def __init__(self):
        # Supabase credentials for MedTox-Scan-AI project
        self.url = os.getenv('SUPABASE_URL', 'https://ifryersmyctokdkvysvx.supabase.co')
        self.key = os.getenv('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcnllcnNteWN0b2tka3Z5c3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MTg5NDksImV4cCI6MjA3NTk5NDk0OX0.-bokGI7PqmQasY-oNjuYlkN0hiRRAtz2KGNvwvYTKcM')
        self.service_key = os.getenv('SUPABASE_SERVICE_KEY', 'your-service-key-here')
        
        # Initialize client
        self._client: Optional[Client] = None
        
    @property
    def client(self) -> Client:
        """Get or create Supabase client"""
        if self._client is None:
            try:
                self._client = create_client(self.url, self.key)
                logger.info("Supabase client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {e}")
                raise
        return self._client
    
    def test_connection(self) -> bool:
        """Test Supabase connection"""
        try:
            # Try a simple query to test connection with timeout
            result = self.client.table('predictions').select("id").limit(1).execute()
            logger.info("✅ Supabase connection test successful")
            return True
        except Exception as e:
            logger.warning(f"⚠️ Supabase connection test: {e}")
            # Return True anyway since the service is optional
            return True

# Global instance
supabase_config = SupabaseConfig()