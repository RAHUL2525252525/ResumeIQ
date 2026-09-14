from django.test import TestCase

from resumes.services import scoring


class ScoringServiceTests(TestCase):
    def setUp(self):
        self.resume_text = """
        Jane Doe
        jane@example.com | 555-123-4567
        Summary
        Backend engineer with experience in Python, Django, and PostgreSQL.
        Experience
        - Built REST APIs using Django Rest Framework and deployed with Docker.
        - Wrote unit tests with pytest and improved test coverage by 30%.
        Education
        BSc Computer Science
        Skills
        Python, Django, PostgreSQL, Docker, Git, REST APIs
        """
        self.jd_text = """
        We are looking for a Backend Engineer with strong Python and Django
        experience. Familiarity with PostgreSQL, Docker, REST API design,
        and automated testing (pytest) is required. AWS experience is a plus.
        """

    def test_extract_candidate_keywords_returns_list(self):
        keywords = scoring.extract_candidate_keywords(self.jd_text)
        self.assertIsInstance(keywords, list)
        self.assertIn('python', keywords)
        self.assertIn('django', keywords)

    def test_keyword_match_finds_overlap(self):
        matched, missing = scoring.keyword_match(self.resume_text, self.jd_text)
        self.assertIn('python', matched)
        self.assertIn('django', matched)
        # AWS is in the JD but not the resume
        self.assertIn('aws', missing)

    def test_skills_match_reports_coverage(self):
        result = scoring.skills_match(self.resume_text, self.jd_text)
        self.assertIn('python', result['matched_skills'])
        self.assertIn('django', result['matched_skills'])
        self.assertIn('aws', result['missing_skills'])
        self.assertGreater(result['coverage_percent'], 0)

    def test_tfidf_similarity_is_between_0_and_100(self):
        score = scoring.tfidf_similarity(self.resume_text, self.jd_text)
        self.assertGreaterEqual(score, 0)
        self.assertLessEqual(score, 100)

    def test_tfidf_similarity_empty_text_is_zero(self):
        self.assertEqual(scoring.tfidf_similarity('', self.jd_text), 0.0)
        self.assertEqual(scoring.tfidf_similarity(self.resume_text, ''), 0.0)

    def test_resume_health_check_detects_contact_info(self):
        health = scoring.resume_health_check(self.resume_text)
        self.assertTrue(health['has_email'])
        self.assertTrue(health['has_phone'])
        self.assertIn('health_score', health)

    def test_compute_ats_score_shape(self):
        result = scoring.compute_ats_score(self.resume_text, self.jd_text)
        for key in ['ats_score', 'similarity_score', 'keyword_coverage', 'matched_keywords', 'missing_keywords']:
            self.assertIn(key, result)
        self.assertGreaterEqual(result['ats_score'], 0)
        self.assertLessEqual(result['ats_score'], 100)

    def test_ats_formatting_check_flags_thin_text(self):
        issues = scoring.ats_formatting_check('pdf', 'too short')
        self.assertTrue(any('image-based' in issue for issue in issues))
