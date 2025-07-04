from flask import Blueprint, request, jsonify, send_file
from flask_cors import cross_origin
import qrcode
import uuid
from datetime import datetime
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
import io
import os

certificate_bp = Blueprint('certificate', __name__)

def generate_qr_code(certificate_id):
    """Gera QR code para verificação do certificado"""
    verification_url = f"https://issonaoeia.com/verify/{certificate_id}"
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(verification_url)
    qr.make(fit=True)
    
    qr_img = qr.make_image(fill_color="black", back_color="white")
    qr_buffer = io.BytesIO()
    qr_img.save(qr_buffer, format='PNG')
    qr_buffer.seek(0)
    return qr_buffer

def create_certificate_pdf(data):
    """Cria PDF do certificado"""
    buffer = io.BytesIO()
    
    # Configurações da página
    page_width, page_height = landscape(A4)
    c = canvas.Canvas(buffer, pagesize=landscape(A4))
    
    # Cores
    blue_color = HexColor('#2563EB')
    green_color = HexColor('#10B981')
    dark_color = HexColor('#1F2937')
    
    # Desenhar borda decorativa
    c.setStrokeColor(blue_color)
    c.setLineWidth(3)
    c.rect(30, 30, page_width-60, page_height-60)
    
    c.setLineWidth(1)
    c.rect(40, 40, page_width-80, page_height-80)
    
    # Título principal
    c.setFont("Helvetica-Bold", 36)
    c.setFillColor(blue_color)
    title_text = "SELO DE AUTENTICIDADE HUMANA"
    title_width = c.stringWidth(title_text, "Helvetica-Bold", 36)
    c.drawString((page_width - title_width) / 2, page_height - 120, title_text)
    
    # Subtítulo
    c.setFont("Helvetica", 16)
    c.setFillColor(green_color)
    subtitle_text = "Este certificado atesta que a seguinte análise de texto foi conduzida por um ser humano"
    subtitle_width = c.stringWidth(subtitle_text, "Helvetica", 16)
    c.drawString((page_width - subtitle_width) / 2, page_height - 160, subtitle_text)
    
    # Porcentagem de autenticidade
    c.setFont("Helvetica-Bold", 72)
    c.setFillColor(green_color)
    percentage_text = f"{data['human_probability']}%"
    percentage_width = c.stringWidth(percentage_text, "Helvetica-Bold", 72)
    c.drawString(150, page_height - 280, percentage_text)
    
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(blue_color)
    c.drawString(150, page_height - 310, "AUTENTICIDADE")
    
    # Informações do certificado
    c.setFont("Helvetica", 12)
    c.setFillColor(dark_color)
    
    info_y = page_height - 380
    c.drawString(150, info_y, f"Data de Verificação: {data['date']}")
    c.drawString(150, info_y - 20, f"ID do Certificado: {data['certificate_id']}")
    c.drawString(150, info_y - 40, f"Palavras Analisadas: {data['word_count']}")
    c.drawString(150, info_y - 60, f"Confiança da Análise: {data['confidence']}%")
    
    # Preview do texto (primeiras 100 caracteres)
    text_preview = data['text_preview']
    if len(text_preview) > 80:
        text_preview = text_preview[:80] + "..."
    
    c.drawString(150, info_y - 100, "Texto Analisado:")
    c.setFont("Helvetica-Oblique", 10)
    c.drawString(150, info_y - 120, f'"{text_preview}"')
    
    # QR Code (simulado como retângulo por simplicidade)
    qr_x = page_width - 200
    qr_y = page_height - 350
    c.setStrokeColor(dark_color)
    c.setLineWidth(1)
    c.rect(qr_x, qr_y, 120, 120)
    
    c.setFont("Helvetica", 10)
    c.drawString(qr_x, qr_y - 15, "QR Code para Verificação")
    
    # Rodapé
    c.setFont("Helvetica", 10)
    c.setFillColor(dark_color)
    footer_text = "IssoNaoEIA.com - Detector de Textos Gerados por IA"
    footer_width = c.stringWidth(footer_text, "Helvetica", 10)
    c.drawString((page_width - footer_width) / 2, 60, footer_text)
    
    c.save()
    buffer.seek(0)
    return buffer

