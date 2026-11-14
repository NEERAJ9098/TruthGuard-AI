import json
import sqlite3
import datetime

DEMO_SEED_DATA = [
    {
        "input_type": "article",
        "title": "ISRO's Chandrayaan-3 Successfully Achieves Soft Landing on Moon's South Pole",
        "input_content": "India's Chandrayaan-3 has successfully soft-landed near the lunar south pole, making India the first nation to reach the rugged south polar region. The Pragyan rover has rolled out to begin scientific experiments.",
        "verdict": "LIKELY_REAL",
        "confidence_score": 94.0,
        "evidence_coverage": "HIGH",
        "summary": "Historic lunar exploration achievement by the Indian Space Research Organisation (ISRO). Chandrayaan-3 landed successfully on August 23, 2023, confirmed by international space agencies.",
        "reasoning": "Extensive international verification from space research organizations (NASA, ESA, ISRO) and global news services. Factual claims are fully supported by telemetry and independent radar tracking.",
        "limitations": "Model-estimated confidence. Rover exploration lifespan is restricted by the lunar night thermal cycle.",
        "claims": [
            "Chandrayaan-3 landed near the lunar south pole on August 23, 2023.",
            "India is the first nation to land in the lunar south polar region.",
            "The Pragyan rover was deployed to conduct in-situ scientific experiments."
        ],
        "suspicious_phrases": [],
        "supporting_evidence": [
            {
                "claim": "Successful landing on lunar south pole",
                "source": "NASA Science",
                "url": "https://science.nasa.gov/solar-system/moon/chandrayaan-3/",
                "stance": "SUPPORT",
                "snippet": "Chandrayaan-3 was the first spacecraft to land in the lunar south pole region.",
                "date": "2023-08-23"
            },
            {
                "claim": "Historic achievement reported globally",
                "source": "BBC News",
                "url": "https://www.bbc.com/news/world-asia-india-66594520",
                "stance": "SUPPORT",
                "snippet": "India makes history by becoming the first country to land a spacecraft near the south pole of the Moon.",
                "date": "2023-08-23"
            }
        ],
        "contradicting_evidence": [],
        "sources": [
            {"name": "NASA Science", "url": "https://science.nasa.gov", "reliability_tier": "High", "published_date": "2023-08-23"},
            {"name": "BBC News", "url": "https://www.bbc.com", "reliability_tier": "High", "published_date": "2023-08-23"},
            {"name": "ISRO Official Portal", "url": "https://www.isro.gov.in", "reliability_tier": "High", "published_date": "2023-08-23"}
        ],
        "ml_prediction": {
            "model_name": "TF-IDF + Logistic Regression",
            "style_label": "STANDARD JOURNALISTIC STYLE",
            "sensationalism_score": 8.5,
            "fake_style_probability": 0.085,
            "real_style_probability": 0.915,
            "model_description": "Linguistic writing-style classifier (secondary signal, not truth verdict)"
        },
        "fact_check_matches": [],
        "news_search_matches": [
            {"title": "Chandrayaan-3 Moon Landing", "source": "BBC News", "published_date": "2023-08-23"}
        ]
    },
    {
        "input_type": "headline",
        "title": "SHOCKING: Drinking Boiled Lemon Water Cures Cancer in 48 Hours - Big Pharma Terrified!",
        "input_content": "SHOCKING MIRACLE CURE: Doctors are furious! Drinking boiled lemon water with baking soda destroys 100% of cancer cells 10,000 times faster than chemo! Share before it gets deleted by the deep state!",
        "verdict": "LIKELY_FAKE",
        "confidence_score": 95.0,
        "evidence_coverage": "HIGH",
        "summary": "Viral social media hoax claiming hot lemon water or baking soda acts as a 100% cure for malignant tumors, supposedly concealed by the pharmaceutical industry.",
        "reasoning": "Debunked by multiple certified medical fact-checkers (Reuters, Snopes, Cancer Research UK). The claim lacks oncological evidence and exhibits high emotional manipulation, hyperbolic assertions, and conspiratorial tropes.",
        "limitations": "Model-estimated confidence. Consult certified healthcare oncologists for medical guidance.",
        "claims": [
            "Hot lemon water kills cancer cells 10,000 times stronger than chemotherapy.",
            "Consuming lemon water cures all cancer within 48 hours.",
            "Mainstream medical providers are suppressing this remedy."
        ],
        "suspicious_phrases": [
            "SHOCKING", "MIRACLE CURE", "100% of cancer cells",
            "Doctors are furious", "Share before it gets deleted", "Big Pharma Terrified"
        ],
        "supporting_evidence": [],
        "contradicting_evidence": [
            {
                "claim": "Hot lemon water cures cancer",
                "source": "Snopes Fact Check",
                "url": "https://www.snopes.com/fact-check/lemon-cancer-cure/",
                "stance": "CONTRADICT",
                "snippet": "Claim that hot lemon water cures cancer is completely False. While lemons contain vitamins, they cannot eradicate malignant tumors.",
                "date": "2020-05-12"
            },
            {
                "claim": "Kills cancer cells faster than chemo",
                "source": "Reuters Fact Check",
                "url": "https://www.reuters.com/article/idUSKBN22P2E5/",
                "stance": "CONTRADICT",
                "snippet": "No clinical evidence supports that drinking hot lemon water replaces or outperforms standard chemotherapy protocols.",
                "date": "2020-05-13"
            }
        ],
        "sources": [
            {"name": "Snopes", "url": "https://www.snopes.com", "reliability_tier": "High", "published_date": "2020-05-12"},
            {"name": "Reuters Health", "url": "https://www.reuters.com", "reliability_tier": "High", "published_date": "2020-05-13"}
        ],
        "ml_prediction": {
            "model_name": "TF-IDF + Logistic Regression",
            "style_label": "SENSATIONAL / CLICKBAIT STYLE",
            "sensationalism_score": 94.2,
            "fake_style_probability": 0.942,
            "real_style_probability": 0.058,
            "model_description": "Linguistic writing-style classifier (secondary signal, not truth verdict)"
        },
        "fact_check_matches": [
            {"publisher": "Snopes", "textual_rating": "False"}
        ],
        "news_search_matches": []
    },
    {
        "input_type": "article",
        "title": "Viral Posts Claim 5G Wireless Mobile Towers Responsible for Spread of Coronavirus",
        "input_content": "Social media rumors suggest that newly constructed 5G radio masts emit high-frequency electromagnetic radiation that suppresses human immune systems and causes coronavirus symptoms.",
        "verdict": "LIKELY_FAKE",
        "confidence_score": 91.0,
        "evidence_coverage": "HIGH",
        "summary": "Pervasive telecommunications conspiracy theory linking 5G cellular frequencies to viral biological outbreaks.",
        "reasoning": "Broadband radio waves are non-ionizing and biologically incapable of generating or transmitting microbiological pathogens. Rigorously disproven by WHO, FCC, and global public health institutions.",
        "limitations": "Model-estimated confidence. Disproved by biological physics and epidemiologic data.",
        "claims": [
            "5G millimeter waves transmit biological viruses.",
            "Electromagnetic radiation weakened respiratory immunity during pandemic."
        ],
        "suspicious_phrases": [
            "5G radiation causes virus", "secret frequency damage"
        ],
        "supporting_evidence": [],
        "contradicting_evidence": [
            {
                "claim": "5G causes coronavirus",
                "source": "BBC Reality Check",
                "url": "https://www.bbc.com/news/52168096",
                "stance": "CONTRADICT",
                "snippet": "5G radio signals are non-ionizing radiation and cannot transmit a biological virus. COVID-19 spread in many nations without any 5G networks.",
                "date": "2020-04-03"
            },
            {
                "claim": "5G frequency suppression",
                "source": "PolitiFact",
                "url": "https://www.politifact.com/factchecks/2020/mar/19/facebook-posts/5g-has-nothing-do-coronavirus-outbreak/",
                "stance": "CONTRADICT",
                "snippet": "Rated 'Pants on Fire'. Radiation from wireless networks cannot create biological viruses.",
                "date": "2020-03-19"
            }
        ],
        "sources": [
            {"name": "BBC Reality Check", "url": "https://www.bbc.com", "reliability_tier": "High", "published_date": "2020-04-03"},
            {"name": "PolitiFact", "url": "https://www.politifact.com", "reliability_tier": "High", "published_date": "2020-03-19"}
        ],
        "ml_prediction": {
            "model_name": "TF-IDF + Logistic Regression",
            "style_label": "SENSATIONAL / CLICKBAIT STYLE",
            "sensationalism_score": 72.0,
            "fake_style_probability": 0.720,
            "real_style_probability": 0.280,
            "model_description": "Linguistic writing-style classifier (secondary signal, not truth verdict)"
        },
        "fact_check_matches": [
            {"publisher": "PolitiFact", "textual_rating": "Pants on Fire"}
        ],
        "news_search_matches": []
    },
    {
        "input_type": "article",
        "title": "Leaked Memo Claims Secret Subterranean Bio-Dome Discovered Under Himalayan Glaciers",
        "input_content": "An alleged internal geological survey memo claims scientists accidentally drilled into an artificial subterranean biosphere deep within the Himalayan mountain range containing unidentified bioluminescent vegetation.",
        "verdict": "UNVERIFIED",
        "confidence_score": 46.0,
        "evidence_coverage": "LOW",
        "summary": "Uncorroborated geological speculation alleging the discovery of an underground biosphere in the Himalayas.",
        "reasoning": "No verified scientific papers, geological institute releases, or independent research teams have documented this discovery. While the claim lacks substantiation, irresponsible labeling of novel claims without evidence is avoided.",
        "limitations": "Model-estimated confidence. Evidence is currently insufficient to either confirm or definitively disprove the report.",
        "claims": [
            "Geological drilling exposed an artificial biosphere beneath Himalayan glaciers.",
            "Unidentified bioluminescent flora found in underground cavern."
        ],
        "suspicious_phrases": ["leaked memo", "unidentified bioluminescent"],
        "supporting_evidence": [],
        "contradicting_evidence": [],
        "sources": [],
        "ml_prediction": {
            "model_name": "TF-IDF + Logistic Regression",
            "style_label": "SENSATIONAL / CLICKBAIT STYLE",
            "sensationalism_score": 58.0,
            "fake_style_probability": 0.58,
            "real_style_probability": 0.42,
            "model_description": "Linguistic writing-style classifier (secondary signal, not truth verdict)"
        },
        "fact_check_matches": [],
        "news_search_matches": []
    },
    {
        "input_type": "article",
        "title": "Alkaline Water Brand Claims 100% Protection Against Seasonal Influenza",
        "input_content": "A high-end bottled mineral water brand advertises that drinking 2 liters daily alters human blood pH to an alkaline state that allegedly prevents 100% of seasonal viral infections.",
        "verdict": "MIXED_OR_MISLEADING",
        "confidence_score": 74.0,
        "evidence_coverage": "MEDIUM",
        "summary": "Commercial marketing campaign combining factual hydration benefits with scientifically invalid claims about human systemic pH alteration.",
        "reasoning": "While adequate hydration is medically beneficial for overall immune function, human blood pH is tightly regulated by kidneys and lungs and cannot be altered by drinking alkaline water. The marketing exaggerates modest wellness benefits into impossible antiviral immunity.",
        "limitations": "Model-estimated confidence. General wellness products should not be conflated with clinical prophylactic therapeutics.",
        "claims": [
            "Drinking alkaline water raises systemic blood pH.",
            "Higher bodily alkalinity prevents seasonal viral infections completely."
        ],
        "suspicious_phrases": ["100% protection", "alters blood pH"],
        "supporting_evidence": [
            {
                "claim": "Adequate hydration supports immune health",
                "source": "Mayo Clinic",
                "url": "https://www.mayoclinic.org",
                "stance": "SUPPORT",
                "snippet": "Hydration is essential for optimal physiological operation and cellular resilience.",
                "date": "2023-01-10"
            }
        ],
        "contradicting_evidence": [
            {
                "claim": "Drinking water changes blood pH",
                "source": "Cleveland Clinic",
                "url": "https://health.clevelandclinic.org",
                "stance": "CONTRADICT",
                "snippet": "The body maintains blood pH between 7.35 and 7.45 through respiratory and renal regulation. Dietary alkaline water cannot alter blood pH.",
                "date": "2022-09-15"
            }
        ],
        "sources": [
            {"name": "Mayo Clinic", "url": "https://www.mayoclinic.org", "reliability_tier": "High", "published_date": "2023-01-10"},
            {"name": "Cleveland Clinic", "url": "https://health.clevelandclinic.org", "reliability_tier": "High", "published_date": "2022-09-15"}
        ],
        "ml_prediction": {
            "model_name": "TF-IDF + Logistic Regression",
            "style_label": "SENSATIONAL / CLICKBAIT STYLE",
            "sensationalism_score": 62.0,
            "fake_style_probability": 0.62,
            "real_style_probability": 0.38,
            "model_description": "Linguistic writing-style classifier (secondary signal, not truth verdict)"
        },
        "fact_check_matches": [],
        "news_search_matches": []
    }
]

