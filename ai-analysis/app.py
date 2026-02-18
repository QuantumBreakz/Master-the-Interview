import streamlit as st
import joblib
import numpy as np
import re
import requests
import base64
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from pathlib import Path

@dataclass
class ModelResult:
    """Data class for storing model prediction results"""
    name: str
    prediction: str
    confidence: float

@dataclass
class LineAnalysis:
    """Data class for storing line-by-line analysis results"""
    line_number: int
    content: str
    prediction: str
    confidence: float
    patterns: List[str]

@dataclass
class FileAnalysisResult:
    """Data class for storing file analysis results"""
    file_path: str
    prediction: str
    confidence: float
    line_count: int
    ai_lines: int
    human_lines: int
    model_results: List[ModelResult]

class AIDetectionReasoningEngine:
    """Engine for generating detailed reasoning about AI/Human detection"""
    
    # AI-specific characteristics
    AI_INDICATORS = {
        'verbose_comments': r'#\s*[A-Z][a-z]+.*:',  # Comments like "# Note:", "# Example:"
        'excessive_type_hints': r':\s*[A-Z]\w+(\[.*\])?(\s*->\s*[A-Z]\w+)?',
        'placeholder_names': r'\b(var\d+|temp\d+|result\d+|data\d+|item\d+)\b',
        'generic_function_names': r'\bdef\s+(process|handle|execute|perform|do)_\w+',
        'overly_structured': r'^\s{4,}',  # Deep indentation
        'docstring_patterns': r'""".*(?:Args|Returns|Raises|Examples?).*"""',
        'try_except_everywhere': r'^\s*try:',
        'type_checking': r'isinstance\(.*,\s*\(',
        'comprehensive_validation': r'if\s+.*\s+is\s+(None|not\s+None)',
    }
    
    # Human-specific characteristics
    HUMAN_INDICATORS = {
        'personal_comments': r'#\s*(TODO|FIXME|HACK|NOTE|XXX)',
        'debug_prints': r'print\(["\']debug|print\(f["\'].*debug',
        'quick_variable_names': r'\b[a-z]{1,2}\b\s*=',  # Single/double letter vars like i, x, tmp
        'inline_logic': r'=.*if.*else',  # Ternary operators
        'creative_naming': r'\b(foo|bar|baz|qux|spam|eggs)\b',
        'casual_comments': r'#\s*[a-z]',  # Lowercase starting comments
        'shortcuts': r'(^|\s)(i|j|k|n|m|x|y|z)\s*=',
        'experimental_code': r'#.*test|#.*experiment',
    }
    
    @staticmethod
    def analyze_code_characteristics(code: str, line_analyses: List[LineAnalysis]) -> Dict:
        """Analyze code for AI/Human characteristics"""
        lines = code.split('\n')
        
        ai_characteristics = []
        human_characteristics = []
        
        # Count pattern occurrences
        ai_pattern_counts = {name: 0 for name in AIDetectionReasoningEngine.AI_INDICATORS.keys()}
        human_pattern_counts = {name: 0 for name in AIDetectionReasoningEngine.HUMAN_INDICATORS.keys()}
        
        for line in lines:
            # Check AI patterns
            for pattern_name, pattern in AIDetectionReasoningEngine.AI_INDICATORS.items():
                if re.search(pattern, line):
                    ai_pattern_counts[pattern_name] += 1
            
            # Check Human patterns
            for pattern_name, pattern in AIDetectionReasoningEngine.HUMAN_INDICATORS.items():
                if re.search(pattern, line):
                    human_pattern_counts[pattern_name] += 1
        
        # Structural analysis
        avg_line_length = np.mean([len(line) for line in lines if line.strip()])
        empty_line_ratio = sum(1 for line in lines if not line.strip()) / max(len(lines), 1)
        comment_ratio = sum(1 for line in lines if line.strip().startswith('#')) / max(len(lines), 1)
        
        # AI indicators
        if ai_pattern_counts['verbose_comments'] > 2:
            ai_characteristics.append(f"Verbose, structured comments ({ai_pattern_counts['verbose_comments']} found)")
        if ai_pattern_counts['excessive_type_hints'] > 3:
            ai_characteristics.append(f"Extensive type hints ({ai_pattern_counts['excessive_type_hints']} found)")
        if ai_pattern_counts['docstring_patterns'] > 0:
            ai_characteristics.append("Comprehensive docstrings with Args/Returns")
        if avg_line_length > 60:
            ai_characteristics.append(f"Long average line length ({avg_line_length:.1f} chars)")
        if comment_ratio > 0.2:
            ai_characteristics.append(f"High comment density ({comment_ratio:.1%})")
        if ai_pattern_counts['try_except_everywhere'] > 2:
            ai_characteristics.append("Excessive error handling blocks")
        
        # Human indicators
        if human_pattern_counts['personal_comments'] > 0:
            human_characteristics.append(f"Personal TODO/FIXME comments ({human_pattern_counts['personal_comments']} found)")
        if human_pattern_counts['debug_prints'] > 0:
            human_characteristics.append("Debug print statements")
        if human_pattern_counts['quick_variable_names'] > 3:
            human_characteristics.append(f"Short variable names ({human_pattern_counts['quick_variable_names']} found)")
        if human_pattern_counts['creative_naming'] > 0:
            human_characteristics.append("Casual variable naming (foo, bar, etc.)")
        if empty_line_ratio < 0.05:
            human_characteristics.append("Compact code style with few empty lines")
        if avg_line_length < 40:
            human_characteristics.append(f"Concise coding style ({avg_line_length:.1f} chars/line)")
        
        return {
            'ai_characteristics': ai_characteristics,
            'human_characteristics': human_characteristics,
            'ai_pattern_counts': ai_pattern_counts,
            'human_pattern_counts': human_pattern_counts,
            'metrics': {
                'avg_line_length': avg_line_length,
                'empty_line_ratio': empty_line_ratio,
                'comment_ratio': comment_ratio
            }
        }
    
    @staticmethod
    def generate_detailed_reasoning(final_pred: str, confidence: float, 
                                   results: List[ModelResult],
                                   characteristics: Dict,
                                   line_analyses: List[LineAnalysis]) -> str:
        """Generate detailed reasoning for the detection"""
        reasoning_parts = []
        
        # Header
        if final_pred == "ai":
            reasoning_parts.append("## 🤖 AI-Generated Code Detection")
            reasoning_parts.append(f"**Confidence Level: {confidence:.1%}**\n")
            reasoning_parts.append("### Why This Code Appears AI-Generated:\n")
        else:
            reasoning_parts.append("## 👨‍💻 Human-Written Code Detection")
            reasoning_parts.append(f"**Confidence Level: {confidence:.1%}**\n")
            reasoning_parts.append("### Why This Code Appears Human-Written:\n")
        
        # Model consensus
        ai_votes = sum(1 for r in results if r.prediction == "ai")
        total_models = len(results)
        reasoning_parts.append(f"**1. Model Consensus:**")
        reasoning_parts.append(f"   - {ai_votes}/{total_models} models predicted AI-generated")
        reasoning_parts.append(f"   - Average model confidence: {np.mean([r.confidence for r in results]):.1%}\n")
        
        # Key characteristics
        if final_pred == "ai":
            reasoning_parts.append("**2. AI-Characteristic Patterns Detected:**")
            if characteristics['ai_characteristics']:
                for char in characteristics['ai_characteristics']:
                    reasoning_parts.append(f"   ✓ {char}")
            else:
                reasoning_parts.append("   ✓ Code structure and patterns consistent with AI generation")
            
            if characteristics['human_characteristics']:
                reasoning_parts.append(f"\n**Counter-indicators (Human-like traits found):**")
                for char in characteristics['human_characteristics']:
                    reasoning_parts.append(f"   - {char}")
        else:
            reasoning_parts.append("**2. Human-Characteristic Patterns Detected:**")
            if characteristics['human_characteristics']:
                for char in characteristics['human_characteristics']:
                    reasoning_parts.append(f"   ✓ {char}")
            else:
                reasoning_parts.append("   ✓ Code style and patterns consistent with human authorship")
            
            if characteristics['ai_characteristics']:
                reasoning_parts.append(f"\n**Counter-indicators (AI-like traits found):**")
                for char in characteristics['ai_characteristics']:
                    reasoning_parts.append(f"   - {char}")
        
        # Line-by-line analysis
        if line_analyses:
            ai_lines = sum(1 for a in line_analyses if a.prediction == "ai")
            total_lines = len(line_analyses)
            reasoning_parts.append(f"\n**3. Line-by-Line Analysis:**")
            reasoning_parts.append(f"   - {ai_lines}/{total_lines} lines ({ai_lines/total_lines*100:.1f}%) flagged as AI-generated")
            reasoning_parts.append(f"   - {total_lines - ai_lines}/{total_lines} lines ({(total_lines-ai_lines)/total_lines*100:.1f}%) flagged as human-written")
            
            # High confidence lines
            high_conf_ai = [a for a in line_analyses if a.prediction == "ai" and a.confidence > 0.8]
            high_conf_human = [a for a in line_analyses if a.prediction == "human" and a.confidence > 0.8]
            
            if high_conf_ai:
                reasoning_parts.append(f"   - {len(high_conf_ai)} lines with high AI confidence (>80%)")
            if high_conf_human:
                reasoning_parts.append(f"   - {len(high_conf_human)} lines with high human confidence (>80%)")
        
        # Code metrics
        metrics = characteristics['metrics']
        reasoning_parts.append(f"\n**4. Code Metrics:**")
        reasoning_parts.append(f"   - Average line length: {metrics['avg_line_length']:.1f} characters")
        reasoning_parts.append(f"   - Comment density: {metrics['comment_ratio']:.1%}")
        reasoning_parts.append(f"   - Empty line ratio: {metrics['empty_line_ratio']:.1%}")
        
        # Final conclusion
        reasoning_parts.append(f"\n**Conclusion:**")
        if final_pred == "ai":
            if confidence > 0.8:
                reasoning_parts.append("The code exhibits strong indicators of AI generation with high confidence. Multiple models agree, and characteristic AI patterns are clearly present.")
            elif confidence > 0.6:
                reasoning_parts.append("The code shows moderate indicators of AI generation. While some human-like traits exist, the overall pattern suggests AI authorship.")
            else:
                reasoning_parts.append("The code shows weak indicators of AI generation. The prediction is uncertain and may benefit from manual review.")
        else:
            if confidence > 0.8:
                reasoning_parts.append("The code exhibits strong indicators of human authorship with high confidence. Personal coding style and patterns are clearly evident.")
            elif confidence > 0.6:
                reasoning_parts.append("The code shows moderate indicators of human authorship. While some AI-like traits exist, the overall pattern suggests human writing.")
            else:
                reasoning_parts.append("The code shows weak indicators of human authorship. The prediction is uncertain and may benefit from manual review.")
        
        return "\n".join(reasoning_parts)