@certificate_bp.route('/generate', methods=['POST'])
@cross_origin()
def generate_certificate():
    """Endpoint para gerar certificado"""
    try:
        data = request.get_json()
        
        if not data or 'analysis_result' not in data:
            return jsonify({'error': 'Dados de análise não fornecidos'}), 400
        
        analysis = data['analysis_result']
        
        # Verificar se é elegível para certificação
        if analysis.get('human_probability', 0) < 80:
            return jsonify({'error': 'Texto não elegível para certificação (< 80% humano)'}), 400
        
        # Gerar ID único do certificado
        certificate_id = str(uuid.uuid4())[:8].upper()
        
        # Dados do certificado
        cert_data = {
            'certificate_id': certificate_id,
            'human_probability': analysis['human_probability'],
            'confidence': analysis['confidence'],
            'word_count': analysis['word_count'],
            'text_preview': analysis.get('text_preview', ''),
            'date': datetime.now().strftime('%d/%m/%Y %H:%M')
        }
        
        # Gerar PDF
        pdf_buffer = create_certificate_pdf(cert_data)
        
        # Salvar temporariamente
        temp_filename = f"certificate_{certificate_id}.pdf"
        temp_path = os.path.join('/tmp', temp_filename)
        
        with open(temp_path, 'wb') as f:
            f.write(pdf_buffer.getvalue())
        
        return jsonify({
            'success': True,
            'certificate_id': certificate_id,
            'download_url': f'/api/certificate/download/{certificate_id}',
            'verification_url': f'https://issonaoeia.com/verify/{certificate_id}'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro ao gerar certificado: {str(e)}'
        }), 500

@certificate_bp.route('/download/<certificate_id>', methods=['GET'])
@cross_origin()
def download_certificate(certificate_id):
    """Endpoint para download do certificado"""
    try:
        temp_filename = f"certificate_{certificate_id}.pdf"
        temp_path = os.path.join('/tmp', temp_filename)
        
        if not os.path.exists(temp_path):
            return jsonify({'error': 'Certificado não encontrado'}), 404
        
        return send_file(
            temp_path,
            as_attachment=True,
            download_name=f"Selo_Autenticidade_Humana_{certificate_id}.pdf",
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({'error': f'Erro ao baixar certificado: {str(e)}'}), 500

@certificate_bp.route('/verify/<certificate_id>', methods=['GET'])
@cross_origin()
def verify_certificate(certificate_id):
    """Endpoint para verificar autenticidade do certificado"""
    # Em produção, isso consultaria um banco de dados
    return jsonify({
        'valid': True,
        'certificate_id': certificate_id,
        'issued_date': datetime.now().strftime('%d/%m/%Y'),
        'status': 'Válido',
        'issuer': 'IssoNaoEIA.com'
    })

@certificate_bp.route('/badge/<certificate_id>', methods=['GET'])
@cross_origin()
def get_badge(certificate_id):
    """Endpoint para obter selo/badge visual"""
    return jsonify({
        'badge_html': f'''
        <div style="display: inline-block; padding: 10px 20px; background: linear-gradient(135deg, #2563EB, #10B981); color: white; border-radius: 25px; font-family: Arial, sans-serif; font-weight: bold; text-align: center; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <div style="font-size: 12px;">✓ VERIFICADO</div>
            <div style="font-size: 14px;">HUMANO AUTÊNTICO</div>
            <div style="font-size: 10px; opacity: 0.8;">ID: {certificate_id}</div>
        </div>
        ''',
        'badge_url': f'https://issonaoeia.com/badge/{certificate_id}.png'
    })

