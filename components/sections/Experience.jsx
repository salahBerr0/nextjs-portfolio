import { Educations, Works } from "@/data/Experiences";

// Memoize the date formatting function
const formatDate = (dateStr) => {
  if (!dateStr) return "Present";
  
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: "numeric", 
    month: "short" 
  });
};

// Constants for better performance and maintainability
const WORK_CONFIG = {
  bgColor: "#0db988",
  titleKey: "expTitle",
  subtitleKey: "expCompany", 
  pointsKey: "expPoints"
};

const EDUCATION_CONFIG = {
  bgColor: "#4F46E5", 
  titleKey: "educDegree",
  subtitleKey: "educInstitution",
  pointsKey: "educPoints"
};

// Pre-calculate styles to avoid runtime calculations
const TimelineDot = ({ bgColor }) => (
  <div 
    className="absolute w-5 h-5 rounded-full left-[-9px]" 
    style={{ 
      backgroundColor: bgColor, 
      boxShadow: `0 0 10px ${bgColor}` 
    }} 
  />
);

const TimelineItem = ({ item, type }) => {
  const config = type === "work" ? WORK_CONFIG : EDUCATION_CONFIG;
  const dateRange = `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`;
  
  return (
    <article
      tabIndex={0}
      role="listitem"
      aria-label={`${type === "work" ? "Work experience" : "Education"}: ${item[config.titleKey]} at ${item[config.subtitleKey]}, from ${dateRange}`}
      className="relative pl-8 pb-8 pt-2 border-l-2 border-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
    >
      <TimelineDot bgColor={config.bgColor} />
      
      {/* Date */}
      <div className="flex items-center justify-start gap-2">
        <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[7px] rotate-90 border-b-gray-200" aria-hidden="true"></div>
        <span className="text-sm text-gray-200">{dateRange}</span>
      </div>
      
      {/* Content */}
      <div 
        className="p-6 rounded-md mt-2 text-white border-[1px] border-white w-full max-w-3xl backdrop-blur-sm"
        style={{ 
          backgroundColor: `${config.bgColor}60`,
          boxShadow: `0 0 20px ${config.bgColor}`
        }}
      >
        <h3 className="text-[24px] font-bold">{item[config.titleKey]}</h3>
        <span className="text-[14px] font-bold">{item[config.subtitleKey]}</span>
        <ul className="list-disc mt-5 ml-6">
          {item[config.pointsKey]?.map((point, idx) => (
            <li key={`${type}-point-${idx}`}>{point}</li>
          ))}
        </ul>
      </div>
    </article>
  );
};

// Memoize the data processing
const processTimelineData = () => {
  const workEntries = Works.map(work => ({
    ...work,
    startDate: work.expStartDate,
    endDate: work.expEndDate,
    key: `work-${work._id || work.expTitle}-${work.expCompany}`,
    type: "work"
  }));

  const educationEntries = Educations.map(educ => ({
    ...educ,
    startDate: educ.educStartDate,
    endDate: educ.educEndDate, 
    key: `educ-${educ._id || educ.educDegree}-${educ.educInstitution}`,
    type: "education"
  }));

  return [...workEntries, ...educationEntries]
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
};

export default function Experience() {
  const timelineEntries = processTimelineData();

  return (
    <section 
      id="experience" 
      className="min-h-screen grid px-5 sm:px-8 md:px-16" 
      aria-label="Work Experience and Education Timeline"
      tabIndex={-1}
    >
      <header role="banner" className="max-w-4xl mb-8">
        <p className="text-[#dfd9ff] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px]">
          What I have done so far
        </p>
        <h2 className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]">
          Work Experience & Education
        </h2>
      </header>
      
      <div role="list" className="relative">
        {timelineEntries.map((experience) => (
          <TimelineItem 
            key={experience.key}
            item={experience}
            type={experience.type}
          />
        ))}
      </div>
    </section>
  );
}