def seed_sample_data_if_empty():
    from app.database import get_db
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM analysis_records")
        count = cursor.fetchone()[0]
        if count == 0:
            now = datetime.datetime.utcnow()
            for idx, item in enumerate(DEMO_SEED_DATA):
                created_at = (now - datetime.timedelta(hours=5 - idx)).strftime("%Y-%m-%d %H:%M:%S")
                cursor.execute("""
                    INSERT INTO analysis_records (
                        input_type, input_content, title, verdict, confidence_score,
                        evidence_coverage, summary, reasoning, limitations,
                        claims_json, suspicious_phrases_json, supporting_evidence_json,
                        contradicting_evidence_json, sources_json, ml_prediction_json,
                        fact_check_matches_json, news_search_matches_json,
                        ai_provider, is_demo, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    item["input_type"],
                    item["input_content"],
                    item["title"],
                    item["verdict"],
                    item["confidence_score"],
                    item["evidence_coverage"],
                    item["summary"],
                    item["reasoning"],
                    item["limitations"],
                    json.dumps(item["claims"]),
                    json.dumps(item["suspicious_phrases"]),
                    json.dumps(item["supporting_evidence"]),
                    json.dumps(item["contradicting_evidence"]),
                    json.dumps(item["sources"]),
                    json.dumps(item["ml_prediction"]),
                    json.dumps(item["fact_check_matches"]),
                    json.dumps(item["news_search_matches"]),
                    "Gemini 2.5 Flash",
                    0,
                    created_at
                ))
            conn.commit()
