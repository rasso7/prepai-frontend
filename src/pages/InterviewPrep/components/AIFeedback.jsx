import React from 'react';
import { LuThumbsUp, LuThumbsDown, LuTarget, LuTrendingUp, LuClock, LuStar } from 'react-icons/lu';

const AIFeedback = ({ feedback, userAnswer, question }) => {
  if (!feedback) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <LuThumbsUp className="text-green-600" />;
    if (score >= 60) return <LuTarget className="text-yellow-600" />;
    return <LuThumbsDown className="text-red-600" />;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <LuStar className="text-blue-600" />
          AI Feedback & Evaluation
        </h3>
        <p className="text-gray-600 text-sm">{question}</p>
      </div>

      {/* Overall Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-md font-semibold text-gray-700">Overall Score</h4>
          <div className="flex items-center gap-2">
            {getScoreIcon(feedback.overallScore)}
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(feedback.overallScore)}`}>
              {feedback.overallScore}/100
            </span>
          </div>
        </div>
        
        {/* Score Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              feedback.overallScore >= 80 ? 'bg-green-500' : 
              feedback.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${feedback.overallScore}%` }}
          ></div>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 mb-1">{feedback.scores.relevance}/10</div>
          <div className="text-sm text-gray-600">Relevance</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 mb-1">{feedback.scores.clarity}/10</div>
          <div className="text-sm text-gray-600">Clarity</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600 mb-1">{feedback.scores.completeness}/10</div>
          <div className="text-sm text-gray-600">Completeness</div>
        </div>
      </div>

      {/* Analysis Sections */}
      <div className="space-y-4">
        {/* Strengths */}
        {feedback.strengths && feedback.strengths.length > 0 && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h5 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <LuThumbsUp className="text-green-600" />
              Strengths
            </h5>
            <ul className="space-y-1">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="text-green-700 text-sm flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas for Improvement */}
        {feedback.improvements && feedback.improvements.length > 0 && (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h5 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <LuTrendingUp className="text-yellow-600" />
              Areas for Improvement
            </h5>
            <ul className="space-y-1">
              {feedback.improvements.map((improvement, index) => (
                <li key={index} className="text-yellow-700 text-sm flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Specific Feedback */}
        {feedback.detailedFeedback && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h5 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <LuTarget className="text-blue-600" />
              Detailed Analysis
            </h5>
            <p className="text-blue-700 text-sm">{feedback.detailedFeedback}</p>
          </div>
        )}

        {/* Suggestions */}
        {feedback.suggestions && feedback.suggestions.length > 0 && (
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h5 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
              <LuStar className="text-purple-600" />
              Suggestions for Better Answers
            </h5>
            <ul className="space-y-1">
              {feedback.suggestions.map((suggestion, index) => (
                <li key={index} className="text-purple-700 text-sm flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Time & Length Analysis */}
        {feedback.metrics && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <LuClock className="text-gray-600" />
              Answer Metrics
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Word Count:</span>
                <span className="font-semibold ml-2">{feedback.metrics.wordCount}</span>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold ml-2">{feedback.metrics.duration}s</span>
              </div>
              <div>
                <span className="text-gray-600">Pace:</span>
                <span className="font-semibold ml-2">{feedback.metrics.wordsPerMinute} WPM</span>
              </div>
              <div>
                <span className="text-gray-600">Complexity:</span>
                <span className="font-semibold ml-2">{feedback.metrics.complexity}</span>
              </div>
            </div>
          </div>
        )}

        {/* Sample Better Answer */}
        {feedback.sampleAnswer && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h5 className="font-semibold text-gray-800 mb-2">Sample Improved Answer</h5>
            <p className="text-gray-700 text-sm italic">{feedback.sampleAnswer}</p>
          </div>
        )}
      </div>

      {/* Your Answer */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h5 className="font-semibold text-gray-800 mb-2">Your Answer</h5>
        <p className="text-gray-700 text-sm">{userAnswer}</p>
      </div>
    </div>
  );
};

export default AIFeedback;