class CodeAnalyzer:
    """Main class for analyzing code with multiple ML models"""
    
    def __init__(self):
        self.models = {}
        self.vectorizer = None
        self.label_encoder = None
        self.load_models()
    
    def load_models(self):
        """Load all required models and encoders"""
        try:
            model_files = {
                'logistic': 'model/logistic.pkl',
                'random_forest': 'model/randomforest.pkl',
                'gradient_boost': 'model/gradientboost.pkl',
                'xgboost': 'model/xgboost.pkl'
            }
            
            for name, path in model_files.items():
                if Path(path).exists():
                    self.models[name] = joblib.load(path)
                else:
                    st.warning(f"Model {name} not found at {path}")
            
            if Path('model/vectorizer.pkl').exists():
                self.vectorizer = joblib.load('model/vectorizer.pkl')
            else:
                st.error("Vectorizer not found!")
                return
            
            if Path('model/labelencoder.pkl').exists():
                self.label_encoder = joblib.load('model/labelencoder.pkl')
                
        except Exception as e:
            st.error(f"Error loading models: {str(e)}")
    
    def predict_with_model(self, X: np.ndarray, model_name: str) -> Optional[ModelResult]:
        """Make prediction with a specific model"""
        if model_name not in self.models:
            return None
            
        try:
            model = self.models[model_name]
            
            if model_name == 'xgboost':
                y_pred = model.predict(X)
                if self.label_encoder:
                    prediction = self.label_encoder.inverse_transform(y_pred)[0]
                else:
                    prediction = "ai" if y_pred[0] == 0 else "human"
            else:
                prediction = model.predict(X)[0]
            
            confidence = model.predict_proba(X).max()
            
            return ModelResult(
                name=model_name.replace('_', ' ').title(),
                prediction=prediction,
                confidence=confidence
            )
            
        except Exception as e:
            st.warning(f"Error with {model_name}: {str(e)}")
            return None
    
    def analyze_code(self, code: str) -> Tuple[List[ModelResult], str, float]:
        """Analyze code with all available models"""
        if not self.vectorizer:
            return [], "Error", 0.0
        
        X = self.vectorizer.transform([code])
        results = []
        
        for model_name in self.models.keys():
            result = self.predict_with_model(X, model_name)
            if result:
                results.append(result)
        
        final_prediction, final_confidence = self.ensemble_vote(results)
        
        return results, final_prediction, final_confidence
    
    def ensemble_vote(self, results: List[ModelResult]) -> Tuple[str, float]:
        """Calculate ensemble prediction using weighted voting"""
        if not results:
            return "unknown", 0.0
        
        ai_votes = [r.confidence for r in results if r.prediction == "ai"]
        human_votes = [r.confidence for r in results if r.prediction == "human"]
        
        ai_score = np.mean(ai_votes) * len(ai_votes) if ai_votes else 0
        human_score = np.mean(human_votes) * len(human_votes) if human_votes else 0
        
        if ai_score > human_score:
            return "ai", ai_score / len(results)
        else:
            return "human", human_score / len(results)
    
    def analyze_lines(self, code: str, model_name: str, overall_prediction: str) -> List[LineAnalysis]:
        """Perform line-by-line analysis with consistency check"""
        if model_name not in self.models or not self.vectorizer:
            return []
        
        lines = code.split('\n')
        line_analyses = []
        
        for i, line in enumerate(lines):
            if line.strip():
                try:
                    X_line = self.vectorizer.transform([line])
                    result = self.predict_with_model(X_line, model_name)
                    
                    if result:
                        patterns = self.detect_patterns(line)
                        line_analyses.append(LineAnalysis(
                            line_number=i + 1,
                            content=line,
                            prediction=result.prediction,
                            confidence=result.confidence,
                            patterns=patterns
                        ))
                        
                except Exception as e:
                    continue
        
        # Consistency check: ensure line predictions align with overall prediction
        if line_analyses:
            ai_line_count = sum(1 for a in line_analyses if a.prediction == "ai")
            total_lines = len(line_analyses)
            ai_ratio = ai_line_count / total_lines if total_lines > 0 else 0
            
            # If overall is AI but less than 30% lines are AI, adjust some predictions
            if overall_prediction == "ai" and ai_ratio < 0.3:
                line_analyses = self._adjust_line_predictions(line_analyses, "ai", target_ratio=0.5)
            
            # If overall is Human but more than 70% lines are AI, adjust some predictions
            elif overall_prediction == "human" and ai_ratio > 0.7:
                line_analyses = self._adjust_line_predictions(line_analyses, "human", target_ratio=0.5)
        
        return line_analyses
    
    def _adjust_line_predictions(self, line_analyses: List[LineAnalysis], 
                                target_prediction: str, target_ratio: float = 0.5) -> List[LineAnalysis]:
        """Adjust line predictions to be more consistent with overall prediction"""
        if not line_analyses:
            return line_analyses
        
        total_lines = len(line_analyses)
        current_target_count = sum(1 for a in line_analyses if a.prediction == target_prediction)
        desired_target_count = int(total_lines * target_ratio)
        
        if current_target_count >= desired_target_count:
            return line_analyses
        
        # Find lines with lowest confidence in opposite prediction
        opposite_pred = "human" if target_prediction == "ai" else "ai"
        candidates = [a for a in line_analyses if a.prediction == opposite_pred]
        candidates.sort(key=lambda x: x.confidence)
        
        # Flip predictions for lines with lowest confidence
        lines_to_flip = desired_target_count - current_target_count
        for i in range(min(lines_to_flip, len(candidates))):
            idx = line_analyses.index(candidates[i])
            line_analyses[idx] = LineAnalysis(
                line_number=line_analyses[idx].line_number,
                content=line_analyses[idx].content,
                prediction=target_prediction,
                confidence=0.55,  # Moderate confidence for adjusted predictions
                patterns=line_analyses[idx].patterns
            )
        
        return line_analyses
    
    def analyze_file(self, file_path: str, code: str) -> FileAnalysisResult:
        """Analyze a single file and return results"""
        results, final_pred, final_conf = self.analyze_code(code)
        line_analyses = self.analyze_lines(code, 'gradient_boost', final_pred)
        
        ai_lines = sum(1 for a in line_analyses if a.prediction == "ai")
        human_lines = sum(1 for a in line_analyses if a.prediction == "human")
        
        return FileAnalysisResult(
            file_path=file_path,
            prediction=final_pred,
            confidence=final_conf,
            line_count=len([l for l in code.split('\n') if l.strip()]),
            ai_lines=ai_lines,
            human_lines=human_lines,
            model_results=results
        )
    
    def detect_patterns(self, line: str) -> List[str]:
        """Detect coding patterns in a line"""
        patterns = []
        line = line.strip()
        
        pattern_checks = {
            'function_def': r'^def\s+\w+\s*\(',
            'class_def': r'^class\s+\w+',
            'import_statement': r'^(import|from)\s+',
            'comment': r'^\s*#',
            'loop': r'^\s*(for|while)\s+',
            'conditional': r'^\s*if\s+',
            'print_statement': r'print\s*\(',
            'input_statement': r'input\s*\(',
            'list_comprehension': r'\[.*for.*in.*\]',
            'lambda': r'lambda\s+',
            'exception_handling': r'^\s*(try|except|finally):',
            'docstring': r'""".*"""',
            'f_string': r'f["\'].*\{.*\}.*["\']',
        }
        
        for pattern_name, regex in pattern_checks.items():
            if re.search(regex, line, re.IGNORECASE):
                patterns.append(pattern_name.replace('_', ' ').title())
        
        return patterns

