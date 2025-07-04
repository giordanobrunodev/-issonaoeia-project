from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import re
import random
import time
from datetime import datetime

analysis_bp = Blueprint('analysis', __name__)

def analyze_text_for_ai(text):
    """
    Simula análise de texto para detecção de IA.
    Em produção, seria substituído por um modelo real de ML.
    """
    # Simulação baseada em características do texto
    word_count = len(text.split())
    sentence_count = len(re.findall(r'[.!?]+', text))
    avg_sentence_length = word_count / max(sentence_count, 1)
    
    # Fatores que influenciam a pontuação
    factors = {
        'length': min(word_count / 100, 1.0),  # Textos mais longos tendem a ser mais humanos
        'sentence_variety': min(abs(avg_sentence_length - 15) / 10, 1.0),  # Variação natural
        'punctuation': len(re.findall(r'[,;:()]', text)) / max(word_count, 1),
        'complexity': len(re.findall(r'\b\w{7,}\b', text)) / max(word_count, 1)
    }
    
    # Cálculo da probabilidade humana (simulado)
    base_score = 50
    
    # Ajustes baseados nos fatores
    if factors['length'] > 0.3:
        base_score += 15
    if factors['sentence_variety'] < 0.5:
        base_score += 10
    if factors['punctuation'] > 0.05:
        base_score += 10
    if factors['complexity'] > 0.2:
        base_score += 15
    
    # Adiciona alguma aleatoriedade para simular incerteza
    human_probability = min(max(base_score + random.randint(-10, 10), 0), 100)
    confidence = random.randint(75, 95)
    
    return {
        'human_probability': human_probability,
        'confidence': confidence,
        'word_count': word_count,
        'sentence_count': sentence_count,
        'avg_sentence_length': round(avg_sentence_length, 1),
        'is_human': human_probability >= 80,
        'analysis_factors': factors
    }

@analysis_bp.route('/analyze', methods=['POST'])
@cross_origin()
def analyze_text():
    """Endpoint para análise de texto"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Texto não fornecido'}), 400
        
        text = data['text'].strip()
        
        if not text:
            return jsonify({'error': 'Texto vazio'}), 400
        
        if len(text) < 10:
            return jsonify({'error': 'Texto muito curto para análise'}), 400
        
        # Simula tempo de processamento
        time.sleep(1)
        
        # Realiza a análise
        result = analyze_text_for_ai(text)
        
        # Adiciona metadados
        result['timestamp'] = datetime.now().isoformat()
        result['text_preview'] = text[:100] + '...' if len(text) > 100 else text
        
        return jsonify({
            'success': True,
            'result': result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro interno: {str(e)}'
        }), 500

@analysis_bp.route('/health', methods=['GET'])
@cross_origin()
def health_check():
    """Endpoint para verificar saúde da API"""
    return jsonify({
        'status': 'healthy',
        'service': 'IssoNaoEIA Analysis API',
        'timestamp': datetime.now().isoformat()
    })

@analysis_bp.route('/stats', methods=['GET'])
@cross_origin()
def get_stats():
    """Endpoint para estatísticas do serviço"""
    return jsonify({
        'total_analyses': random.randint(1000, 5000),
        'human_texts_detected': random.randint(60, 80),
        'ai_texts_detected': random.randint(20, 40),
        'average_confidence': random.randint(85, 95)
    })

