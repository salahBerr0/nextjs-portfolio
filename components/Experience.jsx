import { Educations, Works } from "@/data/Experiences";
const formatDate = (dateStr) => {
  if (!dateStr) return "Present";
  const options = { year: "numeric", month: "short" };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};

const TimelineItem = ({ item, type }) => {
  const dateRange = `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`;
  const iconBg = type === "work" ? "#0db988" : "#4F46E5";
  const title = type === "work" ? item.expTitle : item.educDegree;
  const subtitle = type === "work" ? item.expCompany : item.educInstitution;
  const points = type === "work" ? item.expPoints : item.educPoints;

  return (
    <div className="relative pl-8 pb-8 pt-2 border-l-2 border-white" >
        {/* Timeline dot */}
        <div className="absolute w-5 h-5 rounded-full left-[-9px]" style={{ backgroundColor: iconBg, boxShadow:`0 0 10px ${iconBg}` }}></div>
        {/* Date */}
        <div className="flex items-center justify-start gap-2">
            <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[7px] rotate-90 border-b-gray-200"></div>
            <span className="text-sm text-gray-200">{dateRange}</span>
        </div>
        {/* Content */}
        <div  className="p-6 rounded-md mt-2 text-white border-[1px] border-white w-full max-w-3xl" style={{ backgroundColor: `${iconBg}80` , boxShadow:`0 0 20px ${iconBg}`}}>
            <h3 className="text-[24px] font-bold">{title}</h3>
            <span className="text-[14px] font-bold">{subtitle}</span>
            <ul className="list-disc mt-5 ml-6">
                {points.map((point, idx) => (<li key={idx}>{point}</li>))}
            </ul>
        </div>
    </div>
  );
};

export default async function Experience() {
  // Prepare timeline data on the server
  const timelineEntries = [
    ...Works.map(work => ({
      ...work,
      startDate: work.expStartDate,
      endDate: work.expEndDate,
      key: `work-${work._id || work.expTitle}-${work.expCompany}`,
      type: "work"
    })),
    ...Educations.map(educ => ({
      ...educ,
      startDate: educ.educStartDate,
      endDate: educ.educEndDate,
      key: `educ-${educ._id || educ.educDegree}-${educ.educInstitution}`,
      type: "education"
    }))
  ];

  // Sort by date (newest first)
  timelineEntries.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <section id="experience" className="min-h-screen grid px-16">
      <div role="textbox" className="grid content-center justify-items-start w-full" >
        <p className="text-[#dfd9ff] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px]">What I have done so far</p>
        <h2 className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]">Work Experience & Education</h2>
      </div>
      
      <div className="relative">
        {timelineEntries.map((experience) => (
          <TimelineItem  key={experience.key}  item={experience}  type={experience.type}/>
        ))}
      </div>
    </section>
  );
}