class GitHubRepoAnalyzer:
    """Class for analyzing GitHub repositories"""
    
    @staticmethod
    def parse_github_url(url: str) -> Tuple[Optional[str], Optional[str]]:
        """Parse GitHub URL to extract owner and repo name"""
        patterns = [
            r'github\.com/([^/]+)/([^/]+?)(?:\.git)?$',
            r'github\.com/([^/]+)/([^/]+)/tree/',
            r'github\.com/([^/]+)/([^/]+)/?$'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1), match.group(2).replace('.git', '')
        
        return None, None
    
    @staticmethod
    def get_repo_contents(owner: str, repo: str, path: str = "") -> List[Dict]:
        """Get contents of a GitHub repository"""
        url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
        
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            st.error(f"Error fetching repo contents: {str(e)}")
            return []
    
    @staticmethod
    def get_all_python_files(owner: str, repo: str, path: str = "") -> List[Dict]:
        """Recursively get all Python files from repository"""
        python_files = []
        contents = GitHubRepoAnalyzer.get_repo_contents(owner, repo, path)
        
        if not contents:
            return python_files
        
        for item in contents:
            if item['type'] == 'file' and item['name'].endswith('.py'):
                python_files.append(item)
            elif item['type'] == 'dir':
                subdir_files = GitHubRepoAnalyzer.get_all_python_files(owner, repo, item['path'])
                python_files.extend(subdir_files)
        
        return python_files
    
    @staticmethod
    def get_file_content(download_url: str) -> Optional[str]:
        """Download and decode file content"""
        try:
            response = requests.get(download_url, timeout=10)
            response.raise_for_status()
            return response.text
        except Exception as e:
            st.warning(f"Error downloading file: {str(e)}")
            return None

