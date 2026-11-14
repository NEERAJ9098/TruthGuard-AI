import sys
import os
import json
import requests

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.text_processor import TextProcessor
from app.services.ml_classifier import MLClassifierService
from app.services.url_extractor import URLExtractor

API_BASE = "http://127.0.0.1:8000"
FRONTEND_BASE = "http://127.0.0.1:5173"

def run_tests():
    passed = 0
    failed = 0
    errors = []

    def assert_test(condition, test_name, error_detail=""):
        nonlocal passed, failed, errors
        if condition:
            print(f"  [PASS] {test_name}")
            passed += 1
        else:
            print(f"  [FAIL] {test_name} - {error_detail}")
            failed += 1
            errors.append(f"{test_name}: {error_detail}")

    print("\n=======================================================")
    print("       TRUTHGUARD AI - SYSTEM VERIFICATION SUITE       ")
    print("=======================================================\n")

    # ----------------------------------------------------------------
    # 1. Unit Tests: Text Processing & Heuristic Forensics
    # ----------------------------------------------------------------
    print("[1] Testing TextProcessor...")
    raw_text = "   SHOCKING! Doctors are furious over this miracle cure! Click here.   "
    clean = TextProcessor.clean_text(raw_text)
    assert_test(clean == "SHOCKING! Doctors are furious over this miracle cure! Click here.", "Clean Text whitespace normalization")

    title, body = TextProcessor.extract_title_and_body(clean, is_headline_input=True)
    assert_test(len(title) > 0 and len(body) > 0, "Extract Title and Body")

    suspicious = TextProcessor.detect_suspicious_phrases(clean)
    assert_test(len(suspicious) >= 1 and any("SHOCKING" in s or "miracle" in s.lower() for s in suspicious), "Detect Suspicious / Clickbait Phrases")

    claims = TextProcessor.extract_heuristic_claims("A clinical study confirmed that 45 patients recovered completely.")
    assert_test(len(claims) >= 1, "Extract Heuristic Factual Claims")

    sens_score = TextProcessor.calculate_sensationalism_index(clean, suspicious)
    assert_test(sens_score > 30.0, "Sensationalism Index Calculation (>30 for clickbait)")

    # ----------------------------------------------------------------
    # 2. Unit Tests: ML Classifier (TF-IDF + Logistic Regression)
    # ----------------------------------------------------------------
    print("\n[2] Testing ML Classifier (TF-IDF + Logistic Regression)...")
    ml_service = MLClassifierService()

    fake_style = ml_service.predict_style("SHOCKING MIRACLE CURE: Big pharma hiding 100% cure for cancer! Doctors stunned!")
    assert_test(fake_style["style_label"] == "SENSATIONAL / CLICKBAIT STYLE", "ML: Classify Clickbait / Sensational Headline")
    assert_test(fake_style["sensationalism_score"] >= 50.0, "ML: Sensationalism score >= 50% for clickbait")

    real_style = ml_service.predict_style("The Ministry of Health published official quarterly clinical report on public immunization.")
    assert_test(real_style["style_label"] == "STANDARD JOURNALISTIC STYLE", "ML: Classify Standard Journalistic Headline")
    assert_test(real_style["sensationalism_score"] < 50.0, "ML: Sensationalism score < 50% for journalistic text")

    # ----------------------------------------------------------------
    # 3. Unit Tests: SSRF Security Validation
    # ----------------------------------------------------------------
    print("\n[3] Testing URL Extractor & SSRF Security...")
    safe_local, msg_local = URLExtractor.is_safe_url("http://127.0.0.1:8000/admin")
    assert_test(not safe_local, "SSRF: Block 127.0.0.1 loopback URL", msg_local)

    safe_localhost, msg_localhost = URLExtractor.is_safe_url("http://localhost:5000")
    assert_test(not safe_localhost, "SSRF: Block localhost hostname", msg_localhost)

    safe_private, msg_private = URLExtractor.is_safe_url("http://192.168.1.100/router")
    assert_test(not safe_private, "SSRF: Block private network IP (192.168.x.x)", msg_private)

    safe_proto, msg_proto = URLExtractor.is_safe_url("ftp://ftp.example.com/file")
    assert_test(not safe_proto, "SSRF: Block non-HTTP protocols (FTP/File)", msg_proto)

    # ----------------------------------------------------------------
    # 4. Integration Tests: Backend REST APIs
    # ----------------------------------------------------------------
    print("\n[4] Testing Backend REST APIs...")

    # Root
    try:
        r_root = requests.get(f"{API_BASE}/", timeout=5)
        assert_test(r_root.status_code == 200 and "TruthGuard" in r_root.json().get("system", ""), "GET / (Root API info)")
    except Exception as e:
        assert_test(False, "GET / (Root API info)", str(e))

    # Health
    try:
        r_health = requests.get(f"{API_BASE}/api/health", timeout=5)
        h_data = r_health.json()
        assert_test(r_health.status_code == 200 and h_data.get("status") == "healthy", "GET /api/health (Service Health)")
        assert_test("HackNova" in h_data.get("hackathon", ""), "Health: HackNova Bhopal 2K26 attribution")
    except Exception as e:
        assert_test(False, "GET /api/health", str(e))

    # Dashboard Stats
    try:
        r_stats = requests.get(f"{API_BASE}/api/dashboard/stats", timeout=5)
        s_data = r_stats.json()
        assert_test(r_stats.status_code == 200 and "total_analyzed" in s_data, "GET /api/dashboard/stats")
        assert_test(len(s_data.get("verdict_distribution", [])) == 4, "Stats: 4 verdict categories in distribution")
        assert_test(len(s_data.get("evidence_coverage_distribution", [])) == 4, "Stats: 4 evidence coverage tiers")
    except Exception as e:
        assert_test(False, "GET /api/dashboard/stats", str(e))

    # History
    created_id = None
    try:
        r_hist = requests.get(f"{API_BASE}/api/history", timeout=5)
        hist_data = r_hist.json()
        assert_test(r_hist.status_code == 200 and isinstance(hist_data, list), "GET /api/history (List past analyses)")
        if hist_data:
            created_id = hist_data[0]["id"]
    except Exception as e:
        assert_test(False, "GET /api/history", str(e))

    # History Detail by ID
    if created_id:
        try:
            r_detail = requests.get(f"{API_BASE}/api/history/{created_id}", timeout=5)
            d_data = r_detail.json()
            assert_test(r_detail.status_code == 200 and d_data.get("id") == created_id, f"GET /api/history/{created_id} (Detail view)")
            assert_test("confidence_score" in d_data and "verdict" in d_data, "History Detail: required schema fields present")
        except Exception as e:
            assert_test(False, f"GET /api/history/{created_id}", str(e))

    # Analyze API: Real News
    try:
        payload_real = {
            "text": "ISRO's Chandrayaan-3 successfully soft-landed near the lunar south pole on August 23, 2023.",
            "input_type": "article"
        }
        r_analyze_real = requests.post(f"{API_BASE}/api/analyze", json=payload_real, timeout=12)
        ar_data = r_analyze_real.json()
        assert_test(r_analyze_real.status_code == 200, "POST /api/analyze (Real news submission)")
        assert_test(ar_data.get("verdict") in ["LIKELY_REAL", "UNVERIFIED", "MIXED_OR_MISLEADING"], f"Analyze Real: verdict is {ar_data.get('verdict')}")
        assert_test("confidence_score" in ar_data and "evidence_coverage" in ar_data, "Analyze Real: confidence and coverage returned")
    except Exception as e:
        assert_test(False, "POST /api/analyze (Real news)", str(e))

    # Analyze API: Fake News Hoax
    try:
        payload_fake = {
            "text": "SHOCKING: Drinking boiled lemon water with baking soda cures 100% cancer in 48 hours! Doctors are furious!",
            "input_type": "headline"
        }
        r_analyze_fake = requests.post(f"{API_BASE}/api/analyze", json=payload_fake, timeout=12)
        af_data = r_analyze_fake.json()
        assert_test(r_analyze_fake.status_code == 200, "POST /api/analyze (Fake news submission)")
        assert_test(af_data.get("verdict") == "LIKELY_FAKE", f"Analyze Fake: identified as LIKELY_FAKE (got {af_data.get('verdict')})")
        assert_test(len(af_data.get("suspicious_phrases", [])) > 0, "Analyze Fake: flagged suspicious phrases")
    except Exception as e:
        assert_test(False, "POST /api/analyze (Fake news)", str(e))

    # Analyze API: Validation Error (<5 chars)
    try:
        r_val = requests.post(f"{API_BASE}/api/analyze", json={"text": "abc"}, timeout=5)
        assert_test(r_val.status_code == 422, "POST /api/analyze: Validation error on <5 chars (HTTP 422)")
    except Exception as e:
        assert_test(False, "POST /api/analyze: Validation error", str(e))

    # Analyze URL API: SSRF Rejection (HTTP 400)
    try:
        r_ssrf = requests.post(f"{API_BASE}/api/analyze-url", json={"url": "http://127.0.0.1:8000/internal"}, timeout=5)
        assert_test(r_ssrf.status_code == 400, "POST /api/analyze-url: SSRF block localhost (HTTP 400)")
    except Exception as e:
        assert_test(False, "POST /api/analyze-url: SSRF block", str(e))

    # ----------------------------------------------------------------
    # 5. Integration Tests: Frontend Dev Server
    # ----------------------------------------------------------------
    print("\n[5] Testing Frontend Server & Asset Bundling...")
    try:
        r_front = requests.get(f"{FRONTEND_BASE}/", timeout=5)
        assert_test(r_front.status_code == 200 and "TruthGuard AI" in r_front.text, "GET / (Frontend index.html loads with Title)")
    except Exception as e:
        assert_test(False, "GET / (Frontend index.html)", str(e))

    try:
        r_jsx = requests.get(f"{FRONTEND_BASE}/src/App.jsx", timeout=5)
        assert_test(r_jsx.status_code == 200 and "LandingPage" in r_jsx.text, "GET /src/App.jsx (React module served by Vite)")
    except Exception as e:
        assert_test(False, "GET /src/App.jsx", str(e))

    try:
        r_css = requests.get(f"{FRONTEND_BASE}/src/index.css", timeout=5)
        assert_test(r_css.status_code == 200 and "tailwind" in r_css.text.lower(), "GET /src/index.css (Tailwind styles served by Vite)")
    except Exception as e:
        assert_test(False, "GET /src/index.css", str(e))

    # ----------------------------------------------------------------
    # Summary
    # ----------------------------------------------------------------
    print("\n=======================================================")
    print(f" TOTAL TESTS: {passed + failed} | PASSED: {passed} | FAILED: {failed}")
    if failed == 0:
        print(" STATUS: ALL SYSTEMS 100% OPERATIONAL & VERIFIED!")
    else:
        print(" STATUS: ENCOUNTERED FAILURES:")
        for err in errors:
            print(f"   - {err}")
    print("=======================================================\n")
    return failed == 0

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
