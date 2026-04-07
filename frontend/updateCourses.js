import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src', 'components');

const updates = [
  {
    file: 'CoursesSection.jsx',
    replacements: [
      {
        find: 'import { useState } from "react";\nimport { motion } from "framer-motion";',
        replace: 'import { useState, useEffect } from "react";\nimport { motion } from "framer-motion";\nimport axios from "axios";'
      },
      {
        find: 'const mockCourses = [',
        replace: '/* const mockCourses = ['
      },
      {
        find: 'function CoursesSection() {',
        replace: ']; */\n\nfunction CoursesSection() {'
      },
      {
        find: '  const [activeCategory, setActiveCategory] = useState(categories[0]);',
        replace: `  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/courses\`);
        setCourses(res.data.courses || []);
      } catch (error) {
        console.error("Error fetching courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(c => c.category === activeCategory).length > 0
    ? courses.filter(c => c.category === activeCategory)
    : courses;
`
      },
      {
        find: '{mockCourses.map((course, idx) => (',
        replace: `{loading ? <div className="text-slate-500 w-full text-center py-10">Loading courses...</div> : filteredCourses.map((course, idx) => (`
      },
      {
        find: 'key={course.id}',
        replace: 'key={course._id}'
      },
      {
        find: 'src={course.image}',
        replace: 'src={course.image?.startsWith("http") ? course.image : `http://localhost:5000/${course.image}`}'
      },
      {
        find: 'course.badge',
        replace: 'course.tag'
      },
      {
        find: 'course.badgeColor',
        replace: 'course.tag ? "bg-teal-500/20 text-teal-400 border border-teal-500/30" : ""'
      },
      {
        find: '{course.author}',
        replace: '{course.instructor}'
      },
      {
        find: 'course.reviews',
        replace: 'course.learners'
      },
      {
        find: '{course.price}',
        replace: '{`₹${course.price}`}'
      },
      {
        find: '{course.originalPrice}',
        replace: '{`₹${course.oldPrice}`}'
      }
    ]
  }
];

updates.forEach(update => {
  const filePath = path.join(srcDir, update.file);
  let content = fs.readFileSync(filePath, 'utf8');
  update.replacements.forEach(r => {
    if(content.includes(r.find)) {
      content = content.replace(r.find, r.replace);
    } else {
      console.log(\`Could not find snippet in \${update.file}:\`, r.find.substring(0, 50));
    }
  });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(\`Updated \${update.file}\`);
});