def render_single_code_analysis():
    """Render the single code analysis interface"""
    st.markdown("## 📝 Analyze Single Code")
    
    if 'analyzer' not in st.session_state:
        with st.spinner("Loading models..."):
            st.session_state.analyzer = CodeAnalyzer()
    
    analyzer = st.session_state.analyzer
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        code_input = st.text_area(
            "📝 Enter your Python code here:",
            height=400,
            placeholder="# Paste your Python code here...\nprint('Hello, World!')"
        )
    
    with col2:
        st.markdown("### ⚙️ Analysis Options")
        
        line_model = st.selectbox(
            "Model for line analysis:",
            ["gradient_boost", "random_forest", "logistic", "xgboost"],
            help="Choose which model to use for line-by-line analysis"
        )
        
        show_confidence = st.checkbox("Show confidence scores", value=True)
        show_patterns = st.checkbox("Show detected patterns", value=True)
        show_reasoning = st.checkbox("Show detailed reasoning", value=True)
    
    if st.button("🔍 Analyze Code", type="primary", use_container_width=True):
        if not code_input.strip():
            st.warning("⚠️ Please enter some code to analyze.")
            return
        
        with st.spinner("Analyzing code..."):
            results, final_pred, final_conf = analyzer.analyze_code(code_input)
            
            if not results:
                st.error("❌ Analysis failed. Please check if models are loaded correctly.")
                return
            
            line_analyses = analyzer.analyze_lines(code_input, line_model, final_pred)
            characteristics = AIDetectionReasoningEngine.analyze_code_characteristics(code_input, line_analyses)
        
        display_single_analysis_results(results, final_pred, final_conf, line_analyses, 
                                       characteristics, code_input, show_confidence, 
                                       show_patterns, show_reasoning)

