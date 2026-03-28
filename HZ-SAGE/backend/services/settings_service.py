import json
import os
from typing import Dict, Any

# Path to the config file relative to the backend root
CONFIG_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "config.json")

DEFAULT_SETTINGS = {
    "ai_model": "deepseek-chat",
    "ai_temperature": 0.1,
    "ai_max_tokens": 4096,
    "ui_theme": "dark",
    "ui_language": "zh",
    "security_token": "hz_sage_secure_token_2026",
    "system_version": "v1.2.4-stable"
}

def load_settings() -> Dict[str, Any]:
    """Load settings from config.json or return defaults if not exists."""
    if not os.path.exists(CONFIG_FILE):
        return DEFAULT_SETTINGS
    
    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            stored = json.load(f)
            # Merge stored settings with defaults to ensure all keys exist
            return {**DEFAULT_SETTINGS, **stored}
    except Exception:
        return DEFAULT_SETTINGS

def save_settings(new_settings: Dict[str, Any]) -> bool:
    """Save new settings to config.json."""
    try:
        current = load_settings()
        # Only update keys that exist in defaults or are expected
        current.update(new_settings)
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(current, f, indent=4, ensure_ascii=False)
        return True
    except Exception:
        return False

def get_setting(key: str) -> Any:
    """Convenience to fetch a single setting."""
    settings = load_settings()
    return settings.get(key, DEFAULT_SETTINGS.get(key))
