"""
Core ATS scoring logic. No external API calls here - deterministic,
explainable scoring so the app works even without a Gemini API key.
"""
import re
from collections import Counter

STOPWORDS = set("""
a about above after again against all am an and any are aren't as at be
because been before being below between both but by can't cannot could
couldn't did didn't do does doesn't doing don't down during each few for
from further had hadn't has hasn't have haven't having he he'd he'll he's
her here here's hers herself him himself his how how's i i'd i'll i'm i've
if in into is isn't it it's its itself let's me more most mustn't my myself
no nor not of off on once only or other ought our ours ourselves out over
own same shan't she she'd she'll she's should shouldn't so some such than
that that's the their theirs them themselves then there there's these they
they'd they'll they're they've this those through to too under until up
very was wasn't we we'd we'll we're we've were weren't what what's when
when's where where's which while who who's whom why why's with won't would
wouldn't you you'd you'll you're you've your yours yourself yourselves
using use used via etc within across per new strong excellent great good
work team including responsible ability years experience role job company
""".split())

# A reasonably broad skills/tech dictionary used for skills-match and
# keyword-density features. Extend freely for your domain.
SKILLS_DICTIONARY = {
    # Languages
    'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'go', 'golang', 'ruby',
    'php', 'swift', 'kotlin', 'rust', 'scala', 'sql', 'r', 'matlab', 'bash', 'shell',
    # Web / frontend
    'react', 'react.js', 'vue', 'angular', 'next.js', 'redux', 'html', 'css', 'sass',
    'tailwind', 'bootstrap', 'vite', 'webpack', 'jquery', 'graphql', 'rest', 'restful',
    # Backend / frameworks
    'django', 'django rest framework', 'flask', 'fastapi', 'spring', 'spring boot',
    'express', 'node.js', 'nodejs', '.net', 'laravel', 'rails',
    # Data / ML
    'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'keras', 'nlp',
    'machine learning', 'deep learning', 'data analysis', 'data science', 'llm',
    'generative ai', 'computer vision', 'opencv',
    # Databases
    'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'sqlite', 'oracle',
    'elasticsearch', 'dynamodb', 'firebase',
    # DevOps / cloud
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'google cloud', 'ci/cd', 'jenkins',
    'terraform', 'ansible', 'linux', 'git', 'github', 'gitlab', 'nginx', 'microservices',
    # Testing
    'junit', 'pytest', 'selenium', 'jest', 'unit testing', 'integration testing',
    'test automation', 'postman',
    # Soft / PM skills
    'agile', 'scrum', 'kanban', 'jira', 'leadership', 'communication', 'project management',
    'stakeholder management', 'problem solving', 'teamwork', 'mentoring',
}

WORD_RE = re.compile(r"[a-zA-Z][a-zA-Z0-9+.#/-]{1,}")


def tokenize(text: str) -> list[str]:
    return [w.lower() for w in WORD_RE.findall(text or '')]


def extract_candidate_keywords(text: str, top_n: int = 30) -> list[str]:
    """Frequency-based keyword extraction, skills dictionary weighted higher."""
    tokens = [t for t in tokenize(text) if t not in STOPWORDS and len(t) > 2]
    counts = Counter(tokens)

    weighted = Counter()
    for word, count in counts.items():
        weight = 3 if word in SKILLS_DICTIONARY else 1
        weighted[word] = count * weight

    return [w for w, _ in weighted.most_common(top_n)]


def keyword_match(resume_text: str, jd_text: str, top_n: int = 25):
    jd_keywords = extract_candidate_keywords(jd_text, top_n=top_n)
    resume_tokens = set(tokenize(resume_text))

    matched = [kw for kw in jd_keywords if kw in resume_tokens]
    missing = [kw for kw in jd_keywords if kw not in resume_tokens]
    return matched, missing


