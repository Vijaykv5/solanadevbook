import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "../components/NavBar";
import Loading from "../components/loading-page";

type Props = {
  user: AppUser | null;
};

const CoursePage = ({ user }: Props) => {
  const [openLesson, setOpenLesson] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lessonProgress, setLessonProgress] = useState<number[]>([0, 0, 0, 0]);
  const router = useRouter();

  // Reference to the course content section
  const courseContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Retrieve lesson progress from localStorage on initial render
    const savedProgress = localStorage.getItem("lessonProgress");
    if (savedProgress) {
      setLessonProgress(JSON.parse(savedProgress));
    }
  }, []);

  const toggleLesson = (index: number) => {
    setOpenLesson(openLesson === index ? null : index);
  };

  const startLesson = (lessonId: number) => {
    setIsLoading(true);
    setTimeout(() => {
      // Mark the lesson as completed by setting progress to 100
      const updatedProgress = [...lessonProgress];
      updatedProgress[lessonId - 1] = 100;
      setLessonProgress(updatedProgress);
      localStorage.setItem("lessonProgress", JSON.stringify(updatedProgress));

      router.push(`/course/lesson/${lessonId}`);
    }, 2000);
  };

  const learningPoints = [
    "Understanding Solana Architecture",
    "Building Smart Contracts with Rust",
    "Deploying and Testing on Solana",
    "Integrating with Front-end Applications",
  ];

  // Scroll to course content section
  const handleStartCourse = () => {
    if (courseContentRef.current) {
      courseContentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-[#0b0d17] text-white">
          <Navbar user={user as AppUser | null} />
          <main className="container mx-auto px-8 py-16">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Solana: Beginner to Advanced Development
              </h1>
              <p className="text-lg text-gray-400 mb-8">
                Dive into Solana development and master the skills needed to
                build powerful decentralized applications.
              </p>
              <Button
                onClick={handleStartCourse}
                className="bg-teal-500 text-white hover:bg-teal-600 px-6 py-3 rounded-full"
              >
                Start Course
              </Button>
            </div>

            <div className="bg-gray-800 p-8 rounded-lg mb-12">
              <h2 className="text-2xl font-bold mb-6">What you'll learn:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {learningPoints.map((point, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-teal-500 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content Section */}
            <div ref={courseContentRef} className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Course Content</h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Introduction to Solana",
                    progress: lessonProgress[0],
                  },
                  {
                    title: "Smart Contract Basics",
                    progress: lessonProgress[1],
                  },
                  {
                    title: "Advanced Rust Programming",
                    progress: lessonProgress[2],
                  },
                  { title: "Deploying on Solana", progress: lessonProgress[3] },
                ].map((lesson, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 rounded-lg overflow-hidden transition-all duration-200 ease-in-out hover:bg-gray-800"
                  >
                    <button
                      onClick={() => toggleLesson(index)}
                      className="w-full p-4 flex justify-between items-center"
                    >
                      <span className="font-medium">{lesson.title}</span>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-teal-500 h-2 rounded-full"
                            style={{ width: `${lesson.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400 w-24">
                          {lesson.progress}% completed
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 transition-transform duration-200",
                            openLesson === index ? "rotate-180" : ""
                          )}
                        />
                      </div>
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-200 ease-in-out",
                        openLesson === index
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="p-4 border-t border-gray-800">
                          <p className="text-gray-400">
                            Learn the fundamentals of{" "}
                            {lesson.title.toLowerCase()} and practice with
                            hands-on exercises.
                          </p>
                          <Button
                            onClick={() => startLesson(index + 1)}
                            className="mt-4 bg-teal-500 hover:bg-teal-600"
                          >
                            Start Lesson
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default CoursePage;
