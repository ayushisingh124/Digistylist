"""
Outfit Generation Engine
Rule-based outfit combination and recommendation
"""

import random
from datetime import datetime, timedelta
from typing import Optional, List, Dict


class OutfitEngine:
    """Generates outfit combinations using rule-based matching"""
    
    # Color harmony rules
    NEUTRAL_COLORS = {'white', 'black', 'gray', 'beige', 'cream', 'tan', 'navy'}
    
    COMPLEMENTARY_PAIRS = {
        'blue': ['orange', 'tan', 'cream'],
        'red': ['green', 'gray'],
        'green': ['red', 'pink'],
        'yellow': ['purple', 'navy'],
        'purple': ['yellow', 'cream'],
        'orange': ['blue', 'navy'],
        'pink': ['green', 'gray'],
        'navy': ['white', 'cream', 'tan', 'orange'],
        'brown': ['blue', 'cream', 'white'],
    }
    
    # Style compatibility matrix
    STYLE_COMPATIBILITY = {
        'casual': ['casual', 'sporty', 'streetwear'],
        'formal': ['formal'],
        'sporty': ['sporty', 'casual'],
        'streetwear': ['streetwear', 'casual', 'sporty'],
    }
    
    # Outfit descriptions based on style
    STYLE_DESCRIPTIONS = {
        'casual': [
            'easy, balanced, works today',
            'relaxed vibes, effortless style',
            'simple and clean look',
        ],
        'formal': [
            'polished and professional',
            'sharp and sophisticated',
            'dressed to impress',
        ],
        'sporty': [
            'active and ready to move',
            'comfortable with an edge',
            'athleisure done right',
        ],
        'streetwear': [
            'urban cool, street ready',
            'bold statement piece',
            'trendy and expressive',
        ],
    }
    
    STYLE_TAGS = {
        'casual': 'Clean Casual',
        'formal': 'Smart Formal',
        'sporty': 'Active Fit',
        'streetwear': 'Street Style',
    }
    
    def __init__(self):
        # Import here to avoid circular imports
        from app import db, ClothingItem, Outfit
        self.db = db
        self.ClothingItem = ClothingItem
        self.Outfit = Outfit
    
    def generate_daily_outfit(self) -> Optional[Dict]:
        """Generate today's outfit recommendation"""
        # Check if we already have an outfit for today
        today = datetime.utcnow().date()
        existing = self.Outfit.query.filter(
            self.Outfit.created_at >= datetime.combine(today, datetime.min.time())
        ).first()
        
        if existing:
            return self._outfit_to_response(existing)
        
        # Generate new outfit
        return self.generate_outfit()
    
    def generate_outfit(self, style_preference: Optional[str] = None) -> Optional[Dict]:
        """
        Generate a new outfit combination.
        
        Args:
            style_preference: Optional style to prefer (casual, formal, sporty)
        
        Returns:
            Outfit dictionary with items and metadata
        """
        # Get all wardrobe items grouped by category
        items_by_category = self._get_items_by_category()
        
        # Check minimum requirements
        if not items_by_category.get('tops') or not items_by_category.get('bottoms'):
            return None
        
        # Select items
        outfit_items = {}
        
        # Start with a top
        top = self._select_item(items_by_category['tops'], style_preference)
        if not top:
            return None
        outfit_items['top'] = top
        
        # Select matching bottom
        bottom = self._select_matching_item(
            items_by_category['bottoms'],
            top,
            style_preference
        )
        if not bottom:
            return None
        outfit_items['bottom'] = bottom
        
        # Select shoes
        if items_by_category.get('shoes'):
            shoes = self._select_matching_item(
                items_by_category['shoes'],
                top,
                style_preference,
                secondary_ref=bottom
            )
            outfit_items['shoes'] = shoes
        
        # Optional: Select layer
        if items_by_category.get('layers') and random.random() > 0.5:
            layer = self._select_matching_item(
                items_by_category['layers'],
                top,
                style_preference
            )
            outfit_items['layer'] = layer
        
        # Optional: Select accessory
        if items_by_category.get('accessories') and random.random() > 0.7:
            accessory = random.choice(items_by_category['accessories'])
            outfit_items['accessory'] = accessory
        
        # Determine overall style
        overall_style = self._determine_outfit_style(outfit_items)
        
        # Create outfit record
        outfit = self.Outfit(
            name=f"Outfit {datetime.now().strftime('%m/%d')}",
            style_tag=self.STYLE_TAGS.get(overall_style, 'Clean Casual'),
            description=random.choice(self.STYLE_DESCRIPTIONS.get(overall_style, self.STYLE_DESCRIPTIONS['casual'])),
            top_id=outfit_items.get('top', {}).get('id'),
            bottom_id=outfit_items.get('bottom', {}).get('id'),
            layer_id=outfit_items.get('layer', {}).get('id'),
            shoes_id=outfit_items.get('shoes', {}).get('id'),
            accessory_id=outfit_items.get('accessory', {}).get('id')
        )
        
        self.db.session.add(outfit)
        self.db.session.commit()
        
        return self._outfit_to_response(outfit, outfit_items)
    
    def _get_items_by_category(self) -> Dict[str, List]:
        """Get all wardrobe items grouped by category"""
        items = self.ClothingItem.query.all()
        by_category = {}
        
        for item in items:
            category = item.category
            if category not in by_category:
                by_category[category] = []
            by_category[category].append(item.to_dict())
        
        return by_category
    
    def _select_item(self, items: List[Dict], style_pref: Optional[str] = None) -> Optional[Dict]:
        """Select an item, preferring less recently worn"""
        if not items:
            return None
        
        # Filter by style if preference given
        if style_pref:
            matching = [i for i in items if i.get('style') == style_pref]
            if matching:
                items = matching
        
        # Sort by wear count (prefer less worn)
        items_sorted = sorted(items, key=lambda x: x.get('wearCount', 0))
        
        # Pick from top 3 least worn
        candidates = items_sorted[:min(3, len(items_sorted))]
        return random.choice(candidates)
    
    def _select_matching_item(
        self,
        items: List[Dict],
        reference_item: Dict,
        style_pref: Optional[str] = None,
        secondary_ref: Optional[Dict] = None
    ) -> Optional[Dict]:
        """Select an item that matches the reference item"""
        if not items:
            return None
        
        ref_color = reference_item.get('primaryColor', '').lower()
        ref_style = reference_item.get('style', 'casual')
        
        scored_items = []
        
        for item in items:
            score = 0
            item_color = item.get('primaryColor', '').lower()
            item_style = item.get('style', 'casual')
            
            # Color harmony scoring
            if item_color in self.NEUTRAL_COLORS:
                score += 3  # Neutrals always work
            elif ref_color in self.NEUTRAL_COLORS:
                score += 2  # Pairs well with neutral
            elif item_color in self.COMPLEMENTARY_PAIRS.get(ref_color, []):
                score += 4  # Complementary colors
            elif item_color == ref_color:
                score += 1  # Same color (monochrome)
            
            # Style compatibility
            if item_style in self.STYLE_COMPATIBILITY.get(ref_style, [ref_style]):
                score += 2
            
            # Style preference bonus
            if style_pref and item_style == style_pref:
                score += 1
            
            # Avoid recently worn
            if item.get('wearCount', 0) < 3:
                score += 1
            
            scored_items.append((item, score))
        
        # Sort by score descending
        scored_items.sort(key=lambda x: -x[1])
        
        # Pick from top candidates
        top_candidates = scored_items[:min(3, len(scored_items))]
        if top_candidates:
            return random.choice(top_candidates)[0]
        
        return random.choice(items)
    
    def _determine_outfit_style(self, outfit_items: Dict) -> str:
        """Determine the overall outfit style based on items"""
        styles = []
        
        for item in outfit_items.values():
            if item and item.get('style'):
                styles.append(item['style'])
        
        if not styles:
            return 'casual'
        
        # Most common style wins
        from collections import Counter
        most_common = Counter(styles).most_common(1)
        return most_common[0][0] if most_common else 'casual'
    
    def _outfit_to_response(self, outfit, items: Optional[Dict] = None) -> Dict:
        """Convert outfit to API response format"""
        if items is None:
            # Load items from database
            items = {}
            if outfit.top_id:
                top = self.ClothingItem.query.get(outfit.top_id)
                if top:
                    items['top'] = top.to_dict()
            if outfit.bottom_id:
                bottom = self.ClothingItem.query.get(outfit.bottom_id)
                if bottom:
                    items['bottom'] = bottom.to_dict()
            if outfit.layer_id:
                layer = self.ClothingItem.query.get(outfit.layer_id)
                if layer:
                    items['layer'] = layer.to_dict()
            if outfit.shoes_id:
                shoes = self.ClothingItem.query.get(outfit.shoes_id)
                if shoes:
                    items['shoes'] = shoes.to_dict()
            if outfit.accessory_id:
                accessory = self.ClothingItem.query.get(outfit.accessory_id)
                if accessory:
                    items['accessory'] = accessory.to_dict()
        
        return {
            'id': outfit.id,
            'name': outfit.name,
            'styleTag': outfit.style_tag,
            'description': outfit.description,
            'items': items,
            'createdAt': outfit.created_at.isoformat() if outfit.created_at else None,
            'isLiked': outfit.is_liked,
            'isSaved': outfit.is_saved
        }
