import React from "react";
import { motion, useAnimation } from "framer-motion";
import { FaRegQuestionCircle } from "react-icons/fa";

const questions = [
  {
    question: "What is the purpose of this app?",
    answer:
      "This app is designed to help women by providing safety information and allowing them to report incidents.",
  },
  {
    question: "How do I report an incident?",
    answer:
      "Click on the 'Report Incident' button on the map, fill out the form with the address and description, and submit it.",
  },
  {
    question: "How can I view reported incidents?",
    answer:
      "You can view reported incidents on the map, marked with red circles.",
  },
  {
    question: "What are the colored markers on the map?",
    answer:
      "The colored markers represent different safety zones based on the CSV data.",
  },
  {
    question: "Can I log out of the app?",
    answer: "Yes, you can log out from the sidebar or the header menu.",
  },
];

const FAQ = () => {
  const controls = useAnimation();
  const [openIndex, setOpenIndex] = React.useState(null);
  const [search, setSearch] = React.useState("");

  const filteredQuestions = questions.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  React.useEffect(() => {
    if (openIndex !== null) {
      controls.start({
        height: "auto",
        opacity: 1,
        transition: { duration: 0.5 },
      });
    } else {
      controls.start({ height: 0, opacity: 0, transition: { duration: 0.5 } });
    }
  }, [openIndex, controls]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 py-8 px-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">
          Frequently Asked Questions
        </h2>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full max-w-md"
          />
        </div>

        {/* FAQs List */}
        <div className="space-y-4">
          {filteredQuestions.map((faq, index) => (
            <motion.div
              key={index}
              className="relative bg-white rounded-lg overflow-hidden shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="w-full text-left py-4 px-6 bg-pink-100 text-pink-700 font-semibold flex justify-between items-center focus:outline-none"
                onClick={() => toggle(index)}
              >
                <div className="flex items-center space-x-2">
                  <FaRegQuestionCircle className="text-pink-600" />
                  <span>{faq.question}</span>
                </div>
                <svg
                  className={`w-6 h-6 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <motion.div animate={controls} className="overflow-hidden">
                <div className="p-6 bg-pink-50 text-gray-700">
                  <p>{faq.answer}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
