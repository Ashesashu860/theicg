export type CapabilityBlog = {
  title: string;
  excerpt: string;
  image: string;
  alt: string;
  date: string;
};

export type Capability = {
  slug: string;
  title: string;
  description: string;
  image: string;
  offset: boolean;
  overview: string;
  approach: string;
  focusAreas: string[];
  blogs: CapabilityBlog[];
};

export const capabilities: Capability[] = [
  {
    slug: "it-services",
    title: "IT Services",
    description:
      "Driving digital transformation and infrastructure resilience through applied AI and strategic technology advisory.",
    image: "/images/capabilities-it-services.jpg",
    offset: false,
    overview:
      "ICG partners with organizations to modernize technology estates, strengthen digital foundations, and turn AI and data into practical advantage. We combine strategic advisory with hands-on architecture guidance so technology decisions align with business outcomes.",
    approach:
      "We begin with a clear assessment of systems, risk, and opportunity—then design roadmaps that balance ambition with operational reality. Our teams help clients prioritize investments, improve resilience, and adopt emerging tools without disrupting critical operations.",
    focusAreas: [
      "Digital transformation strategy and operating model design",
      "Cloud, infrastructure, and platform modernization",
      "Applied AI and analytics advisory",
      "Cyber resilience and technology risk governance",
      "Enterprise architecture and integration planning",
    ],
    blogs: [
      {
        title: "From Legacy Stacks to Resilient Platforms",
        excerpt:
          "How staged modernization reduces risk while unlocking faster delivery and cleaner data foundations.",
        image: "/images/insight-ai.jpg",
        alt: "Digital visualization of modern technology systems",
        date: "Mar 12, 2026",
      },
      {
        title: "Where AI Belongs in Enterprise Roadmaps",
        excerpt:
          "Separating pilot theater from high-value AI use cases that improve decisions and operations.",
        image: "/images/insight-macro.jpg",
        alt: "Abstract visualization of connected data and decisions",
        date: "Feb 4, 2026",
      },
      {
        title: "Designing Technology for Operational Continuity",
        excerpt:
          "Practical patterns for infrastructure resilience when uptime and trust are non-negotiable.",
        image: "/images/insight-sustain.jpg",
        alt: "Modern infrastructure representing technology resilience",
        date: "Jan 18, 2026",
      },
    ],
  },
  {
    slug: "groundwater-consultancy",
    title: "Groundwater Consultancy",
    description:
      "Expert hydrological analysis and aquifer management to ensure sustainable water security and environmental compliance.",
    image: "/images/capabilities-groundwater.jpg",
    offset: false,
    overview:
      "Our groundwater consultants help public and private stakeholders understand aquifer systems, manage extraction responsibly, and protect long-term water security. We translate hydrological complexity into clear recommendations for planning, permitting, and stewardship.",
    approach:
      "We combine field investigation, modeling, and regulatory insight to evaluate recharge, yield, and risk. Clients receive actionable guidance for monitoring programs, sustainable allocation, and compliance across sensitive catchment contexts.",
    focusAreas: [
      "Aquifer assessment and hydrogeological investigations",
      "Groundwater modeling and yield estimation",
      "Recharge planning and water security strategy",
      "Environmental compliance and permitting support",
      "Monitoring frameworks for long-term stewardship",
    ],
    blogs: [
      {
        title: "Reading the Aquifer Before the Crisis",
        excerpt:
          "Why early hydrogeological assessment is the difference between reactive scarcity and planned water security.",
        image: "/images/insight-sustain.jpg",
        alt: "Infrastructure and natural systems representing water resources",
        date: "Mar 8, 2026",
      },
      {
        title: "Compliance That Protects the Resource",
        excerpt:
          "Aligning groundwater projects with environmental standards without slowing essential development.",
        image: "/images/insight-macro.jpg",
        alt: "Abstract analysis representing regulatory and resource planning",
        date: "Jan 29, 2026",
      },
      {
        title: "Monitoring That Decision-Makers Can Trust",
        excerpt:
          "Building groundwater monitoring programs that produce usable evidence, not just more data.",
        image: "/images/insight-ai.jpg",
        alt: "Digital visualization representing monitoring and analysis",
        date: "Dec 11, 2025",
      },
    ],
  },
  {
    slug: "waste-management",
    title: "Waste Management",
    description:
      "Optimizing industrial and municipal waste systems with sustainable, tech-enabled circular economy solutions.",
    image: "/images/capabilities-waste.jpg",
    offset: true,
    overview:
      "ICG helps cities and industries redesign waste systems for efficiency, recovery, and lower environmental impact. We focus on practical circular-economy pathways—improving collection, processing, and material value while meeting regulatory and community expectations.",
    approach:
      "Our work spans strategy, facility planning, and operating improvements. We diagnose leakage and inefficiency across the waste chain, then recommend interventions that are technically sound, financially viable, and ready for implementation.",
    focusAreas: [
      "Municipal and industrial waste system design",
      "Circular economy and material recovery strategies",
      "Facility planning and process optimization",
      "Technology-enabled tracking and operations",
      "Regulatory alignment and ESG reporting support",
    ],
    blogs: [
      {
        title: "Circular Systems That Scale Beyond Pilots",
        excerpt:
          "Moving from isolated recycling initiatives to integrated waste economies that create measurable recovery.",
        image: "/images/insight-sustain.jpg",
        alt: "Sustainable infrastructure representing circular systems",
        date: "Mar 2, 2026",
      },
      {
        title: "Industrial Waste as a Design Problem",
        excerpt:
          "How process redesign and material insight reduce disposal costs while improving compliance outcomes.",
        image: "/images/insight-ai.jpg",
        alt: "Digital analysis representing industrial process improvement",
        date: "Feb 14, 2026",
      },
      {
        title: "Tech That Makes Waste Visible",
        excerpt:
          "Using tracking and analytics to expose leakage points and prioritize the highest-impact interventions.",
        image: "/images/insight-macro.jpg",
        alt: "Abstract data visualization for operational insight",
        date: "Jan 7, 2026",
      },
    ],
  },
  {
    slug: "water-sanitation",
    title: "Water Sanitation",
    description:
      "Engineering high-impact water purification and sanitation projects for resilient communities and sustainable development.",
    image: "/images/capabilities-water-sanitation.jpg",
    offset: false,
    overview:
      "We support water and sanitation programs that improve public health, service reliability, and long-term system resilience. From purification strategy to community-scale delivery models, our guidance connects engineering quality with sustainable operations.",
    approach:
      "ICG works with utilities, agencies, and development partners to evaluate treatment options, strengthen distribution and sanitation systems, and design solutions communities can operate and maintain. Impact is measured in access, reliability, and lasting stewardship.",
    focusAreas: [
      "Water purification and treatment strategy",
      "Sanitation system planning and delivery models",
      "Utility operations and service reliability",
      "Community-centered infrastructure design",
      "Sustainable financing and program implementation",
    ],
    blogs: [
      {
        title: "Sanitation Outcomes Start With Operations",
        excerpt:
          "Why treatment design alone is not enough—and how operating models determine lasting public health impact.",
        image: "/images/insight-sustain.jpg",
        alt: "Infrastructure supporting community water and sanitation",
        date: "Mar 16, 2026",
      },
      {
        title: "Purification Choices for Constrained Contexts",
        excerpt:
          "Matching treatment technology to water quality, cost, and the capacity of local operators.",
        image: "/images/insight-ai.jpg",
        alt: "Technical visualization of water treatment decisions",
        date: "Feb 21, 2026",
      },
      {
        title: "Resilient Access in Growing Settlements",
        excerpt:
          "Planning sanitation upgrades that keep pace with urban and peri-urban population growth.",
        image: "/images/insight-macro.jpg",
        alt: "Abstract view of connected community systems",
        date: "Dec 19, 2025",
      },
    ],
  },
  {
    slug: "urban-development-planning",
    title: "Urban Development Planning",
    description:
      "Shaping the cities of tomorrow through data-driven urban design, infrastructure planning, and sustainable growth strategies.",
    image: "/images/capabilities-urban-planning.jpg",
    offset: false,
    overview:
      "ICG helps cities and developers plan growth that is coherent, investable, and resilient. We integrate land use, infrastructure, mobility, and environmental constraints so urban strategies move from vision documents to implementable programs.",
    approach:
      "Our planners and strategists combine spatial analysis with institutional and financial realities. We support master planning, corridor strategies, and infrastructure sequencing that create livable places while protecting long-term fiscal and environmental health.",
    focusAreas: [
      "Master planning and growth strategy",
      "Infrastructure and mobility corridor planning",
      "Land-use policy and zoning guidance",
      "Climate-resilient urban design",
      "Investment sequencing and delivery roadmaps",
    ],
    blogs: [
      {
        title: "Growth Without Fragmentation",
        excerpt:
          "How coordinated urban planning prevents infrastructure lag and disconnected development patterns.",
        image: "/images/insight-macro.jpg",
        alt: "Abstract visualization of urban systems and growth",
        date: "Mar 10, 2026",
      },
      {
        title: "Data That Changes City Decisions",
        excerpt:
          "Using spatial and socioeconomic evidence to prioritize interventions where impact is highest.",
        image: "/images/insight-ai.jpg",
        alt: "Digital visualization supporting urban analysis",
        date: "Feb 2, 2026",
      },
      {
        title: "Infrastructure Sequencing for Livable Places",
        excerpt:
          "Aligning roads, utilities, and public space so neighborhoods grow with service quality intact.",
        image: "/images/insight-sustain.jpg",
        alt: "Modern infrastructure supporting urban development",
        date: "Jan 22, 2026",
      },
    ],
  },
  {
    slug: "geophysical-geotechnical-services",
    title: "Geophysical & Geotechnical Services",
    description:
      "Advanced subsurface investigation and engineering analysis for safe, reliable, and high-performance infrastructure.",
    image: "/images/capabilities-geotechnical.jpg",
    offset: true,
    overview:
      "Our geophysical and geotechnical teams help clients understand ground conditions before critical infrastructure decisions are locked in. We provide investigation, interpretation, and engineering insight that reduce construction risk and improve structural performance.",
    approach:
      "We design investigation programs matched to project risk, then translate subsurface findings into clear design and construction recommendations. The result is safer foundations, fewer surprises, and more confident delivery of complex works.",
    focusAreas: [
      "Subsurface investigation and site characterization",
      "Geophysical survey design and interpretation",
      "Geotechnical analysis for foundations and earthworks",
      "Risk assessment for infrastructure corridors",
      "Construction support and design verification",
    ],
    blogs: [
      {
        title: "What the Ground Is Trying to Tell You",
        excerpt:
          "How early geotechnical investigation prevents costly redesign once construction is underway.",
        image: "/images/insight-sustain.jpg",
        alt: "Infrastructure site representing ground investigation",
        date: "Mar 5, 2026",
      },
      {
        title: "Geophysics as a Decision Tool",
        excerpt:
          "When non-invasive surveys sharpen risk profiles and focus drilling where it matters most.",
        image: "/images/insight-ai.jpg",
        alt: "Digital visualization of subsurface analysis",
        date: "Feb 11, 2026",
      },
      {
        title: "Foundations That Match the Risk",
        excerpt:
          "Connecting geotechnical evidence to foundation choices that balance safety, cost, and schedule.",
        image: "/images/insight-macro.jpg",
        alt: "Abstract structural analysis visualization",
        date: "Jan 15, 2026",
      },
    ],
  },
];