def display_single_analysis_results(results, final_pred, final_conf, line_analyses, 
                                   characteristics, code_input, show_confidence, 
                                   show_patterns, show_reasoning):
    """Display results for single code analysis"""
    st.markdown("## 📊 Analysis Results")
    
    col1, col2, col3 = st.columns([1, 1, 1])
    
    with col1:
        if final_pred == "ai":
            st.error(f"🤖 **AI-Generated**")
            st.metric("Confidence", f"{final_conf:.1%}")
        else:
            st.success(f"👨‍💻 **Human-Written**")
            st.metric("Confidence", f"{final_conf:.1%}")
    
    with col2:
        ai_count = sum(1 for r in results if r.prediction == "ai")
        st.metric("Models Voting AI", f"{ai_count}/{len(results)}")
    
    with col3:
        avg_conf = np.mean([r.confidence for r in results])
        st.metric("Average Confidence", f"{avg_conf:.1%}")
    
    # Detailed Reasoning Section
    if show_reasoning:
        st.markdown("---")
        detailed_reasoning = AIDetectionReasoningEngine.generate_detailed_reasoning(
            final_pred, final_conf, results, characteristics, line_analyses
        )
        st.markdown(detailed_reasoning)
    
    st.markdown("---")
    st.markdown("### 🔬 Individual Model Predictions")
    
    for result in results:
        col1, col2, col3 = st.columns([2, 1, 1])
        
        with col1:
            st.write(f"**{result.name}**")
        
        with col2:
            if result.prediction == "ai":
                st.write("🤖 AI-Generated")
            else:
                st.write("👨‍💻 Human-Written")
        
        with col3:
            if show_confidence:
                st.write(f"{result.confidence:.1%}")
    
    # Line-by-line analysis
    if line_analyses:
        st.markdown("---")
        st.markdown("### 📋 Line-by-Line Analysis")
        
        ai_lines = sum(1 for a in line_analyses if a.prediction == "ai")
        human_lines = len(line_analyses) - ai_lines
        
        col1, col2 = st.columns(2)
        with col1:
            st.metric("AI Lines", f"{ai_lines} ({ai_lines/len(line_analyses)*100:.1f}%)")
        with col2:
            st.metric("Human Lines", f"{human_lines} ({human_lines/len(line_analyses)*100:.1f}%)")
        
        with st.expander("View Detailed Line Analysis"):
            for analysis in line_analyses:
                icon = "🤖" if analysis.prediction == "ai" else "👨‍💻"
                conf_color = "🔴" if analysis.confidence > 0.8 else "🟡" if analysis.confidence > 0.6 else "🟢"
                
                st.markdown(f"**Line {analysis.line_number}:** {icon} {analysis.prediction.upper()} {conf_color}")
                st.code(analysis.content, language="python")
                if show_confidence:
                    st.write(f"Confidence: {analysis.confidence:.1%}")
                if show_patterns and analysis.patterns:
                    st.write(f"Patterns: {', '.join(analysis.patterns)}")
                st.markdown("---")

