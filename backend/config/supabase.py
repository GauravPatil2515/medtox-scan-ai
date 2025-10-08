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
        # Supabase credentials from environment
        self.url = os.getenv('SUPABASE_URL', 'https://iephgskjohhijlkaokeu.supabase.co')
        self.key = os.getenv('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllcGhnc2tqb2hoaWpsa2Fva2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjQzMTcsImV4cCI6MjA3NTM0MDMxN30.6Vgk7JTYGHsT8B-bBFvgRxahYj6BA_UslQ4T2-ZGoRA')
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
            # Try a simple query to test connection
            result = self.client.table('predictions').select("*").limit(1).execute()
            logger.info("Supabase connection test successful")
            return True
        except Exception as e:
            logger.error(f"Supabase connection test failed: {e}")
            return False

# Global instance
supabase_config = SupabaseConfig()