"""ฟังก์ชันจัดการข้อความเล็ก ๆ ที่ใช้ซ้ำในโปรเจกต์"""


def squeeze_spaces(text: str) -> str:
    """ย่อช่องว่างติดกันให้เหลือช่องเดียว และตัดหัวท้าย"""
    return " ".join(text.split())


def truncate(text: str, limit: int) -> str:
    """ตัดข้อความให้ยาวไม่เกิน limit ตัวอักษร"""
    return text[:limit]
