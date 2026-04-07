import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiStar, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import axios from "axios";

function CoursesSection() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Categories");

  // Derive categories dynamically from database courses
  const dynamicCategories = ["All Categories", ...new Set(courses.map(c => c.category))];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/courses`);
        setCourses(res.data.courses || []);
      } catch (error) {
        console.error("Error fetching courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = activeCategory === "All Categories" 
    ? courses 
    : courses.filter((c) => c.category === activeCategory);

  return (
    <section className="bg-white py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-[-100px] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container-custom relative z-10 max-w-[1400px]">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Skills to transform your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-500">career and life</span>
          </h2>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
            From critical skills to technical topics, Multiclout supports your professional development.
          </p>
        </motion.div>

        {/* Categories Tabs */}
        <div className="w-full mb-12">
          <div className="flex overflow-x-auto w-full hide-scrollbar gap-4 md:gap-8 pb-4 px-4 lg:justify-center">
            {dynamicCategories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-2 py-3 text-sm md:text-base transition-all duration-300 font-bold border-b-2 ${
                  activeCategory === cat 
                    ? "text-slate-900 border-slate-900" 
                    : "text-slate-500 border-transparent hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="relative group border border-slate-200 rounded-xl p-6 bg-slate-50/50">

          <div className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x snap-mandatory">
            {loading ? (
              <div className="text-center py-10 w-full text-slate-500 font-semibold">Loading courses...</div>
            ) : filteredCourses.length === 0 ? (
               <div className="text-center py-10 w-full text-slate-500 font-semibold">No courses available for {activeCategory} right now.</div>
            ) : filteredCourses.map((course, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={course._id}
                className="snap-start min-w-[280px] md:min-w-[300px] w-[300px] bg-white border border-slate-200 flex flex-col group/card cursor-pointer hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-44 overflow-hidden border-b border-slate-100">
                  <img src={course.image?.startsWith("http") ? course.image : `http://localhost:5000/${course.image}`} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                </div>
                
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-slate-900 font-bold text-[16px] mb-1 line-clamp-2 leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-slate-500 text-xs mb-2 truncate">{course.instructor}</p>
                  
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[#b4690e] font-bold text-sm">{course.rating?.toFixed(1) || "4.5"}</span>
                    <div className="flex text-[#b4690e] text-xs">
                      <FiStar className="fill-current" />
                      <FiStar className="fill-current" />
                      <FiStar className="fill-current" />
                      <FiStar className="fill-current" />
                      <FiStar className="fill-current opacity-50" />
                    </div>
                    <span className="text-slate-500 text-xs ml-1">({(course.learners || 0).toLocaleString()})</span>
                  </div>

                  <div className="mt-auto pt-2 flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">₹{course.price}</span>
                    {course.oldPrice > 0 && <span className="text-slate-500 line-through text-xs">₹{course.oldPrice}</span>}
                  </div>
                  
                  {course.tag && (
                    <div className="mt-2 text-xs">
                      <span className="bg-[#eceb98] text-[#3d3c0a] font-bold px-2 py-1 inline-block">
                        {course.tag}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button 
            onClick={() => setActiveCategory("All Categories")}
            className="max-w-xs group flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 hover:border-teal-500 hover:bg-slate-50 text-slate-900 hover:text-teal-600 transition-all font-semibold shadow-sm"
          >
            <span>{activeCategory === "All Categories" ? "Explore More Courses" : `Show all ${activeCategory} courses`}</span>
            <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}

export default CoursesSection;