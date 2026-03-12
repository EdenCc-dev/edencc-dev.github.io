import Modal from "@/components/Modal";
import useKrActivity from "@/models/kr";
import Quizs from "@/routes/pages/Kr/components/quiz";
import { ITask } from "@/routes/pages/Kr/dashboard/page";
import { useEventListener } from "ahooks";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";


const quizs = {
    fundamentalsQuiz: [
        {
            q: "What is the main focus of Cysic's technology?",
            choice: [
                "Social media platform",
                "Zero-knowledge proof acceleration",
                "E-commerce solutions",
                "Mobile gaming",
            ],
            a: 1,
        },
        {
            q: "Which of the following best describes ZK-SNARK?",
            choice: [
                "Social media platform",
                "Zero-knowledge proof acceleration",
                "E-commerce solutions",
                "Mobile gaming",
            ],
            a: 2,
        },
        {
            q: "What is the main focus of Cysic's technology?",
            choice: [
                "Social media platform",
                "Zero-knowledge proof acceleration",
                "E-commerce solutions",
                "Mobile gaming",
            ],
            a: 3,
        },
        {
            q: "What is the main focus of Cysic's technology?",
            choice: [
                "Social media platform",
                "Zero-knowledge proof acceleration",
                "E-commerce solutions",
                "Mobile gaming",
            ],
            a: 4,
        },
        {
            q: "What is the main focus of Cysic's technology?",
            choice: [
                "Social media platform",
                "Zero-knowledge proof acceleration",
                "E-commerce solutions",
                "Mobile gaming",
            ],
            a: 5,
        },
    ],
    basicsQuiz: [
        {
            q: "What is the purpose of the daily check-in system?",
            choice: [
                "To collect user data",
                "To maintain engagement and reward consistency",
                "To prevent spam",
                "To limit access to features",
            ],
            a: 1,
        },
        {
            q: "What is the purpose of the daily check-in system?",
            choice: [
                "To collect user data",
                "To maintain engagement and reward consistency",
                "To prevent spam",
                "To limit access to features",
            ],
            a: 2,
        },
        {
            q: "What is the purpose of the daily check-in system?",
            choice: [
                "To collect user data",
                "To maintain engagement and reward consistency",
                "To prevent spam",
                "To limit access to features",
            ],
            a: 3,
        },
        {
            q: "What is the purpose of the daily check-in system?",
            choice: [
                "To collect user data",
                "To maintain engagement and reward consistency",
                "To prevent spam",
                "To limit access to features",
            ],
            a: 4,
        },
        {
            q: "What is the purpose of the daily check-in system?",
            choice: [
                "To collect user data",
                "To maintain engagement and reward consistency",
                "To prevent spam",
                "To limit access to features",
            ],
            a: 5,
        },
    ],
};

export const KrLayout = () => {
    const [fundamentalsQuizVisible, setFundamentalsQuizVisible] =
        useState<boolean>(false);
    const [basicsQuizVisible, setBasicsQuizVisible] = useState(false);
    const { step, user, setState } = useKrActivity();


    return (
        <>
            <Modal
                isOpen={fundamentalsQuizVisible}
                onClose={() => setFundamentalsQuizVisible(false)}
                title="Quiz"
                className="max-w-[600px]"
            >
                <>
                    <Quizs
                        quiz={quizs.fundamentalsQuiz}
                        onFinish={() => {
                            setFundamentalsQuizVisible(false);
                        }}
                    />
                </>
            </Modal>

            <Modal
                isOpen={basicsQuizVisible}
                onClose={() => setBasicsQuizVisible(false)}
                title="Quiz"
                className="max-w-[600px]"
            >
                <>
                    <Quizs
                        quiz={quizs.basicsQuiz}
                        onFinish={() => {
                            setBasicsQuizVisible(false);
                        }}
                    />
                </>
            </Modal>

            <Outlet />
        </>
    );
};
