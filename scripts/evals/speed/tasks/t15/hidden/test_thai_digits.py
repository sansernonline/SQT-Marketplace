import text_utils


def test_all_digits():
    assert text_utils.thai_digits_to_arabic("๐๑๒๓๔๕๖๗๘๙") == "0123456789"


def test_mixed_text():
    assert text_utils.thai_digits_to_arabic("ราคา ๑,๒๐๐ บาท") == "ราคา 1,200 บาท"


def test_arabic_unchanged():
    assert text_utils.thai_digits_to_arabic("abc 42") == "abc 42"


def test_empty():
    assert text_utils.thai_digits_to_arabic("") == ""


def test_existing_functions_still_work():
    assert text_utils.squeeze_spaces("  a   b ") == "a b"
    assert text_utils.truncate("abcdef", 3) == "abc"