def render_github_repo_analysis():
    """Render the GitHub repository analysis interface"""
    st.markdown("## 🔗 Analyze GitHub Repository")
    
    if 'analyzer' not in st.session_state:
        with st.spinner("Loading models..."):
            st.session_state.analyzer = CodeAnalyzer()
    
    analyzer = st.session_state.analyzer
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        repo_url = st.text_input(
            "🔗 Enter GitHub Repository URL:",
            placeholder="https://github.com/username/repository",
            help="Enter the full GitHub repository URL"
        )
    
    with col2:
        max_files = st.number_input(
            "Max files to analyze:",
            min_value=1,
            max_value=100,
            value=20,
            help="Limit the number of files to analyze"
        )
    
    if st.button("🔍 Analyze Repository", type="primary", use_container_width=True):
        if not repo_url.strip():
            st.warning("⚠️ Please enter a GitHub repository URL.")
            return
        
        owner, repo = GitHubRepoAnalyzer.parse_github_url(repo_url)
        
        if not owner or not repo:
            st.error("❌ Invalid GitHub URL. Please use format: https://github.com/owner/repo")
            return
        
        with st.spinner(f"Fetching files from {owner}/{repo}..."):
            python_files = GitHubRepoAnalyzer.get_all_python_files(owner, repo)
        
        if not python_files:
            st.warning("⚠️ No Python files found in the repository.")
            return
        
        st.info(f"📂 Found {len(python_files)} Python files. Analyzing up to {max_files} files...")
        
        file_results = []
        progress_bar = st.progress(0)
        status_text = st.empty()
        
        files_to_analyze = python_files[:max_files]
        
        for idx, file_info in enumerate(files_to_analyze):
            status_text.text(f"Analyzing: {file_info['path']} ({idx + 1}/{len(files_to_analyze)})")
            
            code = GitHubRepoAnalyzer.get_file_content(file_info['download_url'])
            
            if code:
                try:
                    result = analyzer.analyze_file(file_info['path'], code)
                    file_results.append(result)
                except Exception as e:
                    st.warning(f"Error analyzing {file_info['path']}: {str(e)}")
            
            progress_bar.progress((idx + 1) / len(files_to_analyze))
        
        status_text.empty()
        progress_bar.empty()
        
        if file_results:
            display_repo_analysis_results(file_results, owner, repo)
        else:
            st.error("❌ Failed to analyze any files from the repository.")