def skills_match(resume_text: str, jd_text: str) -> dict:
    resume_tokens = set(tokenize(resume_text))
    jd_tokens = set(tokenize(jd_text))

    jd_skills = {s for s in SKILLS_DICTIONARY if s in jd_text.lower() or s in jd_tokens}
    resume_skills = {s for s in SKILLS_DICTIONARY if s in resume_text.lower() or s in resume_tokens}

    matched = sorted(jd_skills & resume_skills)
    missing = sorted(jd_skills - resume_skills)
    coverage = round(100 * len(matched) / len(jd_skills), 1) if jd_skills else 100.0

    return {
        'matched_skills': matched,
        'missing_skills': missing,
        'required_skills_found_in_jd': sorted(jd_skills),
        'coverage_percent': coverage,
    }


def keyword_density(text: str, keywords: list[str]) -> dict:
    tokens = tokenize(text)
    total = len(tokens) or 1
    counts = Counter(tokens)
    return {
        kw: {
            'count': counts.get(kw, 0),
            'density_percent': round(100 * counts.get(kw, 0) / total, 2),
        }
        for kw in keywords
    }


def tfidf_similarity(resume_text: str, jd_text: str) -> float:
    """Cosine similarity between resume and JD via TF-IDF, scaled 0-100."""
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity

    if not resume_text.strip() or not jd_text.strip():
        return 0.0

    vectorizer = TfidfVectorizer(stop_words='english', max_features=2000)
    try:
        matrix = vectorizer.fit_transform([resume_text, jd_text])
    except ValueError:
        return 0.0
    score = cosine_similarity(matrix[0:1], matrix[1:2])[0][0]
    return round(float(score) * 100, 1)


def resume_health_check(text: str) -> dict:
    lower = text.lower()
    word_count = len(tokenize(text))
    has_email = bool(re.search(r'[\w.+-]+@[\w-]+\.[\w.-]+', text))
    has_phone = bool(re.search(r'(\+?\d[\d \-().]{7,}\d)', text))
    has_summary = any(k in lower for k in ['summary', 'objective', 'profile'])
    has_experience = any(k in lower for k in ['experience', 'employment', 'work history'])
    has_education = 'education' in lower
    has_skills_section = 'skills' in lower
    bullet_count = text.count('\n-') + text.count('\n•') + text.count('\n*')

    checks = {
        'has_email': has_email,
        'has_phone': has_phone,
        'has_summary_section': has_summary,
        'has_experience_section': has_experience,
        'has_education_section': has_education,
        'has_skills_section': has_skills_section,
        'word_count': word_count,
        'length_ok': 250 <= word_count <= 1200,
        'bullet_point_count': bullet_count,
        'uses_bullet_points': bullet_count >= 3,
    }
    passed = sum(1 for k, v in checks.items() if isinstance(v, bool) and v)
    total = sum(1 for v in checks.values() if isinstance(v, bool))
    checks['health_score'] = round(100 * passed / total, 1)
    return checks


def ats_formatting_check(file_type: str, extracted_text: str) -> list[str]:
    """Heuristic checks for things that commonly break real ATS parsers."""
    issues = []
    word_count = len(tokenize(extracted_text))

    if word_count < 50:
        issues.append(
            'Very little text could be extracted - the file may be an image-based '
            'scan, or use complex columns/text boxes that ATS software cannot read.'
        )
    if file_type == 'pdf' and '\t' in extracted_text:
        issues.append('Tab-heavy layout detected - multi-column PDF layouts can confuse ATS parsers.')
    if extracted_text.count('|') > 20:
        issues.append('Heavy use of table/pipe characters detected - avoid tables for key content.')
    if not re.search(r'[\w.+-]+@[\w-]+\.[\w.-]+', extracted_text):
        issues.append('No email address detected - make sure contact info is plain text, not an image.')
    if len(issues) == 0:
        issues.append('No major ATS formatting red flags detected.')
    return issues


def compute_ats_score(resume_text: str, jd_text: str) -> dict:
    similarity = tfidf_similarity(resume_text, jd_text)
    matched, missing = keyword_match(resume_text, jd_text)
    coverage = round(100 * len(matched) / (len(matched) + len(missing)), 1) if (matched or missing) else 0.0

    # Weighted blend: semantic similarity + literal keyword coverage
    ats_score = round(0.55 * similarity + 0.45 * coverage, 1)

    return {
        'ats_score': min(ats_score, 100.0),
        'similarity_score': similarity,
        'keyword_coverage': coverage,
        'matched_keywords': matched,
        'missing_keywords': missing,
    }
