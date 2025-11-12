"""
Groq AI Configuration and Client Setup
"""
import os
from groq import Groq
from typing import Optional, Dict, Any, List
import logging
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GroqConfig:
    """Groq AI configuration and client management"""
    
    def __init__(self):
        # Groq API configuration
        self.api_key = os.getenv('GROQ_API_KEY')
        self.default_model = os.getenv('AI_MODEL', 'llama3-8b-8192')
        
        # Validate required environment variables
        if not self.api_key:
            logger.warning("GROQ_API_KEY environment variable not set")
            
        # Initialize client
        self._client: Optional[Groq] = None
        
    @property
    def client(self) -> Groq:
        """Get or create Groq client"""
        if self._client is None:
            try:
                # Simple initialization with just API key (no extra params)
                self._client = Groq(
                    api_key=self.api_key
                )
                logger.info("Groq client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Groq client: {e}")
                # Create a mock client that returns fallback responses
                logger.warning("Using fallback mode for Groq responses")
                self._client = None
                raise e
        return self._client
    
    def chat_completion(self, 
                       messages: List[Dict[str, str]], 
                       model: Optional[str] = None,
                       temperature: float = 0.7,
                       max_tokens: int = 1024) -> str:
        """
        Generate chat completion using Groq AI with fallback
        """
        try:
            if self._client is None:
                # Try to initialize client
                self.client
            
            response = self.client.chat.completions.create(
                model=model or self.default_model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"Groq chat completion failed: {e}")
            # Return a fallback response based on the message content
            user_message = messages[-1]['content'].lower() if messages else ""
            
            if "molecular structure" in user_message and "toxicity" in user_message:
                return """**How Molecular Structure Affects Toxicity** 🧬

Molecular structure is a fundamental determinant of toxicity through several key mechanisms:

**🔗 Structure-Activity Relationships (SAR):**
• **Functional Groups**: Certain groups (e.g., nitro, aromatic amines) are associated with toxicity
• **Stereochemistry**: Different isomers can have vastly different toxic effects
• **Size & Shape**: Molecular dimensions affect target binding and cellular uptake

**⚡ Key Structural Factors:**
• **Lipophilicity**: Affects membrane permeability and bioaccumulation
• **Electrophilicity**: Reactive molecules can form covalent bonds with biomolecules
• **Aromaticity**: Aromatic compounds may undergo metabolic activation to toxic metabolites

**🎯 Specific Examples:**
• **Benzene rings**: Can lead to metabolic activation and DNA damage
• **Nitro groups**: Often associated with mutagenicity and carcinogenicity
• **Heavy atoms (Cl, Br, I)**: May increase toxicity through halogen bonding

**🔬 Computational Approaches:**
• QSAR models predict toxicity from molecular descriptors
• 3D-QSAR considers spatial arrangements
• AI models (like DrugTox-AI) analyze multiple structural features

**⚠️ Important Note:** Always consult toxicological databases and professional assessment for specific compounds."""
            
            elif "help" in user_message or "hello" in user_message:
                return """Hello! I'm your ChemBio AI assistant. I can help with:

🧬 **Molecular Topics:**
• Structure-activity relationships
• Drug mechanisms and interactions
• Chemical properties and toxicity

🔬 **Toxicology:**
• Toxicity endpoints and assessment
• Risk evaluation methods
• Safety testing protocols

Ask me anything about chemistry, biology, or drug discovery!"""
            
            else:
                return f"""I understand you're asking about: "{user_message}"

While I'm experiencing some technical difficulties with my AI service, I can still help with chemistry and biology topics using my knowledge base.

**Topics I can assist with:**
• Molecular structures and drug mechanisms
• Toxicity endpoints and safety assessment
• Chemical reactions and biological processes
• SMILES notation and computational chemistry

Could you rephrase your question or ask about a specific aspect?"""
    
    def analyze_molecule(self, smiles: str, toxicity_results: Dict[str, Any]) -> str:
        """
        Analyze molecule toxicity using Groq AI
        
        Args:
            smiles: SMILES string of the molecule
            toxicity_results: Dictionary of toxicity prediction results
            
        Returns:
            AI-generated analysis
        """
        
        # Prepare context for AI analysis
        results_summary = []
        for endpoint, data in toxicity_results.items():
            results_summary.append(f"- {endpoint}: {data.get('prediction', 'Unknown')} "
                                 f"(Probability: {data.get('probability', 0):.2f}, "
                                 f"Confidence: {data.get('confidence', 0):.2f})")
        
        messages = [
            {
                "role": "system",
                "content": "You are an expert chemoinformatics AI specializing in toxicology and drug safety. "
                          "Provide detailed, scientific analysis of molecular toxicity predictions."
            },
            {
                "role": "user",
                "content": f"""
                Analyze the following molecular toxicity prediction results:
                
                Molecule SMILES: {smiles}
                
                Toxicity Endpoints Results:
                {chr(10).join(results_summary)}
                
                Please provide:
                1. Overall toxicity assessment
                2. Key structural features that may contribute to toxicity
                3. Recommended safety considerations
                4. Potential therapeutic implications
                5. Confidence in the predictions
                
                Keep the analysis scientific but accessible.
                """
            }
        ]
        
        return self.chat_completion(messages, temperature=0.3)
    
    def explain_endpoint(self, endpoint_id: str) -> str:
        """
        Get detailed explanation of a toxicity endpoint
        
        Args:
            endpoint_id: ID of the toxicity endpoint
            
        Returns:
            Detailed explanation
        """
        
        messages = [
            {
                "role": "system", 
                "content": "You are an expert in toxicology and pharmacology. Explain toxicity endpoints clearly and scientifically."
            },
            {
                "role": "user",
                "content": f"""
                Please explain the toxicity endpoint "{endpoint_id}" in detail. Include:
                1. What biological system/pathway it affects
                2. Why it's important for drug safety
                3. What happens when this endpoint is activated
                4. Clinical significance
                5. Common molecular features that affect this endpoint
                
                Make it scientific but understandable.
                """
            }
        ]
        
        return self.chat_completion(messages, temperature=0.2)

    def suggest_modifications(self, smiles: str, toxic_endpoints: List[str]) -> str:
        """
        Suggest molecular modifications to reduce toxicity
        
        Args:
            smiles: SMILES string of the molecule
            toxic_endpoints: List of endpoints showing toxicity
            
        Returns:
            AI-generated modification suggestions
        """
        
        messages = [
            {
                "role": "system",
                "content": "You are a medicinal chemist AI expert in structure-activity relationships and toxicity reduction."
            },
            {
                "role": "user", 
                "content": f"""
                The molecule with SMILES "{smiles}" shows toxicity in these endpoints: {', '.join(toxic_endpoints)}
                
                Please suggest structural modifications that could:
                1. Reduce toxicity in the problematic endpoints
                2. Maintain or improve desired biological activity
                3. Follow medicinal chemistry best practices
                4. Consider drug-like properties (Lipinski's Rule of Five)
                
                Provide specific, actionable suggestions with scientific rationale.
                """
            }
        ]
        
        return self.chat_completion(messages, temperature=0.4)

# Global instance
groq_config = GroqConfig()