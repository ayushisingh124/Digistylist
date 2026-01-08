"""
Digidrobe Backend - Flask API Server
AI-powered wardrobe management and outfit recommendations
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration - use absolute paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
UPLOAD_DIR = os.path.join(BASE_DIR, 'uploads')

# Ensure directories exist
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(DATA_DIR, "wardrobe.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_DIR
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# Initialize database
db = SQLAlchemy(app)


# ============== Models ==============

class ClothingItem(db.Model):
    """Represents a single clothing item in the wardrobe"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # tops, bottoms, layers, shoes, accessories
    primary_color = db.Column(db.String(50))
    secondary_color = db.Column(db.String(50))
    style = db.Column(db.String(50))  # casual, formal, sporty
    season = db.Column(db.String(50))  # summer, winter, all-season
    image_path = db.Column(db.String(255))
    is_favorite = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_worn = db.Column(db.DateTime)
    wear_count = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'primaryColor': self.primary_color,
            'secondaryColor': self.secondary_color,
            'style': self.style,
            'season': self.season,
            'imagePath': self.image_path,
            'isFavorite': self.is_favorite,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'lastWorn': self.last_worn.isoformat() if self.last_worn else None,
            'wearCount': self.wear_count
        }


class Outfit(db.Model):
    """Generated outfit combinations"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    style_tag = db.Column(db.String(50))  # e.g., "Clean Casual"
    description = db.Column(db.String(255))
    top_id = db.Column(db.Integer, db.ForeignKey('clothing_item.id'))
    bottom_id = db.Column(db.Integer, db.ForeignKey('clothing_item.id'))
    layer_id = db.Column(db.Integer, db.ForeignKey('clothing_item.id'))
    shoes_id = db.Column(db.Integer, db.ForeignKey('clothing_item.id'))
    accessory_id = db.Column(db.Integer, db.ForeignKey('clothing_item.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_liked = db.Column(db.Boolean, default=False)
    is_saved = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'styleTag': self.style_tag,
            'description': self.description,
            'topId': self.top_id,
            'bottomId': self.bottom_id,
            'layerId': self.layer_id,
            'shoesId': self.shoes_id,
            'accessoryId': self.accessory_id,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'isLiked': self.is_liked,
            'isSaved': self.is_saved
        }


# ============== Routes ==============

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'digidrobe-api'})


@app.route('/api/wardrobe', methods=['GET'])
def get_wardrobe():
    """Get all clothing items, optionally filtered by category"""
    category = request.args.get('category')
    
    query = ClothingItem.query
    if category and category != 'all':
        query = query.filter_by(category=category)
    
    items = query.order_by(ClothingItem.created_at.desc()).all()
    return jsonify([item.to_dict() for item in items])


@app.route('/api/wardrobe', methods=['POST'])
def add_clothing_item():
    """Add a new clothing item to the wardrobe"""
    data = request.json
    
    item = ClothingItem(
        name=data.get('name', 'Untitled'),
        category=data.get('category', 'tops'),
        primary_color=data.get('primaryColor'),
        secondary_color=data.get('secondaryColor'),
        style=data.get('style'),
        season=data.get('season'),
        image_path=data.get('imagePath')
    )
    
    db.session.add(item)
    db.session.commit()
    
    return jsonify(item.to_dict()), 201


@app.route('/api/wardrobe/<int:item_id>', methods=['GET'])
def get_clothing_item(item_id):
    """Get a specific clothing item"""
    item = ClothingItem.query.get_or_404(item_id)
    return jsonify(item.to_dict())


@app.route('/api/wardrobe/<int:item_id>', methods=['PUT'])
def update_clothing_item(item_id):
    """Update a clothing item"""
    item = ClothingItem.query.get_or_404(item_id)
    data = request.json
    
    if 'name' in data:
        item.name = data['name']
    if 'category' in data:
        item.category = data['category']
    if 'primaryColor' in data:
        item.primary_color = data['primaryColor']
    if 'secondaryColor' in data:
        item.secondary_color = data['secondaryColor']
    if 'style' in data:
        item.style = data['style']
    if 'season' in data:
        item.season = data['season']
    if 'isFavorite' in data:
        item.is_favorite = data['isFavorite']
    
    db.session.commit()
    return jsonify(item.to_dict())


@app.route('/api/wardrobe/<int:item_id>', methods=['DELETE'])
def delete_clothing_item(item_id):
    """Delete a clothing item"""
    item = ClothingItem.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item deleted'}), 200


@app.route('/api/process-image', methods=['POST'])
def process_image():
    """
    Process an uploaded clothing image:
    - Remove background
    - Detect category
    - Extract colors
    - Detect attributes
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Import processors lazily to speed up startup
    from services.image_processor import ImageProcessor
    
    processor = ImageProcessor()
    result = processor.process(file)
    
    return jsonify(result)


@app.route('/api/outfit/today', methods=['GET'])
def get_todays_outfit():
    """Get today's recommended outfit"""
    from services.outfit_engine import OutfitEngine
    
    engine = OutfitEngine()
    outfit = engine.generate_daily_outfit()
    
    if outfit:
        return jsonify(outfit)
    return jsonify({'error': 'Not enough items in wardrobe'}), 400


@app.route('/api/outfit/generate', methods=['POST'])
def generate_outfit():
    """Generate a new outfit recommendation"""
    from services.outfit_engine import OutfitEngine
    
    data = request.json or {}
    style = data.get('style')  # Optional style preference
    
    engine = OutfitEngine()
    outfit = engine.generate_outfit(style_preference=style)
    
    if outfit:
        return jsonify(outfit)
    return jsonify({'error': 'Could not generate outfit'}), 400


@app.route('/api/outfit/<int:outfit_id>/feedback', methods=['POST'])
def outfit_feedback(outfit_id):
    """Record user feedback on an outfit"""
    outfit = Outfit.query.get_or_404(outfit_id)
    data = request.json
    
    if 'liked' in data:
        outfit.is_liked = data['liked']
    if 'saved' in data:
        outfit.is_saved = data['saved']
    
    db.session.commit()
    return jsonify(outfit.to_dict())


@app.route('/api/outfit/history', methods=['GET'])
def get_outfit_history():
    """Get outfit history"""
    limit = request.args.get('limit', 20, type=int)
    outfits = Outfit.query.order_by(Outfit.created_at.desc()).limit(limit).all()
    return jsonify([outfit.to_dict() for outfit in outfits])


# ============== Startup ==============

with app.app_context():
    db.create_all()


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
