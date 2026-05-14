import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, "src", "components");

const updates = [
  {
    file: "CoursesSection.jsx",
    replacements: [
      {
        find: 'src={course.image}',
        replace:
          'src={getImageUrl(course.image, "https://via.placeholder.com/600x400?text=Course")}',
      },
    ],
  },
];

updates.forEach((update) => {
  const filePath = path.join(srcDir, update.file);

  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");

  update.replacements.forEach((r) => {
    if (content.includes(r.find)) {
      content = content.replace(r.find, r.replace);
    } else {
      console.log(`Could not find snippet in ${update.file}:`, r.find);
    }
  });

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Updated ${update.file}`);
});