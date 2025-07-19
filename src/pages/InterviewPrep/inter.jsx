import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/Layouts/DashboardLayout';
import RoleInfoHeader from './components/RoleInfoHeader';
import moment from 'moment';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import QuestionCard from '../../components/Cards/QuestionCard';
import { LuCircleAlert, LuListCollapse, LuGraduationCap, LuTarget } from 'react-icons/lu';
import AIResponcePreview from './components/AIResponcePreview';
import Drawer from '../../components/Drawer';
import SkeltonLoader from '../../components/Loader/SkeltonLoader';
import { motion, AnimatePresence } from 'framer-motion';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import toast from 'react-hot-toast';
import AnswerPractice from './components/AnswerPractice';
import AIFeedback from './components/AIFeedback';

const InterviewPrep = () => {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);
  
  // New states for answer practice
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentPracticeQuestion, setCurrentPracticeQuestion] = useState(null);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');

  const fetchSessionDetailById = async () => {
    try {
      const responce = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));
      if (responce.data && responce.data.session) {
        setSessionData(responce.data.session);
      }
    }
    catch (error) {
      console.error("Error fetching session details:", error);
    }
  };

  const generateConceptExplanation = async (question) => {
    try {
      setErrors("");
      setExplanation(null);
      setLoading(true);
      setOpenLeanMoreDrawer(true);
      const responce = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, {
        question,
      });
      if (responce.data) {
        setExplanation(responce.data);
      }
    } catch (error) {
      setExplanation(null);
      setErrors("Failed to generate explanation,try again.");
      console.error("Error fetching session details:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const responce = await axiosInstance.post(API_PATHS.QUESTION.PIN(questionId));
      console.log(responce);
      if (responce.data && responce.data.question) {
        fetchSessionDetailById();
      }
    } catch (error) {
      console.error("Errors : ", error);
    }
  };

  const uploadMoreQuestions = async () => {
    try {
      setIsUpdateLoader(true);
      const aiResponce = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role: sessionData?.role,
        experience: sessionData?.experience,
        topicsToFocus: sessionData?.topicsToFocus,
        numberOfQuestions: 10,
      });

      const generatedQuestions = aiResponce.data;
      const responce = await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION, {
        sessionId,
        questions: generatedQuestions,
      });
      if (responce.data) {
        toast.success("Added More Q&A !!");
        fetchSessionDetailById();
      }

    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrors(error.response.data.message);
      }
      else {
        setErrors("Something went wrong . Please try again.");
      }
    } finally {
      setIsUpdateLoader(false);
    }
  };

  // New function to handle answer practice
  const startPractice = (question) => {
    setCurrentPracticeQuestion(question);
    setPracticeMode(true);
    setAiFeedback(null);
    setUserAnswer('');
  };

  // New function to evaluate user answer
  const evaluateAnswer = async (practiceData) => {
    try {
      setFeedbackLoading(true);
      setUserAnswer(practiceData.userAnswer);
      
      // Call your AI evaluation API
      const response = await axiosInstance.post(API_PATHS.AI.EVALUATE_ANSWER, {
        question: practiceData.question,
        userAnswer: practiceData.userAnswer,
        expectedAnswer: currentPracticeQuestion?.answer, // Optional: use the model answer
        inputMode: practiceData.inputMode,
        recordingDuration: practiceData.recordingDuration
      });

      if (response.data) {
        setAiFeedback(response.data);
        toast.success("AI evaluation completed!");
      }
    } catch (error) {
      console.error("Error evaluating answer:", error);
      toast.error("Failed to get AI feedback. Please try again.");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const closePracticeMode = () => {
    setPracticeMode(false);
    setCurrentPracticeQuestion(null);
    setAiFeedback(null);
    setUserAnswer('');
  };

  // Function to try another question in practice mode
  const tryAnotherQuestion = () => {
    setCurrentPracticeQuestion(null);
    setAiFeedback(null);
    setUserAnswer('');
  };

  const PracticeQuestionCard = ({ data, onPractice }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 hover:shadow-md transition-shadow">
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">{data?.question}</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {data?.isPinned && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Pinned
              </span>
            )}
            <span className="text-sm text-gray-500">
              Click to practice this question
            </span>
          </div>
          <button
            onClick={() => onPractice(data)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LuTarget className="text-sm" />
            Practice Answer
          </button>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailById();
    }

    return () => {
      // Cleanup if necessary
    };
  }, []);

  return (
    <DashboardLayout>
      <RoleInfoHeader 
        role={sessionData?.role || ""} 
        topicsToFocus={sessionData?.topicsToFocus || ""} 
        experience={sessionData?.experience || "-"} 
        questions={sessionData?.questions?.length || "-"} 
        description={sessionData?.description || ""} 
        lastUpdated={sessionData?.updatedAt ? moment(sessionData.updatedAt).format("Do MMM YYYY") : ""} 
      />
      
      <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
        {/* Header with Practice Mode Toggle */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="ml-10 text-lg font-semibold text-black">Interview Q & A</h2>
          {!practiceMode && (
            <button
              onClick={() => setPracticeMode(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <LuGraduationCap className="text-lg" />
              Practice Mode
            </button>
          )}
          {practiceMode && (
            <button
              onClick={closePracticeMode}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Exit Practice
            </button>
          )}
        </div>

        <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
          <div className={`col-span-12 ${openLeanMoreDrawer ? "md:col-span-7" : "md:col-span-8"}`}>
            
            {/* Practice Mode Content */}
            {practiceMode && (
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <LuGraduationCap className="text-xl" />
                    Practice Mode Active
                  </h3>
                  <p className="text-blue-700 text-sm">
                    {currentPracticeQuestion 
                      ? "Answer the question below and get AI feedback on your response." 
                      : "Click on 'Practice Answer' button on any question to start practicing with AI feedback."
                    }
                  </p>
                </div>

                {/* Current Practice Question */}
                {currentPracticeQuestion && (
                  <div className="space-y-4">
                    <AnswerPractice
                      question={currentPracticeQuestion.question}
                      onSubmitAnswer={evaluateAnswer}
                      isLoading={feedbackLoading}
                    />

                    {/* AI Feedback Display */}
                    {aiFeedback && (
                      <AIFeedback
                        feedback={aiFeedback}
                        userAnswer={userAnswer}
                        question={currentPracticeQuestion.question}
                      />
                    )}

                    {/* Action buttons after feedback */}
                    {aiFeedback && (
                      <div className="flex gap-3 justify-center mt-6">
                        <button
                          onClick={tryAnotherQuestion}
                          className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Try Another Question
                        </button>
                        <button
                          onClick={() => {
                            setAiFeedback(null);
                            setUserAnswer('');
                          }}
                          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Practice Same Question Again
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Question Selection for Practice */}
                {!currentPracticeQuestion && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Select a Question to Practice</h3>
                    <AnimatePresence>
                      {sessionData?.questions?.map((data, idx) => (
                        <motion.div 
                          key={data._id || idx} 
                          initial={{ opacity: 0, y: -20 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, scale: 0.95 }} 
                          transition={{ 
                            duration: 0.3, 
                            type: "spring", 
                            stiffness: 100, 
                            delay: idx * 0.05, 
                            damping: 15 
                          }}
                        >
                          <PracticeQuestionCard 
                            data={data} 
                            onPractice={startPractice}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}

            {/* Regular Mode Content */}
            {!practiceMode && (
              <AnimatePresence>
                {sessionData?.questions?.map((data, idx) => {
                  return (
                    <motion.div 
                      key={data._id || idx} 
                      initial={{ opacity: 0, y: -20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, scale: 0.95 }} 
                      transition={{ 
                        duration: 0.3, 
                        type: "spring", 
                        stiffness: 100, 
                        delay: idx * 0.1, 
                        damping: 15 
                      }} 
                      layout 
                      layoutId={`question-${data._id || idx}`}
                    >
                      <QuestionCard 
                        question={data?.question} 
                        answer={data?.answer} 
                        onLearnMore={() => generateConceptExplanation(data.question)} 
                        isPinned={data?.isPinned} 
                        onTogglePin={() => toggleQuestionPinStatus(data._id)}
                        onPractice={() => startPractice(data)}
                        showPracticeButton={true}
                      />

                      {!loading && sessionData?.questions.length === idx + 1 && (
                        <div className="flex items-center justify-center mt-5">
                          <button 
                            className='flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 mr-2 rounded text-nowrap cursor-pointer' 
                            disabled={loading || isUpdateLoader} 
                            onClick={uploadMoreQuestions}
                          >
                            {isUpdateLoader ? (<SpinnerLoader />) : (<LuListCollapse className='text-lg' />)}
                            Load More
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Drawer for explanations */}
        <div className="cc">
          <Drawer 
            isOpen={openLeanMoreDrawer} 
            onClose={() => setOpenLeanMoreDrawer(false)} 
            title={!loading && explanation?.title}
          >
            {errors && (
              <p className="flex gap-2 text-sm text-amber-600 font-medium">
                <LuCircleAlert className='mt-1' /> {errors}
              </p>
            )}
            {loading && <SkeltonLoader />}
            {!loading && explanation && (
              <AIResponcePreview content={explanation?.explanation} />
            )}
          </Drawer>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default InterviewPrep