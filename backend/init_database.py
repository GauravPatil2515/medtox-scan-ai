#!/usr/bin/env python3
"""
Initialize Supabase Database with Schema
"""
from config.supabase import supabase_config
import sys

def init_database():
    """Initialize database tables"""
    print("🔧 Initializing MedTox-Scan-AI Database...")
    print("=" * 60)
    
    try:
        client = supabase_config.client
        print("✅ Connected to Supabase")
        
        # Test if predictions table exists
        try:
            result = client.table('predictions').select("id").limit(1).execute()
            print("✅ Predictions table exists")
        except Exception as e:
            print(f"⚠️ Predictions table not found: {e}")
            print("\n📋 Please run the schema.sql in your Supabase SQL Editor:")
            print("   Location: database/schema.sql")
            print("   URL: https://ifryersmyctokdkvysvx.supabase.co/project/default/sql")
            
        # Test if molecule_library table exists
        try:
            result = client.table('molecule_library').select("id").limit(1).execute()
            print("✅ Molecule library table exists")
        except Exception as e:
            print(f"⚠️ Molecule library table not found")
            
        print("\n" + "=" * 60)
        print("📊 Database Status:")
        print("   - Connection: ✅ Working")
        print("   - Tables: ⚠️  Need to be created via SQL Editor")
        print("\n💡 Next Steps:")
        print("   1. Go to: https://ifryersmyctokdkvysvx.supabase.co")
        print("   2. Open SQL Editor")
        print("   3. Copy and run database/schema.sql")
        print("   4. Run this script again to verify")
        
        return True
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        return False

if __name__ == "__main__":
    success = init_database()
    sys.exit(0 if success else 1)
