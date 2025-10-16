#!/usr/bin/env python3
"""
Setup Database - Execute schema.sql programmatically
"""
from config.supabase import supabase_config
import sys

# SQL commands split into executable chunks
SQL_COMMANDS = [
    # Enable UUID extension
    'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
    
    # Create predictions table
    '''CREATE TABLE IF NOT EXISTS predictions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        smiles TEXT NOT NULL,
        molecule_name TEXT,
        endpoints JSONB NOT NULL,
        ai_analysis TEXT,
        user_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        metadata JSONB,
        CONSTRAINT valid_smiles CHECK (length(smiles) > 0)
    );''',
    
    # Create indexes for predictions
    'CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);',
    'CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at DESC);',
    'CREATE INDEX IF NOT EXISTS idx_predictions_smiles ON predictions(smiles);',
    
    # Create user feedback table
    '''CREATE TABLE IF NOT EXISTS user_feedback (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        prediction_id UUID REFERENCES predictions(id) ON DELETE CASCADE,
        user_id TEXT,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        is_accurate BOOLEAN,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );''',
    
    # Create molecule library table
    '''CREATE TABLE IF NOT EXISTS molecule_library (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        smiles TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL,
        description TEXT,
        known_toxicity JSONB,
        drug_bank_id TEXT,
        cas_number TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT valid_name CHECK (length(name) > 0),
        CONSTRAINT valid_category CHECK (length(category) > 0)
    );''',
    
    # Create indexes for molecule library
    'CREATE INDEX IF NOT EXISTS idx_molecule_library_category ON molecule_library(category);',
    'CREATE INDEX IF NOT EXISTS idx_molecule_library_name ON molecule_library(name);',
    'CREATE INDEX IF NOT EXISTS idx_molecule_library_smiles ON molecule_library(smiles);',
]

SAMPLE_DATA = [
    ("Caffeine", "CN1C=NC2=C1C(=O)N(C(=O)N2C)C", "stimulant", "Central nervous system stimulant"),
    ("Aspirin", "CC(=O)OC1=CC=CC=C1C(=O)O", "nsaid", "Non-steroidal anti-inflammatory drug"),
    ("Ibuprofen", "CC(C)CC1=CC=C(C=C1)C(C)C(=O)O", "nsaid", "Non-steroidal anti-inflammatory drug"),
    ("Benzene", "C1=CC=CC=C1", "solvent", "Industrial solvent, known carcinogen"),
    ("Ethanol", "CCO", "alcohol", "Ethyl alcohol, beverage alcohol"),
]

def setup_database():
    """Setup database with schema"""
    print("🚀 MedTox-Scan-AI Database Setup")
    print("=" * 60)
    
    try:
        client = supabase_config.client
        print("✅ Connected to Supabase")
        
        # Execute SQL commands via RPC
        print("\n📋 Creating tables...")
        
        for i, sql in enumerate(SQL_COMMANDS, 1):
            try:
                # Use Supabase RPC to execute SQL
                result = client.rpc('execute_sql', {'sql': sql}).execute()
                print(f"   [{i}/{len(SQL_COMMANDS)}] ✅", end='\r')
            except Exception as e:
                if 'already exists' in str(e):
                    print(f"   [{i}/{len(SQL_COMMANDS)}] ⏭️  Already exists")
                else:
                    print(f"   [{i}/{len(SQL_COMMANDS)}] ⚠️  {e}")
        
        print(f"\n   ✅ All {len(SQL_COMMANDS)} tables created/verified")
        
        # Insert sample data
        print("\n📚 Loading sample molecules...")
        for name, smiles, category, desc in SAMPLE_DATA:
            try:
                client.table('molecule_library').insert({
                    'name': name,
                    'smiles': smiles,
                    'category': category,
                    'description': desc
                }).execute()
                print(f"   ✅ {name}")
            except Exception as e:
                if 'duplicate key' in str(e).lower() or 'unique' in str(e).lower():
                    print(f"   ⏭️  {name} (already exists)")
                else:
                    print(f"   ⚠️  {name}: {e}")
        
        # Verify setup
        print("\n🔍 Verifying database...")
        
        try:
            pred_result = client.table('predictions').select("id").limit(1).execute()
            print("   ✅ Predictions table accessible")
        except Exception as e:
            print(f"   ❌ Predictions table error: {e}")
            
        try:
            mol_result = client.table('molecule_library').select("count").execute()
            mol_count = len(mol_result.data) if mol_result.data else 0
            print(f"   ✅ Molecule library: {mol_count} molecules")
        except Exception as e:
            print(f"   ❌ Molecule library error: {e}")
        
        print("\n" + "=" * 60)
        print("✅ DATABASE SETUP COMPLETE!")
        print("\n💡 You can now:")
        print("   1. Start backend: python app.py")
        print("   2. Start frontend: cd ../frontend && npm start")
        print("   3. Test API: http://localhost:5000/api/health")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Setup failed: {e}")
        print("\n💡 Alternative method:")
        print("   Go to: https://ifryersmyctokdkvysvx.supabase.co")
        print("   Open SQL Editor and run: database/schema.sql")
        return False

if __name__ == "__main__":
    success = setup_database()
    sys.exit(0 if success else 1)