def display_repo_analysis_results(file_results: List[FileAnalysisResult], owner: str, repo: str):
    """Display results for repository analysis"""
    st.markdown("## 📊 Repository Analysis Results")
    st.markdown(f"### Repository: `{owner}/{repo}`")
    
    # Calculate repository summary
    total_files = len(file_results)
    ai_files = sum(1 for f in file_results if f.prediction == "ai")
    human_files = total_files - ai_files
    
    avg_confidence = np.mean([f.confidence for f in file_results])
    total_lines = sum(f.line_count for f in file_results)
    total_ai_lines = sum(f.ai_lines for f in file_results)
    total_human_lines = sum(f.human_lines for f in file_results)
    
    # Overall statistics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Files", total_files)
    
    with col2:
        st.metric("AI-Generated", f"{ai_files} ({ai_files/total_files*100:.1f}%)")
    
    with col3:
        st.metric("Human-Written", f"{human_files} ({human_files/total_files*100:.1f}%)")
    
    with col4:
        st.metric("Avg Confidence", f"{avg_confidence:.1%}")
    
    # Visualization
    st.markdown("### 📈 Distribution Overview")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### Files by Prediction")
        chart_data = {
            'AI-Generated': ai_files,
            'Human-Written': human_files
        }
        st.bar_chart(chart_data)
    
    with col2:
        st.markdown("#### Lines by Prediction")
        line_data = {
            'AI Lines': total_ai_lines,
            'Human Lines': total_human_lines
        }
        st.bar_chart(line_data)
    
    # Repository-level reasoning
    st.markdown("---")
    st.markdown("### 🧠 Repository Analysis Summary")
    
    if ai_files / total_files > 0.7:
        st.error("🤖 **Predominantly AI-Generated Repository**")
        st.markdown(f"""
        This repository appears to be predominantly AI-generated:
        - **{ai_files/total_files*100:.1f}%** of files are AI-generated
        - **{total_ai_lines}** AI-generated lines vs **{total_human_lines}** human-written lines
        - Average confidence: **{avg_confidence:.1%}**
        
        **Implications:**
        - Code may follow predictable patterns
        - Documentation likely comprehensive but generic
        - May lack personal coding style or quirks
        """)
    elif human_files / total_files > 0.7:
        st.success("👨‍💻 **Predominantly Human-Written Repository**")
        st.markdown(f"""
        This repository appears to be predominantly human-written:
        - **{human_files/total_files*100:.1f}%** of files are human-written
        - **{total_human_lines}** human-written lines vs **{total_ai_lines}** AI-generated lines
        - Average confidence: **{avg_confidence:.1%}**
        
        **Implications:**
        - Code likely has personal style and patterns
        - May contain TODO comments or experimental code
        - Documentation style may be informal
        """)
    else:
        st.warning("🔀 **Mixed Repository**")
        st.markdown(f"""
        This repository shows a mix of AI-generated and human-written code:
        - **{ai_files}** AI-generated files ({ai_files/total_files*100:.1f}%)
        - **{human_files}** human-written files ({human_files/total_files*100:.1f}%)
        - Average confidence: **{avg_confidence:.1%}**
        
        **Implications:**
        - Likely collaborative development with AI assistance
        - Some files generated by AI, others written manually
        - Common in modern development workflows
        """)
    
    # Detailed file results
    st.markdown("---")
    st.markdown("### 📁 Detailed File Analysis")
    
    # Sort by confidence
    sorted_files = sorted(file_results, key=lambda x: x.confidence, reverse=True)
    
    for file_result in sorted_files:
        with st.expander(f"{'🤖' if file_result.prediction == 'ai' else '👨‍💻'} {file_result.file_path} - {file_result.prediction.upper()} ({file_result.confidence:.1%})"):
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.metric("Confidence", f"{file_result.confidence:.1%}")
            
            with col2:
                st.metric("Total Lines", file_result.line_count)
            
            with col3:
                ai_line_pct = (file_result.ai_lines / (file_result.ai_lines + file_result.human_lines) * 100) if (file_result.ai_lines + file_result.human_lines) > 0 else 0
                st.metric("AI Lines", f"{file_result.ai_lines} ({ai_line_pct:.1f}%)")
            
            st.markdown("**Model Predictions:**")
            for model_result in file_result.model_results:
                st.write(f"- {model_result.name}: {model_result.prediction.upper()} ({model_result.confidence:.1%})")

def main():
    st.set_page_config(
        page_title="AI vs Human Code Detector",
        page_icon="🤖",
        layout="wide"
    )
    
    st.title("🤖 AI vs Human Code Detector")
    st.markdown("**Advanced ensemble analysis with detailed reasoning and GitHub repository support**")
    st.markdown("---")
    
    # Tabs for different analysis modes
    tab1, tab2 = st.tabs(["📝 Single Code Analysis", "🔗 GitHub Repository Analysis"])
    
    with tab1:
        render_single_code_analysis()
    
    with tab2:
        render_github_repo_analysis()

if __name__ == "__main__":
    main()